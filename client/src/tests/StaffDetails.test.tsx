/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import StaffDetails from "../pages/StaffDetails";

// mock route params
vi.mock("react-router-dom", () => ({
  useParams: () => ({
    email: "alice@test.com",
  }),
  Outlet: () => <div data-testid="outlet" />,
}));

// mock academic year
vi.mock("@/context/useAcademicYear", () => ({
  useAcademicYear: () => ({
    selectedYear: { year_id: 1, label: "2025/26" },
  }),
}));

// mock API calls
vi.mock("@/api/staff", () => ({
  fetchStaffByEmail: vi.fn(() =>
    Promise.resolve({
      user_id: 1,
      name: "Alice",
      email: "alice@test.com",
    }),
  ),

  fetchStaffAssignments: vi.fn(() =>
    Promise.resolve([
      {
        module_type: "teaching",
        credits: 10,
        delta: 2,
        students: 30,
        share: 0.5,
        coordinator: 1,
        custom_formula: null,
      },
    ]),
  ),
}));

// stub UI components
vi.mock("../ui_components/PageTitle", () => ({
  default: ({ children }: any) => <h1>{children}</h1>,
}));

vi.mock("../ui_components/StaffNavButton", () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));

describe("StaffDetails page", () => {
  test("renders page title", () => {
    render(<StaffDetails />);

    expect(screen.getByText("alice@test.com")).toBeInTheDocument();
  });

  test("renders navigation buttons for staff user", () => {
    render(<StaffDetails />);

    expect(screen.getByText("Overview")).toBeInTheDocument();
    expect(screen.getByText("Teaching")).toBeInTheDocument();
    expect(screen.getByText("Supervision/Marking")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();
    // expect(screen.getByText("Account Details")).toBeInTheDocument();
  });

  test("renders outlet", () => {
    render(<StaffDetails />);

    expect(screen.getByTestId("outlet")).toBeInTheDocument();
  });
});
