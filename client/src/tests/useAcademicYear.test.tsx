/* eslint-disable @typescript-eslint/no-explicit-any */
import { render } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import {
  useAcademicYear,
  AcademicYearContext,
} from "../context/useAcademicYear";

function TestComponent() {
  const { selectedYear } = useAcademicYear();
  return <div>{selectedYear?.label}</div>;
}

describe("useAcademicYear", () => {
  test("returns context values when wrapped in provider", () => {
    const wrapperValue = {
      selectedYear: { year_id: 1, label: "2025/26" },
      setSelectedYear: () => {},
    };

    const { getByText } = render(
      <AcademicYearContext.Provider value={wrapperValue}>
        <TestComponent />
      </AcademicYearContext.Provider>,
    );

    expect(getByText("2025/26")).toBeInTheDocument();
  });

  test("throws error when used outside provider", () => {
    // suppress expected error log in test output
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<TestComponent />)).toThrow(
      "useAcademicYear must be used within AcademicYearProvider",
    );

    spy.mockRestore();
  });
});
