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
      setData(staff);
    });
  }, []);

  function getFilteredData() {
    return data.filter((staff: Staff) => {
      return staff.name.toLowerCase().includes(filter.search.toLowerCase());
    });
  }

  return (
    <div className="p-12">
      <PageTitle>Staff</PageTitle>
      <div className="flex flex-row mb-10 items-center gap-4 text-xl">
        <div className="ml-auto flex flex-row gap-4 items-center">
          <input
            className="border border-gray-300 rounded-md p-2 hover:border-black w-120"
            placeholder="search"
            onChange={(e) => {
              setFilter((previous) => ({
                ...previous,
                search: e.target.value,
              }));
            }}
          />
        </div>
      </div>
      <table className="min-w-full mt-10 text-xl">
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
              onClick={() => handleRowClick(staff.email.toString())}
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
  );
}
