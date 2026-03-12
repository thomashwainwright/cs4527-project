
import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import evaluateFormula from "@/lib/formula";
import restoreIcon from "../assets/icons/restore.svg"
import Fullscreen from "@/ui_components/Fullscreen";
import LoadFormulaPopup from "@/fullscreen_popups/LoadFormulaPopup";
import type { AcademicYear } from "@/types/academic_year_type";
import type { CombinedAssignmentType } from "@/types/combined_assignment_type";


export default function HoursTab({tab, include}: {tab: string, include: string[]}) {
  const navigate = useNavigate();
  const { data, setData } = useOutletContext<{
    data: CombinedAssignmentType[];
    setData: React.Dispatch<React.SetStateAction<CombinedAssignmentType[]>>;
  }>();

  const default_formula = tab == "teaching" ? "credits * (alpha * delta + beta * students) * share + coordinator" : (tab == "supervision_marking" ? "credits * students" : "")

  const handleRowClick = (code: string) => {
    navigate(`/module/${code}`);
  };

  const [fullscreenOpen, setFullscreenOpen] = useState<number>(-1);


  const handleFormulaSubmit = (assignment: CombinedAssignmentType, text: string) => {
    if (text == "") {
      text = default_formula;
    }

    setData((prev) =>
      prev.map((item) =>
        item.assignment_id === assignment.assignment_id
          ? { ...item, custom_formula: text, hours: evaluateFormula(assignment, text), focused: false }
          : item
      )
    );
  }

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
    { key: "coordinator", label: "Coordinator", render: (a: CombinedAssignmentType) => a.coordinator ? "Yes (15)" : "No (0)" },
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
            {// filter data and render
            data.filter((item) => item.module_type === tab).map((assignment: CombinedAssignmentType) => (
              <tr
                key={assignment.assignment_id}
                className="clickable-row hover:bg-gray-100 cursor-pointer group"
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
                <td className="group-hover:bg-white">
                  <button aria-label="Restore from previous year" title="Restore from previous year" className="hover:bg-gray-200 ml-2 rounded-lg" onClick={(e) => {e.stopPropagation(); if (assignment.assignment_id) setFullscreenOpen(assignment.assignment_id)}}><img alt="" src={restoreIcon} className="w-10"/></button>
                  <Fullscreen open={fullscreenOpen == assignment.assignment_id} onClose={() => setFullscreenOpen(-1)}><LoadFormulaPopup loadFormula={(year: AcademicYear & {custom_formula: string}) => {setFullscreenOpen(-1); handleFormulaSubmit(assignment, year.custom_formula ?? "")}} offering_id={assignment.offering_id} user_id={assignment.user_id} code={assignment.code}/></Fullscreen>
                </td>
              </tr>
                
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}