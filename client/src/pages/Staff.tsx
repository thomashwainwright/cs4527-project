import { fetchStaff } from "../api/staff";
import PageTitle from "../ui_components/PageTitle";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Staff } from "../types/staff_type";

export function Staff() {
  const navigate = useNavigate();

  const handleRowClick = (email: string) => {
    navigate(`/staff/${email}`);
  };

  const [data, setData] = useState<Staff[]>([]);
  const [filter, setFilter] = useState({
    search: "",
  });

  useEffect(() => {
    fetchStaff().then((staff: Staff[]) => {
      console.log("Fetched staff data.");
      setData(staff);
    });
  }, []);

  function getFilteredData() {
    return data.filter((staff: Staff) => {
      return staff.name?.toLowerCase().includes(filter.search.toLowerCase());
    });
  }

  function addUser() {
    const newUser: Staff = {
      user_id: undefined,
      staff_id: undefined,
      role: undefined,
      name: undefined,
      email: undefined,
      contract_type: undefined,
      contract_hours: undefined,
      password_hash: undefined,
      password: undefined
    }
    setData(prev => [...prev, newUser])
    navigate("new-user/account_details")
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
        <button className={"border border-gray-200 rounded-md px-4 py-2 cursor-pointer text-gray text-xl text-gray-700 hover:bg-gray-200 ml-auto"} onClick={addUser} title="Add staff member.">Add</button>
      </div>
      <div className="flex-1 min-h-0 overflow-auto">
        <table className="min-w-full text-xl ">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Contract Type</th>
              <th className="px-4 py-2 border">Total Hours Permitted</th>
            </tr>
          </thead>

          <tbody>
            {getFilteredData().map((staff: Staff) => (
              <tr
                key={staff.user_id}
                className="clickable-row hover:bg-gray-100 cursor-pointer"
                onClick={() => staff.email && handleRowClick(staff.email.toString())}
              >
                <td className="px-4 py-2 border">{staff.name}</td>
                <td className="px-4 py-2 border">{staff.email}</td>
                <td className="px-4 py-2 border">{staff.contract_type}</td>
                <td className="px-4 py-2 border">{staff.contract_hours}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
