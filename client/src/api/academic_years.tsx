// Class interacts with API for academic year data.

import api from "./axios";

export const fetchAcademicYears = async () => {
  try {
    const response = await api.get("/api/academic_years"); // request from server
    return response.data;
  } catch (error) {
    console.error("Error fetching academic years:", error);
    throw error;
  }
};
