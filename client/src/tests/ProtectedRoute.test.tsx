/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import ProtectedRoute from "../routes/ProtectedRoute";

// mocks
const mockUseAuth = vi.fn();

vi.mock("@/auth/useAuth", () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock("react-router-dom", () => ({
  Outlet: () => <div data-testid="outlet" />,
  Navigate: ({ to }: any) => <div data-testid="navigate">Redirect to {to}</div>,
}));

describe("ProtectedRoute", () => {
  test("doesn't render while loading", () => {
    mockUseAuth.mockReturnValue({
      isLoading: true,
      isAuthenticated: false,
    });

    const { container } = render(<ProtectedRoute />);

    expect(container).toBeEmptyDOMElement();
  });

  test("renders outlet when authenticated", () => {
    mockUseAuth.mockReturnValue({
      isLoading: false,
      isAuthenticated: true,
    });

    render(<ProtectedRoute />);

    expect(screen.getByTestId("outlet")).toBeInTheDocument();
  });

  test("redirects to login when not authenticated", () => {
    mockUseAuth.mockReturnValue({
      isLoading: false,
      isAuthenticated: false,
    });

    render(<ProtectedRoute />);

    expect(screen.getByTestId("navigate")).toHaveTextContent("/login");
  });
});
