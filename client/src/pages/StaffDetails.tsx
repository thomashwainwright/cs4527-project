import { fetchStaffAssignments, fetchStaffByEmail } from "@/api/staff";
import type { Staff } from "@/types/staff_type";
import PageTitle from "../ui_components/PageTitle";
import { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import { useAcademicYear } from "@/context/useAcademicYear";
import evaluateFormula from "@/lib/formula";
import type { CombinedAssignmentType } from "@/types/combined_assignment_type";
import StaffNavButton from "@/ui_components/StaffNavButton";
import { useAuth } from "@/auth/useAuth";

export default function StaffDetails() {
  const params = useParams();
  const email = params.email as string;
  const new_user = email == "new-user";
  const { selectedYear } = useAcademicYear();

  // TODO: temp
  const [staff, setStaff] = useState<Staff | null>(null);
  //

  const { role } = useAuth();

  const [data, setData] = useState<CombinedAssignmentType[]>([]);

  const [refreshKey, setRefreshKey] = useState<number>(0);

  useEffect(() => {
    if (new_user) return;

    fetchStaffByEmail(email).then((staff_data: Staff) => {
      console.log("Fetched staff by email");
      setStaff(staff_data);

      if (!staff_data || !selectedYear || !staff_data.user_id) return;

      const default_formula = (tab: string) =>
        tab == "teaching"
          ? "credits * (alpha * delta + beta * students) * share + coordinator"
          : tab == "supervision_marking"
            ? "credits * students"
            : "0";

      fetchStaffAssignments(staff_data.user_id, selectedYear?.year_id).then(
        (assignments: CombinedAssignmentType[]) => {
          console.log(`Fetched staff assignments.`);
          setData(assignments);
          setData((prev) =>
            prev.map((item) => {
              const formula =
                item.custom_formula != null
                  ? item.custom_formula
                  : default_formula(item.module_type); // todo
              return {
                ...item,
                custom_formula: formula,
                hours: evaluateFormula(item, formula),
              };
            }),
          );
        },
      );
    });
  }, [email, new_user, selectedYear, refreshKey]);

  const incrementDetailsRefreshKey = () => setRefreshKey(refreshKey + 1);

  return (
    <div className="p-12">
      <PageTitle>{email == "new-user" ? "New user" : email}</PageTitle>
      <div className="w-full flex flex-row gap-16 mt-10 mb-10 text-2xl">
        {!new_user && (
          <>
            <StaffNavButton route={`/staff/${email}`}>Overview</StaffNavButton>
            <StaffNavButton route={`/staff/${email}/teaching`}>
              Teaching
            </StaffNavButton>
            <StaffNavButton route={`/staff/${email}/supervision_marking`}>
              Supervision/Marking
            </StaffNavButton>
            <StaffNavButton route={`/staff/${email}/admin`}>
              Admin
            </StaffNavButton>
          </>
        )}
        {role == "user" && (
          <div className="ml-auto">
            <StaffNavButton route={`/staff/${email}/account_details`}>
              Account Details
            </StaffNavButton>
          </div>
        )}
      </div>

      <Outlet
        context={{ data, setData, staff, setStaff, incrementDetailsRefreshKey }}
      />
    </div>
  );
}
