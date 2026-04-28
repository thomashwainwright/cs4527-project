/* eslint-disable @typescript-eslint/no-explicit-any */
import { render } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { useStaff, StaffContext } from "../context/useStaff";

// helper component that consumes the hook
function TestComponent() {
  const { staffData } = useStaff();
  return <div>{staffData?.length}</div>;
}

describe("useStaff hook", () => {
  test("returns context values when wrapped in provider", () => {
    const mockValue = {
      staffData: [{ user_id: 1 }, { user_id: 2 }],
      setStaffData: vi.fn(),
      incrementRefreshKey: vi.fn(),
    };

    const { getByText } = render(
      <StaffContext.Provider value={mockValue as any}>
        <TestComponent />
      </StaffContext.Provider>,
    );

    expect(getByText("2")).toBeInTheDocument();
  });

  test("throws error when used outside provider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<TestComponent />)).toThrow(
      "useStaff must be used within StaffProvider",
    );

    spy.mockRestore();
  });
});
