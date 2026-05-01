/* eslint-disable @typescript-eslint/no-explicit-any */
import { render } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { useContext } from "react";
import { AuthContext } from "../auth/authContext";

// helper component context
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

describe("AuthContext", () => {
  test("provides default values when no provider is used", () => {
    const { getByTestId } = render(<TestComponent />);

    expect(getByTestId("auth").textContent).toBe("false");
    expect(getByTestId("loading").textContent).toBe("true");
    expect(getByTestId("email").textContent).toBe("null");
  });

  test("allows overridden provider values", () => {
    const mockLogin = vi.fn();
    const mockLogout = vi.fn();

    const mockValue = {
      isAuthenticated: true,
      isLoading: false,
      login: mockLogin,
      logout: mockLogout,
      userEmail: "alice@test.com",
    };

    const { getByTestId } = render(
      <AuthContext.Provider value={mockValue as any}>
        <TestComponent />
      </AuthContext.Provider>,
    );

    expect(getByTestId("auth").textContent).toBe("true");
    expect(getByTestId("loading").textContent).toBe("false");
    expect(getByTestId("email").textContent).toBe("alice@test.com");
  });

  test("login and logout functions exist and are callable", async () => {
    const mockLogin = vi.fn().mockResolvedValue(undefined);
    const mockLogout = vi.fn().mockResolvedValue(undefined);

    const TestActions = () => {
      const { login, logout } = useContext(AuthContext);

      return (
        <div>
          <button onClick={() => login("a", "b")}>login</button>
          <button onClick={() => logout()}>logout</button>
        </div>
      );
    };

    const { getByText } = render(
      <AuthContext.Provider
        value={{
          isAuthenticated: false,
          isLoading: false,
          login: mockLogin,
          logout: mockLogout,
          userEmail: null,
          role: "user",
        }}
      >
        <TestActions />
      </AuthContext.Provider>,
    );

    await getByText("login").click();
    await getByText("logout").click();

    expect(mockLogin).toHaveBeenCalledWith("a", "b");
    expect(mockLogout).toHaveBeenCalled();
  });
});
