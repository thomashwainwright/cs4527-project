import { fetchAcademicYears } from "@/api/academic_years";
import { useAcademicYear } from "@/context/AcademicYear";
import type { AcademicYear } from "@/types/academic_year_type";
import { useEffect, useState, type ChangeEvent } from "react";

export default function AcademicYearSelector() {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  // const [selectedYear, setSelectedYear] = useState<AcademicYear>();
  const { selectedYear, setSelectedYear } = useAcademicYear();

  useEffect(() => {
    fetchAcademicYears().then((data) => {
      setAcademicYears(data);
      if (!selectedYear) {
        setSelectedYear(data[data.length - 1]);
      } // TODO possibly add saved prefs
    });
  });

  return (
    selectedYear && (
      <div className="flex flex-row ml-auto gap-8 text-xl items-center">
        <p>Academic Year</p>
        <select
          className="ml-auto border border-gray-500 rounded p-2"
          value={selectedYear.label}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => {
            const yearObj = academicYears.find(
              (year) => year.label === e.target.value,
            );

            if (!yearObj) {
              throw new Error("yearObj does not exist in academicYears");
            }
            setSelectedYear(yearObj);
          }}
        >
          {academicYears.map((year: AcademicYear) => (
            <option key={year.year_id}>{year.label}</option>
          ))}
        </select>
      </div>
    )
  );
}
