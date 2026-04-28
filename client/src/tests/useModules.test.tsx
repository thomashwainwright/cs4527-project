/* eslint-disable @typescript-eslint/no-explicit-any */
import { render } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { useModules, ModuleContext } from "../context/useModules";

// helper component
function TestComponent() {
  const { moduleData } = useModules();
  return <div>{moduleData?.length}</div>;
}

describe("useModules hook", () => {
  test("returns context values when wrapped in provider", () => {
    const mockValue = {
      moduleData: [{ module_id: 1 }, { module_id: 2 }],
      setModuleData: vi.fn(),
      incrementModuleRefreshKey: vi.fn(),
      moduleRefreshKey: 0,
    };

    const { getByText } = render(
      <ModuleContext.Provider value={mockValue as any}>
        <TestComponent />
      </ModuleContext.Provider>,
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
