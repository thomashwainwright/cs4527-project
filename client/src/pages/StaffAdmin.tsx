import { fetchStaffAssignments } from "@/api/staff";
import type { Assignment } from "@/types/assignment_type";
import type { Staff } from "@/types/staff_type";
import type { Module } from "@/types/module_type";

import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useAcademicYear } from "@/context/useAcademicYear";
import type { ModuleOffering } from "@/types/module_offering_type";

export default function StaffAdmin() {
  const navigate = useNavigate();
  const staff = useOutletContext<Staff>();
  const { selectedYear } = useAcademicYear();

  const handleRowClick = (code: string) => {
    navigate(`/module/${code}`);
  };

  const [data, setData] = useState<(Assignment & Module & ModuleOffering)[]>(
    [],
  );

  useEffect(() => {
    if (!staff || !selectedYear) return;
    fetchStaffAssignments(staff.user_id, selectedYear?.year_id, "admin").then(
      (assignments: (Assignment & Module & ModuleOffering)[]) => {
        console.log("Fetched staff admin assignments");
        setData(assignments);
      },
    );
  }, [staff, selectedYear]);

  return (
    <div className="flex flex-col h-dvh">
      <div className="flex-1 min-h-0 overflow-auto">
        <table className="min-w-full text-xl">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Code</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Credits</th>
              <th className="px-4 py-2 border">Number of Students</th>
              <th className="px-4 py-2 border">Hours</th>
            </tr>
          </thead>

          <tbody>
            {data.map((assignment: Assignment & Module & ModuleOffering) => (
              <tr
                key={assignment.assignment_id}
                className="clickable-row hover:bg-gray-100 cursor-pointer"
                onClick={() => handleRowClick(assignment.code)}
              >
                <td className="px-4 py-2 border">{assignment.code}</td>
                <td className="px-4 py-2 border">{assignment.name}</td>
                <td className="px-4 py-2 border">{assignment.credits}</td>

                <td className="px-4 py-2 border">
                  {assignment.estimated_number_students}
                </td>
                <td className="px-4 py-2 border">
                  {assignment.credits * assignment.estimated_number_students}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
