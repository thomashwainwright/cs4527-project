/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import AcademicYearSelector from "../ui_components/AcademicYearSelector";

// mock data
const mockYears = [
  { year_id: 1, label: "2023/24" },
  { year_id: 2, label: "2024/25" },
  { year_id: 3, label: "2025/26" },
];

const useAcademicYearMock = vi.fn();
const setSelectedYearMock = vi.fn();

vi.mock("@/api/academic_years", () => ({
  fetchAcademicYears: vi.fn(() => Promise.resolve(mockYears)),
}));

vi.mock("@/context/useAcademicYear", () => ({
  useAcademicYear: () => useAcademicYearMock(),
}));

describe("AcademicYearSelector", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  test("changes selected year on dropdown change", async () => {
    useAcademicYearMock.mockReturnValue({
      selectedYear: { year_id: 1, label: "2023/24" },
      setSelectedYear: setSelectedYearMock,
    });

    render(<AcademicYearSelector />);

    const select = await screen.findByRole("combobox");

    fireEvent.change(select, { target: { value: "2025/26" } });

    expect(setSelectedYearMock).toHaveBeenCalledWith({
      year_id: 3,
      label: "2025/26",
    });
  });
});
