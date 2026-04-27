/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import StaffOverview from "../pages/StaffOverview";

// mock outlet context
vi.mock("react-router", () => ({
  useOutletContext: () => ({
    staff: {
      user_id: 1,
      name: "Alice",
      email: "alice@test.com",
      contract_hours: 100,
      allocation: 0,
    },
    setStaff: vi.fn(),
    data: [
      {
        module_type: "teaching",
        module_id: 1,
        custom_formula: "10",
        alpha: 1,
        beta: 1,
        delta: 1,
        share: 1,
        credits: 10,
        estimated_number_students: 10,
      },
      {
        module_type: "admin",
        module_id: 2,
        custom_formula: "5",
        alpha: 1,
        beta: 1,
        delta: 1,
        share: 1,
        credits: 5,
        estimated_number_students: 5,
      },
    ],
  }),
}));

// mock formula libs
vi.mock("@/lib/formula", () => ({
  default: () => 10,
}));

vi.mock("@/lib/default_formula", () => ({
  default_formula: () => "10",
}));

// mock chart
vi.mock("@/ui_components/DoughnutChart", () => ({
  default: () => <div data-testid="chart" />,
}));

describe("StaffOverview", () => {
  test("renders table headers", () => {
    render(<StaffOverview />);

    expect(screen.getByText("Module Type")).toBeInTheDocument();
    expect(screen.getByText("Count")).toBeInTheDocument();
    expect(screen.getByText("Hours")).toBeInTheDocument();
  });

  test("renders module rows", () => {
    render(<StaffOverview />);

    expect(screen.getByText("Teaching")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();
  });

  //   test("calculates totals correctly", () => {
  //     render(<StaffOverview />);

  //     // teaching (10) + admin (5)
  //     expect(screen.getByText("10")).toBeInTheDocument();
  //     expect(screen.getByText("5")).toBeInTheDocument();

  //     // total = 15
  //     expect(screen.getByText("15.00")).toBeInTheDocument();
  //   });

  //   test("renders contract hours", () => {
  //     render(<StaffOverview />);

  //     expect(screen.getByText("100")).toBeInTheDocument();
  //   });

  //   test("renders remaining allocation", () => {
  //     render(<StaffOverview />);

  //     // 100 - 15 = 85
  //     expect(screen.getByText("85.00")).toBeInTheDocument();
  //   });

  //   test("renders allocation percentage", () => {
  //     render(<StaffOverview />);

  //     // (15 / 100) * 100 = 15%
  //     expect(screen.getByText("15.0")).toBeInTheDocument();
  //   });

  //   test("renders chart", () => {
  //     render(<StaffOverview />);

  //     expect(screen.getByTestId("chart")).toBeInTheDocument();
  //   });
});
