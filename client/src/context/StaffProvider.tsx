import { fetchAllStaffAssignments, fetchStaff } from "@/api/staff";
import { default_formula } from "@/lib/default_formula";
import evaluateFormula from "@/lib/formula";
import type { CombinedAssignmentType } from "@/types/combined_assignment_type";
import type { Staff } from "@/types/staff_type";
import { useEffect, useState, type ReactNode } from "react";
import { useAcademicYear } from "./useAcademicYear";
import { StaffContext } from "./useStaff";

export function StaffProvider({ children }: { children: ReactNode }) {
  const [staffData, setStaffData] = useState<Staff[]>([]);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const { selectedYear } = useAcademicYear();

  const incrementRefreshKey = () => setRefreshKey(refreshKey + 1);

  useEffect(() => {
    fetchStaff().then((staff: Staff[]) => {
      console.log("Fetched staff data.");
      if (!selectedYear) return;
      fetchAllStaffAssignments(selectedYear.year_id).then(
        (module_data: CombinedAssignmentType[]) => {
          setStaffData(
            staff.map((s) => {
              const allocation = Number(
                100 *
                  Number(
                    module_data
                      .filter((m) => m.user_id === s.user_id)
                      .reduce((sum: number, m: CombinedAssignmentType) => {
                        return (
                          sum +
                          Number(
                            evaluateFormula(
                              m,
                              m.custom_formula ??
                                default_formula(m.module_type),
                            ),
                          )
                        );
                      }, 0) / Number(s.contract_hours),
                  ),
              );
              return { ...s, allocation: Number(allocation.toFixed(2)) };
            }),
          );
        },
      );
    });
  }, [selectedYear, refreshKey]);

  return (
    <StaffContext.Provider
      value={{ staffData, setStaffData, incrementRefreshKey }}
    >
      {children}
    </StaffContext.Provider>
  );
}
