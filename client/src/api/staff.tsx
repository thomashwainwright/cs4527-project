import api from "./axios";

export const fetchStaff = async () => {
  try {
    const response = await api.get("/api/staff");
    return response.data;
  } catch (error) {
    console.error("Error fetching staff:", error);
    throw error;
  }
};

export const fetchStaffByUserId = async (user_id: number) => {
  try {
    const response = await api.get(`/api/staff/user_id/${user_id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching staff:", error);
    throw error;
  }
};

export const fetchStaffByEmail = async (email: string) => {
  try {
    const response = await api.get(`/api/staff/email/${email}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching staff:", error);
    throw error;
  }
};

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
