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

export default function HoursTab({tab, include}: {tab: string, include: string[]}) {
  const navigate = useNavigate();
  const staff = useOutletContext<Staff>();
  const { selectedYear } = useAcademicYear();

  const default_formula = tab == "teaching" ? "credits * (alpha * delta + beta * students) * share + coordinator" : (tab == "supervision_marking" ? "credits * students" : "")

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
      tab,
    ).then((assignments: (CombinedAssignmentType)[]) => {
      console.log(`Fetched staff ${tab} assignments.`);
      setData(assignments);
      setData((prev) =>
        prev.map((item) => {
          console.log(item.custom_formula)
          const formula = item.custom_formula != null ? item.custom_formula : default_formula
          return ({
            ...item,
            custom_formula: formula,
            hours: evaluateFormula(item, formula)
          })
        })
        
      );
    });
  }, [staff, selectedYear, tab, default_formula]);

  const setFocused = (assignment: CombinedAssignmentType, focus: boolean) => {
    setData((prev) =>
      prev.map((item) =>
        item.assignment_id === assignment.assignment_id
          ? { ...item, focused: focus }
          : item
      )
    );
  }

  const columns = [
    { key: "alpha", label: "Alpha", render: (a: CombinedAssignmentType) => a.alpha },
    { key: "beta", label: "Beta", render: (a: CombinedAssignmentType) => a.beta },
    { key: "delta", label: "Delta", render: (a: CombinedAssignmentType) => a.delta },
    { key: "share", label: "Share", render: (a: CombinedAssignmentType) => a.share },
    { key: "credits", label: "Credits", render: (a: CombinedAssignmentType) => a.credits },
    { key: "students", label: "Students", render: (a: CombinedAssignmentType) => a.estimated_number_students },
    { key: "coordinator", label: "Coordinator", render: (a: CombinedAssignmentType) => a.coordinator ? "Yes" : "No" },
    { key: "hours", label: "Hours", render: (a: CombinedAssignmentType) => a.hours }
  ];



  return (
    <div className="flex flex-col h-dvh">
      <div className="flex-1 min-h-0 overflow-auto">
        <table className="min-w-full text-xl">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Code</th>
              <th className="px-4 py-2 border">Name</th>
              {columns.filter(col => include.includes(col.key)).map(col => (<th className="px-4 py-2 border">{col.label}</th>))}
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

                {columns.filter(col => include.includes(col.key)).map(col => 
                  <td className="px-4 py-2 border">
                    {col.render(assignment)}
                  </td>)
                }

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