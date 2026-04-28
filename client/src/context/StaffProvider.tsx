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

  const incrementRefreshKey = () => setRefreshKey((prev) => prev + 1);

  useEffect(() => {
    // fetch staff data to be used for context.
    fetchStaff().then((staff: Staff[]) => {
      if (!selectedYear) return;
      // get all staff assignments to calculate total allocation.
      fetchAllStaffAssignments(selectedYear.year_id).then(
        (module_data: CombinedAssignmentType[]) => {
          setStaffData(
            staff.map((s) => {
              // calculate total allocation for each staff member
              const allocation = Number(
                100 *
                  Number(
                    module_data
                      .filter((m) => m.user_id === s.user_id)
                      .reduce((sum: number, m: CombinedAssignmentType) => {
                        // evaluate formula for assignment
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

              // calculate teaching allocation for each staff member
              const allocation_teaching = Number(
                100 *
                  Number(
                    module_data
                      .filter(
                        (m) =>
                          m.user_id === s.user_id &&
                          m.module_type == "teaching",
                      )
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

              // calculate supervision and marking allocation for each staff member
              const allocation_supervision_marking = Number(
                100 *
                  Number(
                    module_data
                      .filter(
                        (m) =>
                          m.user_id === s.user_id &&
                          m.module_type == "supervision_marking",
                      )
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

              // calculate administration allocation for each staff member
              const allocation_admin = Number(
                100 *
                  Number(
                    module_data
                      .filter(
                        (m) =>
                          m.user_id === s.user_id && m.module_type == "admin",
                      )
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

              // add all these allocation data to staff object.
              return {
                ...s,
                allocation: Number(allocation.toFixed(2)),
                allocation_admin: allocation_admin,
                allocation_supervision_marking: allocation_supervision_marking,
                allocation_teaching: allocation_teaching,
              };
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
