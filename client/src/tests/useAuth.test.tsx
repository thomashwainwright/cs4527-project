/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { useAuth } from "@/auth/useAuth";
import { useContext } from "react";

// mock react context
vi.mock("react", async () => {
  const actual = await vi.importActual<any>("react");
  return {
    ...actual,
    useContext: vi.fn(),
  };
});

describe("useAuth", () => {
  test("returns auth context when provided", () => {
    (useContext as any).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      userEmail: "alice@test.com",
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.userEmail).toBe("alice@test.com");
  });

  test("throws error when context is undefined", () => {
    (useContext as any).mockReturnValue(undefined);

    expect(() => renderHook(() => useAuth())).toThrow(
      "useAuth must be used within an AuthProvider",
    );
  });
});
