/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi } from "vitest";
import ModuleDetails from "../pages/ModuleDetails";

// mock navigation + route params
const navigateMock = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => navigateMock,
  useParams: () => ({ code: "CS101" }),
}));

// mock academic year context
vi.mock("@/context/useAcademicYear", () => ({
  useAcademicYear: () => ({
    selectedYear: { year_id: 1, label: "2025/26" },
  }),
}));

// mock staff context (used for refresh key)
vi.mock("@/context/useStaff", () => ({
  useStaff: () => ({
    incrementRefreshKey: vi.fn(),
  }),
}));

// mock module API calls
vi.mock("../api/modules", () => ({
  fetchModuleDetails: vi.fn(() =>
    Promise.resolve({
      module_id: 1,
      offering_id: 10,
      code: "CS101",
      name: "Test Module",
      module_type: "teaching",
      individual: false,
      alpha: 4.4,
      beta: 0.15,
      credits: 20,
      estimated_number_students: 100,
    }),
  ),

  fetchModuleAssignments: vi.fn(() =>
    Promise.resolve([
      {
        assignment_id: 1,
        user_id: 1,
        name: "Alice",
        email: "alice@example.com",
        role: "staff",
        delta: 2,
        share: 0.5,
        edit: false,
        del: false,
        new: undefined,
      },
    ]),
  ),

  commitModuleOfferingDetailChanges: vi.fn(() => Promise.resolve()),
  commitAssignmentData: vi.fn(() => Promise.resolve()),
}));

// mock staff fetch api call
vi.mock("@/api/staff", () => ({
  fetchStaffByUserId: vi.fn(() => Promise.resolve({ email: "alice@test.com" })),
}));

// mock big UI components
vi.mock("@/ui_components/PageTitle", () => ({
  default: ({ children }: any) => <h1>{children}</h1>,
}));

vi.mock("@/fullscreen_popups/AssignModule", () => ({
  default: () => <div>assign popup</div>,
}));

vi.mock("@/fullscreen_popups/OkDialog", () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("@/ui_components/Fullscreen", () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));

describe("ModuleDetails page", () => {
  test("renders module title and basic details", async () => {
    render(<ModuleDetails />);

    expect(await screen.findByText(/cs101/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test Module")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2025/26")).toBeInTheDocument();
  });

  test("renders assignment table data", async () => {
    render(<ModuleDetails />);

    expect(await screen.findByText("Alice")).toBeInTheDocument();
  });

  test("clicking staff row triggers navigation", async () => {
    render(<ModuleDetails />);

    const user = userEvent.setup();

    const row = await screen.findByText("Alice");
    await user.click(row);

    expect(navigateMock).toHaveBeenCalled();
  });

  test("save button exists and can be clicked", async () => {
    render(<ModuleDetails />);

    const user = userEvent.setup();

    const saveBtn = await screen.findByRole("button", { name: /save/i });

    await user.click(saveBtn);

    expect(saveBtn).toBeInTheDocument();
  });
});
