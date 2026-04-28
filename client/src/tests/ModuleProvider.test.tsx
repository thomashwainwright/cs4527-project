/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { ModuleProvider } from "../context/ModuleProvider";
import { useModules } from "../context/useModules";

const mockYear = { year_id: 1, label: "2025/26" };

vi.mock("../context/useAcademicYear", () => ({
  useAcademicYear: () => ({
    selectedYear: mockYear,
  }),
}));

// mock API
vi.mock("@/api/modules", () => ({
  fetchModulesWithOfferings: vi.fn(() =>
    Promise.resolve([
      { module_id: 1, code: "COMP101" },
      { module_id: 2, code: "COMP102" },
    ]),
  ),
}));

// test consumer
function TestComponent() {
  const { moduleData, incrementModuleRefreshKey } = useModules();

  return (
    <div>
      <div data-testid="count">{moduleData?.length ?? 0}</div>

      <div data-testid="first-id">{moduleData && moduleData[0]?.unique_id}</div>

      <button onClick={incrementModuleRefreshKey}>Refresh</button>
    </div>
  );
}

describe("ModuleProvider", () => {
  test("fetches and provides module data", async () => {
    render(
      <ModuleProvider>
        <TestComponent />
      </ModuleProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("count").textContent).toBe("2");
    });
  });

  test("adds unique_id to each module", async () => {
    render(
      <ModuleProvider>
        <TestComponent />
      </ModuleProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("first-id").textContent).toBe("0");
    });
  });

  test("refresh function triggers re-fetch", async () => {
    const { fetchModulesWithOfferings } = await import("@/api/modules");

    render(
      <ModuleProvider>
        <TestComponent />
      </ModuleProvider>,
    );

    await waitFor(() => {
      expect(fetchModulesWithOfferings).toHaveBeenCalledTimes(3);
    });

    fireEvent.click(screen.getByText("Refresh"));

    await waitFor(() => {
      expect(fetchModulesWithOfferings).toHaveBeenCalledTimes(4);
    });
  });
});
