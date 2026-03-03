import { useNavigate, useParams } from "react-router-dom";
import type { Module } from "../types/module_type";
import { useEffect, useState } from "react";
import { fetchModuleDetails, fetchModuleAssignments } from "../api/modules";
import PageTitle from "@/ui_components/PageTitle";
import type { Assignment } from "@/types/assignment_type";
import { fetchStaffByUserId } from "@/api/staff";

export default function ModuleDetails() {
  const code = useParams().code as string;
  const [moduleDetails, setModuleDetails] = useState<Module | null>(null);
  const [moduleAssignments, setModuleAssignments] = useState<Assignment[]>([]);
  const navigate = useNavigate();

  const handleRowClick = (user_id: number) => {
    fetchStaffByUserId(user_id).then((staff) => {
      navigate(`/staff/${staff.email}`);
    });
  };

  useEffect(() => {
    if (!code) return;
    fetchModuleDetails(code).then((details: Module) => {
      setModuleDetails(details);
      fetchModuleAssignments(details.module_id).then(
        (assignments: Assignment[]) => {
          setModuleAssignments(assignments);
        },
      );
    });
  }, [code]);

  return (
    <div>
      {moduleDetails && (
        <>
          {/* Module code and name title */}
          <PageTitle>
            {moduleDetails.code}
            {moduleDetails.name ? `: ${moduleDetails.name}` : ""}
          </PageTitle>

          {/* Module details page content*/}
          <div className="flex mt-10 gap-4 flex-col md:flex-row text-2xl">
            {/* Module type, estimated number of students, alpha and beta */}
            <div className="lg:w-1/2 pr-16">
              <div className="flex flex-row">
                <p className="pt-2 pb-2">Module Code: </p>
                <input
                  className="border border-gray-300 rounded-md p-2 ml-auto"
                  value={moduleDetails.code}
                  readOnly
                />
              </div>

              <div className="mt-4 flex flex-row">
                <p className="pt-2 pb-2">Module Name: </p>
                <input
                  className="border border-gray-300 rounded-md p-2 ml-auto"
                  value={moduleDetails.name}
                  readOnly
                />
              </div>

              <div className="mt-4 flex flex-row">
                <p className="pt-2 pb-2">Module Type: </p>
                <select
                  name="module_type"
                  className="border border-gray-300 rounded-md p-2  hover:border-black w-75 ml-auto"
                  value={moduleDetails.module_type}
                  onChange={(e) => {
                    setModuleDetails({
                      ...moduleDetails,
                      module_type: e.target.value,
                    });
                  }}
                >
                  <option value="teaching">Teaching</option>
                  <option value="admin">Admin</option>
                  <option value="supervision/marking">
                    Supervision/Marking
                  </option>
                </select>
              </div>

              <p className="mt-4 flex flex-row">
                Estimated Number of Students:{" "}
                <input
                  type="number"
                  className="border border-gray-300 rounded-md p-2 ml-auto"
                  value={moduleDetails.estimated_number_students}
                  onChange={(e) => {
                    setModuleDetails({
                      ...moduleDetails,
                      estimated_number_students: parseInt(e.target.value),
                    });
                  }}
                />
              </p>

              <b className="flex mt-16">Calculation Parameters</b>

              <p className="mt-8 flex flex-row">
                Preset:{" "}
                <select
                  name="module_type"
                  className="border border-gray-300 rounded-md p-2  hover:border-black w-75 ml-auto"
                  defaultValue={"Standard classroom based"}
                >
                  <option value="teaching">Standard classroom based</option>
                  <option value="admin">Standard computer lab based</option>
                  <option value="supervision/marking">
                    Standard project based
                  </option>
                  <option value="supervision/marking">
                    Individual project
                  </option>
                  <option value="supervision/marking">Group project</option>
                  <option value="supervision/marking">Custom</option>
                </select>
              </p>

              <p className="mt-2 flex flex-row">
                Alpha:{" "}
                <input
                  type="number"
                  className="border border-gray-300 rounded-md p-2 ml-auto"
                  value={moduleDetails.alpha}
                  onChange={(e) => {
                    setModuleDetails({
                      ...moduleDetails,
                      alpha: parseFloat(e.target.value),
                    });
                  }}
                ></input>
              </p>

              <p className="mt-2 flex flex-row">
                Beta:{" "}
                <input
                  type="number"
                  className="border border-gray-300 rounded-md p-2 ml-auto"
                  value={moduleDetails.beta}
                  onChange={(e) => {
                    setModuleDetails({
                      ...moduleDetails,
                      beta: parseFloat(e.target.value),
                    });
                  }}
                ></input>
              </p>
            </div>
            {/* Staff assignments table */}
            <div className="lg:w-1/2 pr-16">
              {" "}
              <b>Assignments</b>
              <table className="min-w-full mt-8 text-xl">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border">Staff Member</th>
                    <th className="px-4 py-2 border">Delta</th>
                    <th className="px-4 py-2 border">Share</th>
                    <th className="px-4 py-2 border">Coordinator</th>
                  </tr>
                </thead>

                <tbody>
                  {moduleAssignments &&
                    moduleAssignments.map((assignment: Assignment) => (
                      <tr
                        key={assignment.user_id}
                        className="clickable-row hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleRowClick(assignment.user_id)}
                      >
                        <td className="px-4 py-2 border">{assignment.name}</td>
                        <td className="px-4 py-2 border">{assignment.delta}</td>
                        <td className="px-4 py-2 border">{assignment.share}</td>
                        <td className="px-4 py-2 border">
                          {assignment.coordinator ? "Yes" : "No"}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
