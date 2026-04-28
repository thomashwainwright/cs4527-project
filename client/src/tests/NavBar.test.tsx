/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import NavBar from "../ui_components/NavBar";

// mock useAuth
const logoutMock = vi.fn();

vi.mock("@/auth/useAuth", () => ({
  useAuth: () => ({
    logout: logoutMock,
    userEmail: "alice@test.com",
  }),
}));

// mock NavButton
vi.mock("../ui_components/NavButton", () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));

// mock icons
vi.mock("../assets/icons/dashboard-tab.svg", () => ({ default: "icon" }));
vi.mock("../assets/icons/module-tab.svg", () => ({ default: "icon" }));
vi.mock("../assets/icons/staff-tab.svg", () => ({ default: "icon" }));

describe("NavBar", () => {
  test("renders title", () => {
    render(<NavBar />);

    expect(screen.getByText("Workload Manager")).toBeInTheDocument();
  });

  test("renders navigation items", () => {
    render(<NavBar />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Modules")).toBeInTheDocument();
    expect(screen.getByText("Staff")).toBeInTheDocument();
  });

  test("displays logged in user email", () => {
    render(<NavBar />);

    expect(screen.getByText("Logged in as")).toBeInTheDocument();
    expect(screen.getByText("alice@test.com")).toBeInTheDocument();
  });

  test("calls logout on submit", async () => {
    render(<NavBar />);

    const button = screen.getByText("Log Out");

    fireEvent.click(button);

    expect(logoutMock).toHaveBeenCalled();
  });
});
