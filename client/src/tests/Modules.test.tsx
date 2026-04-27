/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi } from "vitest";
import { Modules } from "../pages/Modules";

// mock navigation
const navigateMock = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => navigateMock,
}));

// mock academic year
vi.mock("@/context/useAcademicYear", () => ({
  useAcademicYear: () => ({
    selectedYear: { year_id: 1, label: "2025/26" },
  }),
}));

// mock modules context
vi.mock("@/context/useModules", () => ({
  useModules: () => ({
    moduleData: [
      {
        unique_id: 1,
        code: "CS101",
        name: "Intro to CS",
        module_type: "teaching",
        allocation: 0.8,
        individual: false,
      },
    ],
    setModuleData: vi.fn(),
    incrementModuleRefreshKey: vi.fn(),
  }),
}));

// mock staff context
vi.mock("@/context/useStaff", () => ({
  useStaff: () => ({
    incrementRefreshKey: vi.fn(),
  }),
}));

// mock api
vi.mock("../api/modules", () => ({
  fetchModules: vi.fn(() => Promise.resolve([])),
  commitModuleChanges: vi.fn(() => Promise.resolve()),
  commitModuleOfferingChanges: vi.fn(() => Promise.resolve()),
}));

// stub heavy UI bits
vi.mock("../ui_components/PageTitle", () => ({
  default: ({ children }: any) => <h1>{children}</h1>,
}));

vi.mock("../ui_components/Fullscreen", () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("../fullscreen_popups/AddModule", () => ({
  default: () => <div>add module popup</div>,
}));

vi.mock("../fullscreen_popups/OkDialog", () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));

describe("Modules page", () => {
  test("renders page title and module table", () => {
    render(<Modules />);

    expect(screen.getAllByText(/modules/i).length).toBeGreaterThan(2);
    expect(screen.getByText("CS101")).toBeInTheDocument();
    expect(screen.getByText("Intro to CS")).toBeInTheDocument();
  });

  test("filters are visible", () => {
    render(<Modules />);

    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
    expect(screen.getAllByText(/module type/i).length).toBeGreaterThanOrEqual(
      2,
    );
  });

  test("search input updates value", async () => {
    render(<Modules />);

    const user = userEvent.setup();

    const input = screen.getByPlaceholderText(/search/i);

    await user.type(input, "CS");

    expect(input).toHaveValue("CS");
  });

  test("clicking a module row navigates", async () => {
    render(<Modules />);

    const user = userEvent.setup();

    const row = screen.getByText("CS101").closest("tr")!;
    await user.click(row);

    expect(navigateMock).toHaveBeenCalledWith("/modules/CS101");
  });

  test("edit toggle button exists", () => {
    render(<Modules />);

    expect(
      screen.getByRole("button", { name: /edit all modules/i }),
    ).toBeInTheDocument();
  });

  test("add button exists", () => {
    render(<Modules />);

    expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
  });
});
