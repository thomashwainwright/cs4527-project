import api from "./axios";

export const fetchModules = async () => {
  try {
    const response = await api.get("/api/modules");
    return response.data;
  } catch (error) {
    console.error("Error fetching modules:", error);
    throw error;
  }
};

export const fetchModuleDetails = async (code: string) => {
  try {
    const response = await api.get(`/api/modules/${code}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching module details:", error);
    throw error;
  }
};
