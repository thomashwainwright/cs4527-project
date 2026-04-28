/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import NavButton from "../ui_components/NavButton";

// mock react-router-dom
let mockPathname = "/";

vi.mock("react-router-dom", () => ({
  NavLink: ({ children, className }: any) => (
    <div data-testid="navlink" className={className}>
      {children}
    </div>
  ),
  useLocation: () => ({
    pathname: mockPathname,
  }),
}));

describe("NavButton", () => {
  test("renders children", () => {
    mockPathname = "/";

    render(<NavButton route="/">Dashboard</NavButton>);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  test("applies active style for exact root route", () => {
    mockPathname = "/";

    render(<NavButton route="/">Dashboard</NavButton>);

    const link = screen.getByTestId("navlink");

    expect(link.className).toContain("bg-blue-600");
  });

  test("applies active style when route is included", () => {
    mockPathname = "/modules/COMP101";

    render(<NavButton route="/modules">Modules</NavButton>);

    const link = screen.getByTestId("navlink");

    expect(link.className).toContain("bg-blue-600");
  });

  test("does NOT apply active style for partial root match", () => {
    mockPathname = "/modules";

    render(<NavButton route="/">Dashboard</NavButton>);

    const link = screen.getByTestId("navlink");

    expect(link.className).not.toContain("bg-blue-600");
  });

  test("applies inactive style when not matching route", () => {
    mockPathname = "/staff";

    render(<NavButton route="/modules">Modules</NavButton>);

    const link = screen.getByTestId("navlink");

    expect(link.className).toContain("text-gray-700");
  });
});
