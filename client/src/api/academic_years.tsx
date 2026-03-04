import api from "./axios";

export const fetchAcademicYears = async () => {
  try {
    const response = await api.get("/api/academic_years");
    return response.data;
  } catch (error) {
    console.error("Error fetching modules:", error);
    throw error;
  }
};
