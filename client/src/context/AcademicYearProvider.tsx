import type { AcademicYear } from "@/types/academic_year_type";

import { useEffect, useState, type ReactNode } from "react";
import { AcademicYearContext } from "./useAcademicYear";

export const AcademicYearProvider = ({ children }: { children: ReactNode }) => {
  const [selectedYear, setSelectedYear] = useState<AcademicYear | null>(null);

  useEffect(() => {
    if (selectedYear) {
      // use storage to remember selected academic year for reloads.
      localStorage.setItem("academicYearId", selectedYear.year_id.toString());
      localStorage.setItem("academicYearLabel", selectedYear.label);
    }
  }, [selectedYear]);

  return (
    <AcademicYearContext.Provider value={{ selectedYear, setSelectedYear }}>
      {children}
    </AcademicYearContext.Provider>
  );
};
