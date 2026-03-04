import type { AcademicYear } from "@/types/academic_year_type";

import { useState, type ReactNode } from "react";
import { AcademicYearContext } from "./AcademicYear";

export const AcademicYearProvider = ({ children }: { children: ReactNode }) => {
  const [selectedYear, setSelectedYear] = useState<AcademicYear | null>(null);

  return (
    <AcademicYearContext.Provider value={{ selectedYear, setSelectedYear }}>
      {children}
    </AcademicYearContext.Provider>
  );
};
