/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import AddModule from "../fullscreen_popups/AddModule";

// mock API
const fetchModulesMock = vi.fn();

vi.mock("@/api/modules", () => ({
  fetchModulesNotAssignedTo: (...args: any[]) => fetchModulesMock(...args),
}));

// mock academic year context
vi.mock("@/context/useAcademicYear", () => ({
  useAcademicYear: () => ({
    selectedYear: { year_id: 1, label: "2025/26" },
  }),
}));

describe("AddModule", () => {
  const mockModules = [
    { module_id: 1, code: "COMP101", name: "Intro Comp", selected: false },
    { module_id: 2, code: "COMP102", name: "Data Structures", selected: false },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    fetchModulesMock.mockResolvedValue(mockModules);
  });

  test("renders module list after fetch", async () => {
    render(<AddModule onAdd={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText("COMP101")).toBeInTheDocument();
      expect(screen.getByText("COMP102")).toBeInTheDocument();
    });
  });

  test("displays selected academic year label", async () => {
    render(<AddModule onAdd={vi.fn()} />);

    expect(screen.getByText(/2025\/26/i)).toBeInTheDocument();
  });

  test("selects and deselects a module on click", async () => {
    render(<AddModule onAdd={vi.fn()} />);

    await waitFor(() => screen.getByText("COMP101"));

    const row = screen.getByText("COMP101").closest("tr")!;

    // select
    fireEvent.click(row);
    expect(row.className).toContain("bg-green-200");

    // deselect
    fireEvent.click(row);
    expect(row.className).not.toContain("bg-green-200");
  });

  test("calls onAdd with selected modules", async () => {
    const onAddMock = vi.fn();

    render(<AddModule onAdd={onAddMock} />);

    await waitFor(() => screen.getByText("COMP101"));

    const row = screen.getByText("COMP101").closest("tr")!;
    fireEvent.click(row);

    fireEvent.click(screen.getByText("Add"));

    expect(onAddMock).toHaveBeenCalledWith([
      expect.objectContaining({ code: "COMP101" }),
    ]);
  });

  test("calls onAdd with empty array if nothing selected", async () => {
    const onAddMock = vi.fn();

    render(<AddModule onAdd={onAddMock} />);

    await waitFor(() => screen.getByText("COMP101"));

    fireEvent.click(screen.getByText("Add"));

    expect(onAddMock).toHaveBeenCalledWith([]);
  });
});
