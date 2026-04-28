/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { AcademicYearProvider } from "../context/AcademicYearProvider";
import { useAcademicYear } from "../context/useAcademicYear";

// simple consumer component to access context
function TestComponent() {
  const { selectedYear, setSelectedYear } = useAcademicYear();

  return (
    <div>
      <p data-testid="year">{selectedYear ? selectedYear.label : "none"}</p>
      <button onClick={() => setSelectedYear({ year_id: 1, label: "2025/26" })}>
        Set Year
      </button>
    </div>
  );
}

describe("AcademicYearProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  test("provides default null selectedYear", () => {
    render(
      <AcademicYearProvider>
        <TestComponent />
      </AcademicYearProvider>,
    );

    expect(screen.getByTestId("year").textContent).toBe("none");
  });

  test("updates selectedYear via context", () => {
    render(
      <AcademicYearProvider>
        <TestComponent />
      </AcademicYearProvider>,
    );

    fireEvent.click(screen.getByText("Set Year"));

    expect(screen.getByTestId("year").textContent).toBe("2025/26");
  });

  test("stores selectedYear in localStorage when changed", () => {
    const setItemSpy = vi.spyOn(Storage.prototype, "setItem");

    render(
      <AcademicYearProvider>
        <TestComponent />
      </AcademicYearProvider>,
    );

    fireEvent.click(screen.getByText("Set Year"));

    expect(setItemSpy).toHaveBeenCalledWith("academicYearId", "1");
    expect(setItemSpy).toHaveBeenCalledWith("academicYearLabel", "2025/26");
  });
});
