/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, waitFor } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { StaffProvider } from "../context/StaffProvider";
import { useStaff } from "../context/useStaff";

// mock academic year
vi.mock("../context/useAcademicYear", () => ({
  useAcademicYear: () => ({
    selectedYear: { year_id: 1, label: "2025/26" },
  }),
}));

// mock API
const fetchStaffMock = vi.fn();
const fetchAssignmentsMock = vi.fn();

vi.mock("@/api/staff", () => ({
  fetchStaff: () => fetchStaffMock(),
  fetchAllStaffAssignments: () => fetchAssignmentsMock(),
}));

// mock formula evaluator
vi.mock("@/lib/formula", () => ({
  default: vi.fn(() => 10), // always return 10 hours
}));

vi.mock("@/lib/default_formula", () => ({
  default_formula: () => "formula",
}));

// helper test component to read context
function TestComponent() {
  const { staffData, incrementRefreshKey } = useStaff();

  return (
    staffData && (
      <div>
        <button onClick={incrementRefreshKey}>refresh</button>
        <div data-testid="count">{staffData.length}</div>
        <div data-testid="allocation">{staffData[0]?.allocation ?? ""}</div>
      </div>
    )
  );
}

describe("StaffProvider", () => {
  test("loads staff and calculates allocation", async () => {
    fetchStaffMock.mockResolvedValue([
      {
        user_id: 1,
        name: "Alice",
        contract_hours: 100,
      },
    ]);

    fetchAssignmentsMock.mockResolvedValue([
      {
        user_id: 1,
        module_type: "teaching",
        custom_formula: null,
      },
    ]);

    const { getByTestId } = render(
      <StaffProvider>
        <TestComponent />
      </StaffProvider>,
    );

    await waitFor(() => {
      expect(getByTestId("count").textContent).toBe("1");
    });

    // 10 hours / 100 * 100 = 10%
    expect(getByTestId("allocation").textContent).toBe("10");
  });

  test("refresh function triggers re-fetch", async () => {
    fetchStaffMock.mockResolvedValue([
      {
        user_id: 1,
        name: "Alice",
        contract_hours: 100,
      },
    ]);

    fetchAssignmentsMock.mockResolvedValue([]);

    const { getByText } = render(
      <StaffProvider>
        <TestComponent />
      </StaffProvider>,
    );

    await waitFor(() => {
      expect(fetchStaffMock).toHaveBeenCalled();
    });

    const initialCalls = fetchStaffMock.mock.calls.length;

    getByText("refresh").click();

    await waitFor(() => {
      expect(fetchStaffMock.mock.calls.length).toBeGreaterThan(initialCalls);
    });
  });
});
