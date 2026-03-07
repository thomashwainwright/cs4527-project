import { fetchStaffAssignments } from "@/api/staff";
import type { Assignment } from "@/types/assignment_type";
import type { Staff } from "@/types/staff_type";
import type { Module } from "@/types/module_type";

import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useAcademicYear } from "@/context/useAcademicYear";
import type { ModuleOffering } from "@/types/module_offering_type";
import evaluateFormula from "@/lib/formula";

type CombinedAssignmentType = (Assignment & Module & ModuleOffering & {hours: number | string, focused: boolean})

export default function StaffTeaching() {
  const navigate = useNavigate();
  const staff = useOutletContext<Staff>();
  const { selectedYear } = useAcademicYear();

  const handleRowClick = (code: string) => {
    navigate(`/module/${code}`);
  };

  const [data, setData] = useState<CombinedAssignmentType[]>(
    [],
  );

  const handleFormulaSubmit = (assignment: CombinedAssignmentType, text: string) => {
    console.log("submit")
    console.log(text)
    
    
    if (text == "") {
      return
    }

    setData((prev) =>
      prev.map((item) =>
        item.assignment_id === assignment.assignment_id
          ? { ...item, custom_formula: text, hours: evaluateFormula(assignment, text), focused: false }
          : item
      )
    );
  }

  useEffect(() => {
    if (!staff || !selectedYear) return;
    fetchStaffAssignments(
      staff.user_id,
      selectedYear?.year_id,
      "teaching",
    ).then((assignments: (CombinedAssignmentType)[]) => {
      console.log("Fetched staff teaching assignments.");
      setData(assignments);
    });
  }, [staff, selectedYear]);

  const setFocused = (assignment: CombinedAssignmentType, focus: boolean) => {
    setData((prev) =>
      prev.map((item) =>
        item.assignment_id === assignment.assignment_id
          ? { ...item, focused: focus }
          : item
      )
    );
  }

  return (
    <div className="flex flex-col h-dvh">
      <div className="flex-1 min-h-0 overflow-auto">
        <table className="min-w-full text-xl">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Code</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Alpha</th>
              <th className="px-4 py-2 border">Beta</th>
              <th className="px-4 py-2 border">Delta</th>
              <th className="px-4 py-2 border">Share</th>
              <th className="px-4 py-2 border">Credits</th>
              <th className="px-4 py-2 border">Students</th>

              <th className="px-4 py-2 border">Coordinator</th>
              <th className="px-4 py-2 border">Hours</th>
            </tr>
          </thead>

          <tbody>
            {data.map((assignment: CombinedAssignmentType) => (
              <tr
                key={assignment.assignment_id}
                className="clickable-row hover:bg-gray-100 cursor-pointer"
                onClick={() => handleRowClick(assignment.code)}
              >
                <td className="px-4 py-2 border">{assignment.code}</td>
                <td className="px-4 py-2 border">{assignment.name}</td>
                <td className="px-4 py-2 border">{assignment.alpha}</td>
                <td className="px-4 py-2 border">{assignment.beta}</td>
                <td className="px-4 py-2 border">{assignment.delta}</td>
                <td className="px-4 py-2 border">{assignment.share}</td>
                <td className="px-4 py-2 border">{assignment.credits}</td>
                <td className="px-4 py-2 border">
                  {assignment.estimated_number_students}
                </td>

                <td className="px-4 py-2 border">
                  {assignment.coordinator ? "Yes" : "No"}
                </td>
                <td className={"px-4 py-2 border " + (!assignment.focused && assignment.hours == "ERROR" && "bg-red-200")} contentEditable suppressContentEditableWarning onClick={(e)=>{
                  e.stopPropagation()
                  setFocused(assignment, true)
                  console.log(assignment.custom_formula)
                }} onKeyDown={(e: React.KeyboardEvent<HTMLTableCellElement> ) => {
                  if (e.key == "Enter") {
                    console.log("Enter submit")
                    e.preventDefault();
                    e.currentTarget?.blur();
                    handleFormulaSubmit(assignment, e.currentTarget.textContent)
                  }
                }} onBlur={(e: React.FocusEvent<HTMLTableCellElement>) => {
                  handleFormulaSubmit(assignment, e.currentTarget.textContent)}
                }>
                  {assignment.focused ? assignment.custom_formula : assignment.hours}
               </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


