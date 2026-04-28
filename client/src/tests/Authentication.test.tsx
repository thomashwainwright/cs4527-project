/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, waitFor } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { useContext } from "react";
import { AuthContext } from "../auth/authContext";
import { AuthProvider } from "@/auth/Authentication";

// -------------------- mocks --------------------

const navigateMock = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => navigateMock,
}));

const apiMock = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
}));

vi.mock("../api/axios", () => ({
  default: apiMock,
}));

// -------------------- helper --------------------

function TestComponent() {
  const { isAuthenticated, isLoading, userEmail } = useContext(AuthContext);

  return (
    <div>
      <div data-testid="auth">{String(isAuthenticated)}</div>
      <div data-testid="loading">{String(isLoading)}</div>
      <div data-testid="email">{userEmail ?? "null"}</div>
    </div>
  );
}

// -------------------- tests --------------------

describe("AuthProvider", () => {
  test("sets authenticated state after successful check-auth", async () => {
    apiMock.get.mockResolvedValueOnce({
      data: {
        isAuthenticated: true,
        email: "alice@test.com",
      },
    });

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(getByTestId("auth").textContent).toBe("true");
    });

    expect(getByTestId("email").textContent).toBe("alice@test.com");
    expect(getByTestId("loading").textContent).toBe("false");
  });

  test("sets unauthenticated state on check-auth failure", async () => {
    apiMock.get.mockRejectedValueOnce(new Error("fail"));

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(getByTestId("auth").textContent).toBe("false");
    });

    expect(getByTestId("loading").textContent).toBe("false");
  });

  test("login calls API and navigates home", async () => {
    apiMock.get.mockResolvedValueOnce({
      data: { isAuthenticated: false, email: null },
    });

    apiMock.post.mockResolvedValueOnce({
      data: { email: "bob@test.com" },
    });

    function LoginTest() {
      const { login } = useContext(AuthContext);

      return <button onClick={() => login("bob@test.com", "pw")}>login</button>;
    }

    const { getByText } = render(
      <AuthProvider>
        <LoginTest />
      </AuthProvider>,
    );

    getByText("login").click();

    await waitFor(() => {
      expect(apiMock.post).toHaveBeenCalledWith("/api/login", {
        email: "bob@test.com",
        password: "pw",
      });
    });

    expect(navigateMock).toHaveBeenCalledWith("/");
  });

  test("logout calls API and navigates to login", async () => {
    apiMock.get.mockResolvedValueOnce({
      data: { isAuthenticated: true, email: "a@test.com" },
    });

    function LogoutTest() {
      const { logout } = useContext(AuthContext);

      return <button onClick={() => logout()}>logout</button>;
    }

    const { getByText } = render(
      <AuthProvider>
        <LogoutTest />
      </AuthProvider>,
    );

    getByText("logout").click();

    await waitFor(() => {
      expect(apiMock.get).toHaveBeenCalledWith("/api/logout", {});
    });

    expect(navigateMock).toHaveBeenCalledWith("/login");
  });
});
