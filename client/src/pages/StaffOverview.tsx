// import { fetchStaffAssignments } from "@/api/staff";
// import { useAcademicYear } from "@/context/useAcademicYear";
// import evaluateFormula from "@/lib/formula";
// import type { Assignment } from "@/types/assignment_type";
// import type { ModuleOffering } from "@/types/module_offering_type";
// import type { Staff } from "@/types/staff_type";
// import type Module from "module";
// import { useEffect, useState } from "react";
// import { useOutletContext } from "react-router";

// type CombinedAssignmentType = (Assignment & Module & ModuleOffering & {hours: number | string, focused: boolean})


export default function StaffOverview() {
  // const staff = useOutletContext<Staff>();
  // const { selectedYear } = useAcademicYear();
  // const [data, setData] = useState<CombinedAssignmentType[]>(
  //   [],
  // );

  // const tab = "teaching";

  // const default_formula = tab == "teaching" ? "credits * (alpha * delta + beta * students) * share + coordinator" : (tab == "supervision_marking" ? "credits * students" : "")

  
  // useEffect(() => {
  //   if (!staff || !selectedYear) return;
  //   fetchStaffAssignments(
  //     staff.user_id,
  //     selectedYear?.year_id,
  //     tab,
  //   ).then((assignments: (CombinedAssignmentType)[]) => {
  //     console.log(`Fetched staff ${tab} assignments.`);
  //     setData(assignments);
  //     setData((prev) =>
  //       prev.map((item) => {
  //         console.log(item.custom_formula)
  //         const formula = item.custom_formula != null ? item.custom_formula : default_formula
  //         return ({
  //           ...item,
  //           custom_formula: formula,
  //           hours: evaluateFormula(item, formula)
  //         })
  //       })
        
  //     );
  //   });
  // }, [staff, selectedYear, tab, default_formula]);
  
  return <div className="p-12">overview {}</div>;
}
