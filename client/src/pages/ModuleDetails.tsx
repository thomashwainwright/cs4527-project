import { useNavigate, useParams } from "react-router-dom";
import type { Module } from "../types/module_type";
import { useEffect, useState } from "react";
import { fetchModuleDetails, fetchModuleAssignments, commitModuleOfferingDetailChanges } from "../api/modules";
import PageTitle from "../ui_components/PageTitle";
import type { Assignment } from "@/types/assignment_type";
import { fetchStaffByUserId } from "@/api/staff";
import type { ModuleOffering } from "@/types/module_offering_type";
import { useAcademicYear } from "@/context/useAcademicYear";
import type { Staff } from "@/types/staff_type";

export default function ModuleDetails() {
  const code = useParams().code as string;
  const [moduleDetails, setModuleDetails] = useState<
    (Module & ModuleOffering) | null
  >(null);
  const [moduleAssignments, setModuleAssignments] = useState<
    (Assignment & Staff)[]
  >([]);
  const [calculationParameterPreset, setCalculationParameterPreset] = useState<string>("");

  const navigate = useNavigate();
  const { selectedYear } = useAcademicYear();

  const calculationParameterMap: Record<string, {alpha: number, beta: number}> = {
    std_classroom: { alpha: 4.4, beta: 0.15 },
    std_comp_lab: { alpha: 5.14, beta: 0.15 },
    std_proj: { alpha: 3.7, beta: 0 },
    ind_proj: { alpha: 0, beta: 0.5 },
    group_proj: { alpha: 0, beta: 0.8 }
  };

  const handleRowClick = (user_id: number) => {
    fetchStaffByUserId(user_id).then((staff) => {
      navigate(`/staff/${staff.email}`);
    });
  };

  useEffect(() => {
    if (!code || !selectedYear) return;
    fetchModuleDetails(code, selectedYear?.year_id).then((details: Module & ModuleOffering) => {
      console.log("Fetched module details.");
      setModuleDetails(details);
      console.log(details)

      fetchModuleAssignments(details.module_id, selectedYear?.year_id).then(
        (assignments: (Assignment & Staff)[]) => {
          console.log("Fetched module assignments");

          setModuleAssignments(assignments);
        },
      );
    });
  }, [code, selectedYear]);

  console.log(moduleDetails?.estimated_number_students)
  
  function saveData() {
    // save data to db
    commitModuleOfferingDetailChanges(moduleDetails?.offering_id, moduleDetails?.estimated_number_students, moduleDetails?.alpha, moduleDetails?.beta, moduleDetails?.crit, moduleDetails?.credits, moduleDetails?.h)
  }

  return (
    <div className="p-12">
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
            <div className="lg:w-1/2 pr-16 flex flex-col">
              <div className="flex flex-row">
                <p className="pt-2 pb-2">Module Code: </p>
                <input
                  className="border border-gray-300 rounded-md p-2 ml-auto bg-gray-50"
                  value={moduleDetails.code}
                  disabled
                />
              </div>

              <div className="mt-4 flex flex-row">
                <p className="pt-2 pb-2">Module Name: </p>
                <input
                  className="border border-gray-300 rounded-md p-2 ml-auto bg-gray-50"
                  value={moduleDetails.name}
                  disabled
                />
              </div>

              <div className="mt-4 flex flex-row">
                <p className="pt-2 pb-2">Module Type: </p>
                <input
                  className="border border-gray-300 rounded-md p-2 ml-auto bg-gray-50"
                  value={moduleDetails.module_type[0].toUpperCase() + moduleDetails.module_type.slice(1)}
                  disabled
                />
              </div>

              <div className="mt-4 flex flex-row">
                <p className="pt-2 pb-2">Academic Year: </p>
                <input
                  className="border border-gray-300 rounded-md p-2 ml-auto bg-gray-50"
                  value={selectedYear?.label}
                  disabled
                />
              </div>
              <p className="mt-4 flex flex-row">
                Credits:{" "}
                <input
                  type="number"
                  className="border border-gray-300 rounded-md p-2 ml-auto"
                  value={moduleDetails.credits ?? ""}
                  onChange={(e) => {
                    setModuleDetails({
                      ...moduleDetails,
                      credits: parseInt(e.target.value),
                    });
                  }}
                />
              </p>
              <p className="mt-4 flex flex-row">
                Estimated Number of Students:{" "}
                <input
                  type="number"
                  className="border border-gray-300 rounded-md p-2 ml-auto"
                  value={moduleDetails.estimated_number_students ?? ""}
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
                  onChange={(e) => {
                    console.log(e.target.value);
                    setCalculationParameterPreset(e.target.value);
                    const map = calculationParameterMap[e.target.value];
                    setModuleDetails({
                      ...moduleDetails,
                      alpha: (map.alpha),
                      beta: (map.beta)
                    });
                  }}
                >
                  <option value="">Select preset</option>
                  <option value="std_classroom">Standard classroom based</option>
                  <option value="std_comp_lab">Standard computer lab based</option>
                  <option value="std_proj">
                    Standard project based
                  </option>
                  <option value="ind_proj">
                    Individual project
                  </option>
                  <option value="group_proj">Group project</option>
                  <option value="custom">Custom</option>
                </select>
              </p>

              <p className="mt-2 flex flex-row">
                Alpha:{" "}
                <input
                  type="number"
                  className="border border-gray-300 rounded-md p-2 ml-auto"
                  value={moduleDetails.alpha ?? ""}
                  onChange={(e) => {
                    setModuleDetails({
                      ...moduleDetails,
                      alpha: parseFloat(e.target.value),
                    });
                  }}
                  disabled={calculationParameterPreset != "custom"}
                ></input>
              </p>

              <p className="mt-2 flex flex-row">
                Beta:{" "}
                <input
                  type="number"
                  className="border border-gray-300 rounded-md p-2 ml-auto"
                  value={moduleDetails.beta ?? ""}
                  onChange={(e) => {
                    setModuleDetails({
                      ...moduleDetails,
                      beta: parseFloat(e.target.value),
                    });
                  }}
                  disabled={calculationParameterPreset != "custom"}
                ></input>
              </p>

              <div className="flex ml-auto mt-8">
                <button className={"border border-gray-200 rounded-md px-4 py-2 cursor-pointer text-gray text-gray-700 hover:bg-gray-200"} title="Save changes to modules." onClick={saveData}>Save</button>
              </div>
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
                    moduleAssignments.map((assignment: Assignment & Staff) => (
                      <tr
                        key={assignment.assignment_id}
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
