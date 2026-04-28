/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, test, expect, vi } from "vitest";
import api from "@/api/axios";
import {
  fetchStaff,
  fetchStaffByUserId,
  fetchStaffByEmail,
  fetchStaffAssignments,
  fetchAllStaffAssignments,
  saveStaff,
  deleteStaff,
} from "@/api/staff";

// mock axios
vi.mock("@/api/axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

vi.mock("axios", () => ({
  isAxiosError: vi.fn(() => true),
}));

describe("staff API", () => {
  test("fetchStaff calls correct endpoint", async () => {
    (api.get as any).mockResolvedValue({ data: ["alice"] });

    const res = await fetchStaff();

    expect(api.get).toHaveBeenCalledWith("/api/staff");
    expect(res).toEqual(["alice"]);
  });

  test("fetchStaffByUserId builds correct URL", async () => {
    (api.get as any).mockResolvedValue({ data: {} });

    await fetchStaffByUserId(10);

    expect(api.get).toHaveBeenCalledWith("/api/staff/user_id/10");
  });

  test("fetchStaffByEmail builds correct URL", async () => {
    (api.get as any).mockResolvedValue({ data: {} });

    await fetchStaffByEmail("alice@test.com");

    expect(api.get).toHaveBeenCalledWith("/api/staff/email/alice@test.com");
  });

  test("fetchStaffAssignments builds correct URL", async () => {
    (api.get as any).mockResolvedValue({ data: [] });

    await fetchStaffAssignments(1, 2);

    expect(api.get).toHaveBeenCalledWith(
      "/api/assignments/user_id/1/year_id/2",
    );
  });

  test("fetchAllStaffAssignments builds correct URL", async () => {
    (api.get as any).mockResolvedValue({ data: [] });

    await fetchAllStaffAssignments(3);

    expect(api.get).toHaveBeenCalledWith("/api/assignments/year_id/3");
  });

  test("saveStaff sends correct payload", async () => {
    (api.post as any).mockResolvedValue({ data: "ok" });

    const staff = {
      user_id: 1,
      name: "Alice",
      pw_changed: true,
    } as any;

    await saveStaff(staff);

    expect(api.post).toHaveBeenCalledWith("/api/staff/commit", {
      staff,
    });
  });

  test("deleteStaff sends correct payload", async () => {
    (api.post as any).mockResolvedValue({ data: "ok" });

    const staff = {
      user_id: 1,
      name: "Alice",
      pw_changed: false,
    } as any;

    await deleteStaff(staff);

    expect(api.post).toHaveBeenCalledWith("/api/staff/delete", {
      staff,
    });
  });
});
