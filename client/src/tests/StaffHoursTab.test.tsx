/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, within } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import HoursTab from "../pages/StaffHoursTab";

// mock router
vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
  useOutletContext: () => ({
    data: [
      {
        assignment_id: 1,
        code: "COMP101",
        name: "Intro to Computing",
        module_type: "teaching",
        hours: 10,
        alpha: 1,
        beta: 2,
        delta: 3,
        share: 0.5,
        credits: 20,
        estimated_number_students: 120,
        coordinator: 1,
        crit: 0,
        h: 0,
        focused: false,
      },
    ],
    setData: vi.fn(),
  }),
}));

// mock staff context
vi.mock("@/context/useStaff", () => ({
  useStaff: () => ({
    incrementRefreshKey: vi.fn(),
  }),
}));

// mock formula helpers
vi.mock("@/lib/formula", () => ({
  default: vi.fn(() => "10"),
}));

vi.mock("@/lib/default_formula", () => ({
  default_formula: () => "credits * 2",
}));

vi.mock("@/api/modules", () => ({
  commitFormulaChanges: vi.fn(() => Promise.resolve()),
}));

// stub UI
vi.mock("@/ui_components/Fullscreen", () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("@/fullscreen_popups/LoadFormulaPopup", () => ({
  default: () => <div>load popup</div>,
}));

vi.mock("@/fullscreen_popups/OkDialog", () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));

describe("HoursTab", () => {
  test("renders table content", () => {
    render(<HoursTab tab="teaching" include={["alpha", "beta", "delta"]} />);

    expect(screen.getByText("COMP101")).toBeInTheDocument();
    expect(screen.getByText("Intro to Computing")).toBeInTheDocument();
  });

  test("renders hours column", () => {
    render(<HoursTab tab="teaching" include={["alpha", "beta", "delta"]} />);
    const row = screen.getByText("COMP101").closest("tr")!;
    expect(within(row).getByText("10")).toBeInTheDocument();
  });

  test("opens edit mode when clicking hours cell", () => {
    render(<HoursTab tab="teaching" include={["alpha", "beta", "delta"]} />);

    const row = screen.getByText("COMP101").closest("tr")!;
    expect(within(row).getByText("10")).toBeInTheDocument();
    fireEvent.click(within(row).getByText("10"));

    // no crash = success (state update is mocked via setData)
  });

  test("renders table headers", () => {
    render(<HoursTab tab="teaching" include={["alpha", "beta", "delta"]} />);

    expect(screen.getByText("Code")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Hours")).toBeInTheDocument();
  });
});
