import { isAxiosError } from "axios";
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

export const fetchModulesWithOfferings = async (year_id: number) => {
  try {
    const response = await api.get(`/api/module_offerings/${year_id}`);
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

export const fetchModuleAssignments = async (module_id: number) => {
  try {
    const response = await api.get(
      `/api/assignments/module_id/${module_id.toString()}`,
    );
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.log(error.response?.data.message); // do something with this
    } else {
      console.error("Error fetching module assignments:", error);
      throw error;
    }
  }
};
