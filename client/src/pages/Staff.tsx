// import { fetchAllStaffAssignments, fetchStaff } from "../api/staff";
import PageTitle from "../ui_components/PageTitle";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Staff } from "../types/staff_type";
// import { useAcademicYear } from "@/context/useAcademicYear";
// import type { CombinedAssignmentType } from "@/types/combined_assignment_type";
// import evaluateFormula from "@/lib/formula";
// import { default_formula } from "@/lib/default_formula";
import { useStaff } from "@/context/useStaff";

export function Staff() {
  const navigate = useNavigate();
  // const { selectedYear } = useAcademicYear();

  // navigate to staff details page when a row is clicked
  const handleRowClick = (email: string) => {
    navigate(`/staff/${email}`);
  };

  // const [data, setData] = useState<(Staff & { allocation: number })[]>([]);

  // filter state for searching staff by name
  const [filter, setFilter] = useState({
    search: "",
  });

  // access shared staff data and updater
  const { staffData, setStaffData } = useStaff();

  // useEffect(() => {
  //   fetchStaff().then((staff: Staff[]) => {
  //     console.log("Fetched staff data.");
  //     if (!selectedYear) return;
  //     fetchAllStaffAssignments(selectedYear.year_id).then(
  //       (module_data: CombinedAssignmentType[]) => {
  //         setData(
  //           staff.map((s) => {
  //             const allocation = Number(
  //               100 *
  //                 Number(
  //                   module_data
  //                     .filter((m) => m.user_id === s.user_id)
  //                     .reduce((sum: number, m: CombinedAssignmentType) => {
  //                       return (
  //                         sum +
  //                         Number(
  //                           evaluateFormula(
  //                             m,
  //                             m.custom_formula ??
  //                               default_formula(m.module_type),
  //                           ),
  //                         )
  //                       );
  //                     }, 0) / Number(s.contract_hours),
  //                 ),
  //             );
  //             return { ...s, allocation: Number(allocation.toFixed(2)) };
  //           }),
  //         );
  //       },
  //     );
  //   });
  // }, [selectedYear]);

  // filter staff list based on search input
  function getFilteredData() {
    return staffData?.filter((staff: Staff) => {
      return staff.name?.toLowerCase().includes(filter.search.toLowerCase());
    });
  }

  // create a new staff entry and navigate to account creation page
  function addUser() {
    const newUser: Staff & { allocation: number } = {
      user_id: undefined,
      role: undefined,
      name: undefined,
      email: undefined,
      contract_type: undefined,
      contract_hours: undefined,
      password_hash: undefined,
      password: undefined,
      active: true,
      allocation: -1,

      allocation_admin: 0,
      allocation_supervision_marking: 0,
      allocation_teaching: 0,
    };
    setStaffData((prev) => [...prev, newUser]);
    navigate("new-user/account_details");
  }

  return (
    <div className="flex flex-col h-dvh p-12">
      <PageTitle>Staff</PageTitle>
      <div className="flex flex-row mb-4 items-center gap-4 text-xl">
        <div className="ml-auto flex flex-row gap-4 items-center">
          <input
            className="border border-gray-300 rounded-md p-2 hover:border-black w-120"
            placeholder="Search"
            onChange={(e) => {
              setFilter((previous) => ({
                ...previous,
                search: e.target.value,
              }));
            }}
          />
        </div>
      </div>
      <div className="flex flex-row mb-4 items-center gap-4 text-xl">
        Showing {getFilteredData()?.length} results.
        <button
          className={
            "border border-gray-200 rounded-md px-4 py-2 cursor-pointer text-gray text-xl text-gray-700 hover:bg-gray-200 ml-auto"
          }
          onClick={addUser}
          title="Add staff member."
        >
          Add
        </button>
      </div>
      <div className="flex-1 min-h-0 overflow-auto">
        <table className="min-w-full text-xl ">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Contract Type</th>
              <th className="px-4 py-2 border">Total Hours Permitted</th>
              <th className="px-4 py-2 border">Allocation</th>
            </tr>
          </thead>

          <tbody>
            {getFilteredData()?.map(
              (staff: Staff) =>
                staff.active && (
                  <tr
                    key={staff.user_id}
                    className="clickable-row hover:bg-gray-100 cursor-pointer"
                    onClick={() =>
                      staff.email && handleRowClick(staff.email.toString())
                    }
                  >
                    <td className="px-4 py-2 border">{staff.name}</td>
                    <td className="px-4 py-2 border">{staff.email}</td>
                    <td className="px-4 py-2 border">{staff.contract_type}</td>
                    <td className="px-4 py-2 border">{staff.contract_hours}</td>
                    <td className="px-4 py-2 border">{staff.allocation}%</td>
                  </tr>
                ),
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
