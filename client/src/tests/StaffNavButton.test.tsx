/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import NavButton from "../ui_components/StaffNavButton";

let isActiveMock = false;

// proper NavLink mock
vi.mock("react-router-dom", () => ({
  NavLink: ({ children, className }: any) => {
    const resolvedClass =
      typeof className === "function"
        ? className({ isActive: isActiveMock })
        : className;

    return (
      <a data-testid="navlink" className={resolvedClass}>
        {children}
      </a>
    );
  },
}));

describe("NavButton", () => {
  beforeEach(() => {
    isActiveMock = false;
  });

  test("renders children", () => {
    render(<NavButton route="/staff">Staff</NavButton>);

    expect(screen.getByText("Staff")).toBeInTheDocument();
  });

  test("applies active styles when active", () => {
    isActiveMock = true;

    render(<NavButton route="/staff">Staff</NavButton>);

    const link = screen.getByTestId("navlink");

    expect(link.className).toContain("bg-blue-600");
    expect(link.className).toContain("text-white");
  });

  test("applies inactive styles when not active", () => {
    isActiveMock = false;

    render(<NavButton route="/staff">Staff</NavButton>);

    const link = screen.getByTestId("navlink");

    expect(link.className).toContain("text-gray-700");
    expect(link.className).toContain("hover:bg-gray-200");
    expect(link.className).not.toContain("bg-blue-600");
  });
});
