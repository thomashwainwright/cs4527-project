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
    const response = await api.get(`/api/staff/${user_id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching staff:", error);
    throw error;
  }
};
