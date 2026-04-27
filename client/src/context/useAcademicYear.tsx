import { createContext, useContext } from "react";
import type { AcademicYearContextType } from "@/types/academic_year_type";

export const AcademicYearContext = createContext<
  AcademicYearContextType | undefined
>(undefined);

export const useAcademicYear = () => {
  const context = useContext(AcademicYearContext);
  if (!context) {
    // if app not wrapped in provider, error.

    throw new Error("useAcademicYear must be used within AcademicYearProvider");
  }
  return context;
};
