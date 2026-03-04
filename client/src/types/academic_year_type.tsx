import type { Dispatch, SetStateAction } from "react";

export type AcademicYear = {
  year_id: number;
  label: string;
};

export type AcademicYearContextType = {
  selectedYear: AcademicYear | null;
  setSelectedYear: Dispatch<SetStateAction<AcademicYear | null>>;
};
