import { fetchOtherYearsFormula } from "@/api/modules";
import type { AcademicYear } from "@/types/academic_year_type";
import { useEffect, useState } from "react";

export default function LoadFormulaPopup({
  offering_id,
  user_id,
  code,
  loadFormula,
}: {
  offering_id: number;
  user_id: number;
  code: string;
  loadFormula: (year: AcademicYear & { custom_formula: string }) => void;
}) {
  const [academicYears, setAcademicYears] =
    useState<(AcademicYear & { custom_formula: string })[]>();

  // fetch formulas from other years
  useEffect(() => {
    if (!offering_id || !user_id) return;

    fetchOtherYearsFormula(offering_id, user_id).then((data) => {
      setAcademicYears(data);
    });
  }, [offering_id, user_id]);

  return (
    <div className="p-4">
      {/* title */}
      <div className="text-2xl mb-4">
        Load formula from other year for {code}
      </div>

      {/* list of years */}
      <table>
        <thead>
          <tr>
            <td className="p-2">
              <b>Year</b>
            </td>
            <td className="p-2">
              <b>Value</b>
            </td>
          </tr>
        </thead>

        <tbody>
          {/* clickable rows to load a formula */}
          {academicYears
            ?.sort((a, b) => {
              const getYear = (label: string) => Number(label.slice(-2)) || 0;

              return getYear(b.label) - getYear(a.label);
            })
            .map((year) => (
              <tr
                onClick={() => loadFormula(year)} // select this year
                className="hover:bg-gray-200 hover:cursor-pointer"
              >
                <td className="p-2">{year.label}</td>
                <td className="p-2">{year.custom_formula ?? "None"}</td>
              </tr>
            ))}

          {/* fallback if no data */}
          {academicYears?.length == 0 && (
            <tr>
              <td>No data</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
