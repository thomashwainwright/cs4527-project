import { fetchStaffAssignments, fetchStaffByEmail } from "@/api/staff";
import type { Staff } from "@/types/staff_type";
import NavButton from "@/ui_components/NavButton";
import PageTitle from "../ui_components/PageTitle";
import { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import { useAcademicYear } from "@/context/useAcademicYear";
import type { Assignment } from "@/types/assignment_type";
import type { ModuleOffering } from "@/types/module_offering_type";
import evaluateFormula from "@/lib/formula";
import type { Module } from "@/types/module_type";

type CombinedAssignmentType = (Assignment & Module & ModuleOffering & {hours: number | string, focused: boolean})

export default function StaffDetails() {
  const params = useParams();
  const email = params.email as string;
  const { selectedYear } = useAcademicYear();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [staff, setStaff] = useState<Staff | null>(null);

  const [data, setData] = useState<CombinedAssignmentType[]>(
    [],
  );

  useEffect(() => {
    fetchStaffByEmail(email).then((staff_data: Staff) => {
      console.log("Fetched staff by email");
      setStaff(staff_data);

      if (!staff_data || !selectedYear) return;
      const default_formula = (tab: string) => (tab == "teaching" ? "credits * (alpha * delta + beta * students) * share + coordinator" : (tab == "supervision_marking" ? "credits * students" : ""))

      fetchStaffAssignments(
        staff_data.user_id,
        selectedYear?.year_id,
      ).then((assignments: (CombinedAssignmentType)[]) => {
        console.log(`Fetched staff assignments.`);
        setData(assignments);
        console.log(assignments);
        setData((prev) =>
          prev.map((item) => {
            console.log(item.custom_formula)
            const formula = item.custom_formula != null ? item.custom_formula : default_formula(item.module_type) // todo
            return ({
              ...item,
              custom_formula: formula,
              hours: evaluateFormula(item, formula)
            })
          })
          
        );
      });
    });
  }, [email, selectedYear]);

  return (
    <div className="p-12">
      <PageTitle>{email}</PageTitle>
      <div className="w-full flex flex-row gap-16 mt-10 mb-10 text-2xl">
        <NavButton route={`/staff/${email}`}>Overview</NavButton>
        <NavButton route={`/staff/${email}/teaching`}>Teaching</NavButton>
        <NavButton route={`/staff/${email}/supervision_marking`}>
          Supervision/Marking
        </NavButton>
        <NavButton route={`/staff/${email}/admin`}>Admin</NavButton>
      </div>

      <Outlet context={{data, setData}}/>
    </div>
  );
}
