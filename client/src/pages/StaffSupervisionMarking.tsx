import { fetchStaffAssignments } from "@/api/staff";
import type { Assignment } from "@/types/assignment_type";
import type { Staff } from "@/types/staff_type";
import type { Module } from "@/types/module_type";

import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

export default function StaffSupervisionMarking() {
  const navigate = useNavigate();
  const staff = useOutletContext<Staff>();

  const handleRowClick = (code: string) => {
    navigate(`/module/${code}`);
  };

  const [data, setData] = useState<(Assignment & Module)[]>([]);

  useEffect(() => {
    if (!staff) return;
    fetchStaffAssignments(staff.user_id, "supervision/marking").then(
      (assignments: (Assignment & Module)[]) => {
        setData(assignments);
      },
    );
  }, [staff]);

  return (
    <div>
      <table className="min-w-full mt-10 text-xl">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Code</th>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Alpha</th>
            <th className="px-4 py-2 border">Beta</th>
            <th className="px-4 py-2 border">Delta</th>
            <th className="px-4 py-2 border">Share</th>
            <th className="px-4 py-2 border">Coordinator</th>
            <th className="px-4 py-2 border">Hours</th>
          </tr>
        </thead>

        <tbody>
          {data.map((assignment: Assignment & Module) => (
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
              <td className="px-4 py-2 border">
                {assignment.coordinator ? "Yes" : "No"}
              </td>
              <td className="px-4 py-2 border">{"Hours todo"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
