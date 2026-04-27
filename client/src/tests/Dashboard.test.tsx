import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi } from "vitest";
import { Dashboard } from "../pages/Dashboard";

// mock navigation so we can check redirects
const navigateMock = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => navigateMock,
}));

vi.mock("@/context/useAcademicYear", () => ({
  useAcademicYear: () => ({
    selectedYear: "2025/26",
    setSelectedYear: vi.fn(),
  }),
}));

// fake staff data for testing
vi.mock("@/context/useStaff", () => ({
  useStaff: () => ({
    staffData: [
      {
        name: "Alice",
        email: "alice@example.com",
        role: "teaching",
        allocation: 120,
        allocation_teaching: 60,
        allocation_supervision_marking: 20,
        allocation_admin: 10,
      },
      {
        name: "Bob",
        email: "bob@example.com",
        role: "teaching",
        allocation: 80,
        allocation_teaching: 30,
        allocation_supervision_marking: 10,
        allocation_admin: 5,
      },
    ],
  }),
}));

// fake module data
vi.mock("@/context/useModules", () => ({
  useModules: () => ({
    moduleData: [
      {
        name: "Module A",
        code: "CS1001",
        allocation: 130,
        individual: false,
      },
      {
        name: "Module B",
        code: "CS1002",
        allocation: 90,
        individual: false,
      },
    ],
  }),
}));

// we don’t care about chart rendering here, so just stub it out
vi.mock("@/ui_components/DoughnutChart", () => ({
  default: () => <div data-testid="doughnut-chart" />,
}));

describe("Dashboard component", () => {
  test("renders main comnponents of the page", () => {
    render(<Dashboard />);

    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();

    expect(screen.getByText(/total staff allocation/i)).toBeInTheDocument();
    expect(
      screen.getByText(/non-individual module allocation/i),
    ).toBeInTheDocument();

    expect(screen.getByTestId("doughnut-chart")).toBeInTheDocument();
  });

  test("shows staff and module problem entries", () => {
    render(<Dashboard />);

    // check some known data appears in the table
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Module A")).toBeInTheDocument();
    expect(screen.getByText("Module B")).toBeInTheDocument();
  });

  test("allows user to change tolerance input", async () => {
    render(<Dashboard />);

    const user = userEvent.setup();

    const input = screen.getByRole("spinbutton");

    await user.clear(input);
    await user.type(input, "10");

    expect(input).toHaveValue(10);
  });

  test("clicking a row triggers navigation", async () => {
    render(<Dashboard />);

    const user = userEvent.setup();

    const row = screen.getByText("Alice").closest("tr")!;
    await user.click(row);

    expect(navigateMock).toHaveBeenCalled();
  });
});
