import { isAxiosError } from "axios";
import api from "./axios";
import type { CombinedModuleType } from "@/types/combined_module_type";
import type { AcademicYear } from "@/types/academic_year_type";


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
    console.error("Error fetching module offerings:", error);
    throw error;
  }
};

export const fetchModuleDetails = async (code: string, year_id: number) => {
  try {
    const response = await api.get(`/api/module_offerings/${code}/year_id/${year_id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching module details:", error);
    throw error;
  }
};

export const fetchModuleAssignments = async (
  module_id: number,
  year_id: number,
) => {
  try {
    // app.get("/api/assignments/module_id/:module_id/year_id/:year_id", async (req, res) => {

    const response = await api.get(
      `/api/assignments/module_id/${module_id.toString()}/year_id/${year_id.toString()}`,
    );

    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.log(error.response?.data.message); // do something with this (no assignments)
    } else {
      console.error("Error fetching module assignments:", error);
      throw error;
    }
  }
};


export const fetchOtherYearsFormula = async (
  offering_id: number,
  user_id: number
) => {
  try {
    // app.get("/api/assignments/module_id/:module_id/year_id/:year_id", async (req, res) => {

    const response = await api.get(
      `/api/formula/by_offering_id/${offering_id.toString()}/user_id/${user_id.toString()}`,
    );

    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.log(error.response?.data.message); // do something with this (no assignments)
    } else {
      console.error("Error fetching module assignments:", error);
      throw error;
    }
  }
};

export const fetchModulesNotAssignedTo = async (
  year: AcademicYear
) => {
  try {
    // app.get("/api/assignments/module_id/:module_id/year_id/:year_id", async (req, res) => {

    const response = await api.get(
      `/api/modules/not_assigned_to/${year.year_id.toString()}`,
    );

    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.log(error.response?.data.message); // do something with this (no assignments)
    } else {
      console.error("Error fetching module assignments:", error);
      throw error;
    }
  }
};

// POSTs

export const commitModuleChanges =  async (
  deletedData: CombinedModuleType[] | undefined,
  editedData: CombinedModuleType[] | undefined,
  newData: CombinedModuleType[] | undefined,
) => {
  try {
    const response = await api.post("/api/modules/commit", {
      deleted: deletedData,
      edited: editedData,
      created: newData,
    });

    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error(error.response?.data?.message);
    } else {
      console.error("Error committing module changes:", error);
      throw error;
    }
  }
};

export const commitModuleOfferingChanges =  async (
  deletedData: CombinedModuleType[] | undefined,
  editedData: CombinedModuleType[] | undefined,
  newData: CombinedModuleType[] | undefined,
  year_id: number
) => {


  try {
    const response = await api.post("/api/module_offerings/commit", {
      deleted: deletedData,
      edited: editedData,
      created: newData,
      year_id: year_id
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
}

export const commitModuleOfferingDetailChanges =  async (
  offering_id: number | undefined,
  estimated_number_students: number | undefined, 
  alpha: number | undefined, 
  beta: number | undefined, 
  crit: number | undefined, 
  credits: number | undefined, 
  h: number | undefined,
) => {
  try {
    const response = await api.post("/api/module_offerings/commit-details", {
      offering_id: offering_id,
      estimated_number_students: estimated_number_students,
      alpha: alpha,
      beta: beta,
      crit: crit,
      credits: credits,
      h: h,
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
