/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, test, expect, vi } from "vitest";
import api from "@/api/axios";
import {
  fetchModules,
  fetchModulesWithOfferings,
  fetchModuleDetails,
  fetchModuleAssignments,
  fetchOtherYearsFormula,
  fetchModulesNotAssignedTo,
  fetchAvailableStaff,
  commitModuleChanges,
  commitModuleOfferingChanges,
  commitModuleOfferingDetailChanges,
  commitAssignmentData,
  commitFormulaChanges,
} from "@/api/modules";

// mock axios instance
vi.mock("@/api/axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

vi.mock("axios", () => ({
  isAxiosError: vi.fn(() => true),
}));

describe("modules API", () => {
  test("fetchModules returns data", async () => {
    (api.get as any).mockResolvedValue({ data: ["m1"] });

    const res = await fetchModules();

    expect(api.get).toHaveBeenCalledWith("/api/modules");
    expect(res).toEqual(["m1"]);
  });

  test("fetchModulesWithOfferings builds correct URL", async () => {
    (api.get as any).mockResolvedValue({ data: [] });

    await fetchModulesWithOfferings(5);

    expect(api.get).toHaveBeenCalledWith("/api/module_offerings/5");
  });

  test("fetchModuleDetails builds correct URL", async () => {
    (api.get as any).mockResolvedValue({ data: {} });

    await fetchModuleDetails("COMP101", 2);

    expect(api.get).toHaveBeenCalledWith(
      "/api/module_offerings/COMP101/year_id/2",
    );
  });

  test("fetchModuleAssignments builds correct URL", async () => {
    (api.get as any).mockResolvedValue({ data: [] });

    await fetchModuleAssignments(10, 2);

    expect(api.get).toHaveBeenCalledWith(
      "/api/assignments/module_id/10/year_id/2",
    );
  });

  test("fetchOtherYearsFormula builds correct URL", async () => {
    (api.get as any).mockResolvedValue({ data: [] });

    await fetchOtherYearsFormula(1, 2);

    expect(api.get).toHaveBeenCalledWith(
      "/api/formula/by_offering_id/1/user_id/2",
    );
  });

  test("fetchModulesNotAssignedTo uses year_id", async () => {
    (api.get as any).mockResolvedValue({ data: [] });

    await fetchModulesNotAssignedTo({ year_id: 3, label: "2025" } as any);

    expect(api.get).toHaveBeenCalledWith("/api/modules/not_assigned_to/3");
  });

  test("fetchAvailableStaff uses offering_id", async () => {
    (api.get as any).mockResolvedValue({ data: [] });

    await fetchAvailableStaff(99);

    expect(api.get).toHaveBeenCalledWith("/api/staff/not_assigned_to/99");
  });

  test("commitModuleChanges sends correct payload", async () => {
    (api.post as any).mockResolvedValue({ data: "ok" });

    await commitModuleChanges([{ id: 1 }] as any, [], []);

    expect(api.post).toHaveBeenCalledWith("/api/modules/commit", {
      deleted: [{ id: 1 }],
      edited: [],
      created: [],
    });
  });

  test("commitModuleOfferingChanges sends year_id", async () => {
    (api.post as any).mockResolvedValue({ data: "ok" });

    await commitModuleOfferingChanges([], [], [], 7);

    expect(api.post).toHaveBeenCalledWith("/api/module_offerings/commit", {
      deleted: [],
      edited: [],
      created: [],
      year_id: 7,
    });
  });

  test("commitModuleOfferingDetailChanges sends correct payload", async () => {
    (api.post as any).mockResolvedValue({ data: "ok" });

    await commitModuleOfferingDetailChanges(1, 2, 3, 4, 5, 6, 7);

    expect(api.post).toHaveBeenCalledWith(
      "/api/module_offerings/commit-details",
      {
        offering_id: 1,
        estimated_number_students: 2,
        alpha: 3,
        beta: 4,
        crit: 5,
        credits: 6,
        h: 7,
      },
    );
  });

  test("commitAssignmentData sends payload", async () => {
    (api.post as any).mockResolvedValue({ data: "ok" });

    await commitAssignmentData([{ id: 1 }] as any, [], []);

    expect(api.post).toHaveBeenCalledWith("/api/staff_assignments/commit", {
      deleted: [{ id: 1 }],
      edited: [],
      created: [],
    });
  });

  test("commitFormulaChanges sends edited data", async () => {
    (api.post as any).mockResolvedValue({ data: "ok" });

    await commitFormulaChanges([{ id: 1 }] as any);

    expect(api.post).toHaveBeenCalledWith(
      "/api/staff_assignments/commit-formula",
      {
        edited: [{ id: 1 }],
      },
    );
  });
});
