import { useStaff } from "@/context/useStaff";
import PageTitle from "../ui_components/PageTitle";
import type { Problem } from "@/types/problem_type";
import { useState, type ChangeEvent } from "react";
import { useModules } from "@/context/useModules";
import { useNavigate } from "react-router-dom";

export function Dashboard() {
  const { staffData } = useStaff();
  const { moduleData } = useModules();
  const navigate = useNavigate();

  const [problemTolerance, setProblemTolerance] = useState<number>(5);

  function getStaffAllocation() {
    const totalAllocation = staffData?.filter(
      (member) => member.role == "teaching",
    )
      ? staffData.reduce((sum, staff) => sum + (staff.allocation ?? 0), 0) /
        staffData?.length
      : -1;

    return totalAllocation;
  }

  function getModuleAllocation() {
    if (!moduleData) return 0;
    const nonIndividualData = moduleData.filter((module) => !module.individual);
    console.log(nonIndividualData);
    const totalAllocation = nonIndividualData.reduce(
      (sum, module) => sum + Number(module.allocation) || 0,
      0,
    );

    return (100 * totalAllocation) / nonIndividualData.length;
  }

  function getProblems() {
    const problemList: Problem[] = [];

    if (!staffData || !moduleData) return;

    for (const staffMember of staffData) {
      if (
        staffMember.allocation != undefined &&
        Math.abs(staffMember.allocation - 100) > problemTolerance &&
        staffMember.role == "teaching"
      ) {
        const currentProblem: Problem = {
          type: "Staff",
          subject: staffMember.name ?? "unknown",
          description:
            staffMember.allocation == 0
              ? "No allocation"
              : staffMember.allocation > 100
                ? "Over-allocated"
                : "Under-allocated",
          url: `staff/${staffMember.email}`,
        };

        problemList.push(currentProblem);
      }
    }

    for (const module of moduleData) {
      if (
        module.allocation != undefined &&
        Math.abs(module.allocation - 100) > problemTolerance &&
        !module.individual
      ) {
        const currentProblem: Problem = {
          type: "Module",
          subject: module.name ?? "unknown",
          description:
            module.allocation == 0
              ? "No allocation"
              : module.allocation > 100
                ? "Over-allocated"
                : "Under-allocated",
          url: `modules/${module.code}`,
        };

        problemList.push(currentProblem);
      }
    }

    return problemList;
  }

  function navigateProblem(problem: Problem): void {
    navigate(problem.url);
  }

  return (
    <div className="flex flex-col h-screen p-12 text-xl min-h-0">
      <PageTitle>Dashboard</PageTitle>
      <div className="w-1/2 flex-1 flex flex-col min-h-0">
        <div>
          {/* Basic Stats */}
          Total Staff Allocation: {getStaffAllocation().toFixed(1)}% <br />
          Non-Individual Module Allocation: {getModuleAllocation().toFixed(1)}%
        </div>
        <div className="flex flex-col gap-4 flex-1 min-h-0">
          <div className="flex gap-4 items-center h-16">
            <strong>Problems</strong>
            <p className="ml-auto">Tolerance</p>
            <div className="flex items-center gap-1">
              <input
                className="border border-gray-500 rounded p-2 w-20"
                type="number"
                defaultValue={5}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setProblemTolerance(Number(e.target.value));
                }}
              />
              <p>%</p>
            </div>
          </div>
          <div className="flex-1 min-h-0 overflow-auto">
            <table className="text-xl">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">Type</th>
                  {/* Staff/module */}
                  <th className="px-4 py-2 border">Subject</th>{" "}
                  {/* Subject staff/module name */}
                  <th className="px-4 py-2 border">Description</th>{" "}
                  {/* Over/underallocated? */}
                </tr>
              </thead>
              <tbody>
                {getProblems()?.map((problem: Problem) => (
                  <tr
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => navigateProblem(problem)}
                  >
                    <td className="px-4 py-2 border">{problem.type}</td>
                    <td className="px-4 py-2 border">{problem.subject}</td>
                    <td className="px-4 py-2 border">{problem.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
