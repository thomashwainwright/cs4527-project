// Class interacts with API for staff data.

import { isAxiosError } from "axios";
import api from "./axios";
import type { Staff } from "@/types/staff_type";

// fetch list of all staff
export const fetchStaff = async () => {
  try {
    const response = await api.get("/api/staff");
    return response.data;
  } catch (error) {
    console.error("Error fetching staff:", error);
    throw error;
  }
};

// fetch staff member by user id
export const fetchStaffByUserId = async (user_id: number) => {
  try {
    const response = await api.get(`/api/staff/user_id/${user_id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching staff:", error);
    throw error;
  }
};

// fetch staff member by email
export const fetchStaffByEmail = async (email: string) => {
  try {
    const response = await api.get(`/api/staff/email/${email}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching staff:", error);
    throw error;
  }
};

// fetch assignments for a specific staff member by user id and academic year
export const fetchStaffAssignments = async (
  user_id: number,
  year_id: number,
) => {
  try {
    const response = await api.get(
      `/api/assignments/user_id/${user_id}/year_id/${year_id}`,
    ); // /api/assignments/user_id/:user_id/type/:type
    return response.data;
  } catch (error) {
    console.error("Error fetching staff:", error);
    throw error;
  }
};

// fetch all staff assignments for a given academic year
// /api/assignments/year_id/:year_id
export const fetchAllStaffAssignments = async (year_id: number) => {
  try {
    const response = await api.get(`/api/assignments/year_id/${year_id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching staff:", error);
    throw error;
  }
};

// save or update a staff member (including password change flag)
export const saveStaff = async (staff: Staff & { pw_changed: boolean }) => {
  try {
    const response = await api.post("/api/staff/commit", {
      staff: staff,
    });

    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error(error.response?.data);
      throw error;
    } else {
      console.error("Error committing module offering changes:", error);
      throw error;
    }
  }
};

// delete a staff member
export const deleteStaff = async (staff: Staff & { pw_changed: boolean }) => {
  try {
    const response = await api.post("/api/staff/delete", {
      staff: staff,
    });

    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error(error.response?.data?.message);
    } else {
      console.error("Error committing module offering changes:", error);
      throw error;
    }
  }
};
