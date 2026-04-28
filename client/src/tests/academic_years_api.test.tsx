/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, test, expect, vi } from "vitest";
import { fetchAcademicYears } from "@/api/academic_years";
import api from "@/api/axios";

// mock axios instance
vi.mock("@/api/axios", () => ({
  default: {
    get: vi.fn(),
  },
}));

describe("fetchAcademicYears", () => {
  test("returns data on success", async () => {
    (api.get as any).mockResolvedValue({
      data: [
        { year_id: 1, label: "2024/25" },
        { year_id: 2, label: "2025/26" },
      ],
    });

    const result = await fetchAcademicYears();

    expect(api.get).toHaveBeenCalledWith("/api/academic_years");
    expect(result).toEqual([
      { year_id: 1, label: "2024/25" },
      { year_id: 2, label: "2025/26" },
    ]);
  });

  test("throws error when API fails", async () => {
    (api.get as any).mockRejectedValue(new Error("Network error"));

    await expect(fetchAcademicYears()).rejects.toThrow("Network error");

    expect(api.get).toHaveBeenCalledWith("/api/academic_years");
  });
});
