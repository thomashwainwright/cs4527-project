import { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import type { Module } from "../types/module_type";
import PageTitle from "../ui_components/PageTitle";
import type { ModuleOffering } from "@/types/module_offering_type";
import { useAcademicYear } from "@/context/useAcademicYear";
import { fetchModulesWithOfferings } from "@/api/modules";

export function Modules() {
  const navigate = useNavigate();
  const [data, setData] = useState<
    (Module & ModuleOffering & { allocation: number })[] | null
  >();
  const [filter, setFilter] = useState({
    teaching: true,
    admin: true,
    search: "",
  });
  const { selectedYear } = useAcademicYear();

  const handleRowClick = (code: string) => {
    navigate(`/module/${code}`);
  };

  const handleModuleTypeFilter = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    setFilter((previous) => ({
      ...previous,
      [name]: checked,
    }));
  };

  useEffect(() => {
    if (!selectedYear) {
      return;
    }
    fetchModulesWithOfferings(selectedYear?.year_id).then(
      (modules: (Module & ModuleOffering & { allocation: number })[]) => {
        console.log("Fetched modules with offerings");
        setData(modules);
      },
    );
  }, [selectedYear]);

  function getFilteredData() {
    return (
      data &&
      data.filter((item: Module & ModuleOffering) => {
        let type_filter = false;
        if (filter.teaching && item.module_type == "teaching") {
          type_filter = true;
        }

        if (filter.admin && item.module_type == "admin") {
          type_filter = true;
        }

        const searchFilter =
          item.code.toLowerCase().includes(filter.search.toLowerCase()) ||
          item.name.toLowerCase().includes(filter.search.toLowerCase());

        return type_filter && searchFilter;
      })
    );
  }

  return (
    <div className="flex flex-col h-dvh p-12">
      <PageTitle>Modules</PageTitle>

      <div className="flex flex-row mb-10 items-center gap-4 text-xl">
        <p>Module Type</p>

        <div className="border border-gray-300 rounded-md px-2 flex flex-row gap-2">
          <label>
            <input
              name="teaching"
              type="checkbox"
              onChange={handleModuleTypeFilter}
              className=" mr-2"
              checked={filter.teaching}
            />
            Teaching
          </label>
          <label>
            <input
              name="admin"
              type="checkbox"
              onChange={handleModuleTypeFilter}
              className=" mr-2"
              checked={filter.admin}
            />
            Admin
          </label>
        </div>
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

      <div className="flex-1 min-h-0 overflow-auto">
        <table className="min-w-full text-xl">
          <thead className="bg-white">
            <tr>
              <th className="px-4 py-2 border">Code</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Module Type</th>
              <th className="px-4 py-2 border">Estimated Number of Students</th>
              <th className="px-4 py-2 border">Alpha</th>
              <th className="px-4 py-2 border">Beta</th>
              <th className="px-4 py-2 border">Allocation</th>
            </tr>
          </thead>

          <tbody>
            {getFilteredData()
              ?.slice()
              .sort((a, b) => a.code.localeCompare(b.code))
              .map(
                (module: Module & ModuleOffering & { allocation: number }) => (
                  <tr
                    key={module.code}
                    className="clickable-row hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleRowClick(module.code)}
                  >
                    <td className="px-4 py-2 border">{module.code}</td>
                    <td className="px-4 py-2 border">{module.name}</td>
                    <td className="px-4 py-2 border">{module.module_type}</td>
                    <td className="px-4 py-2 border">
                      {module.estimated_number_students}
                    </td>
                    <td className="px-4 py-2 border">{module.alpha}</td>
                    <td className="px-4 py-2 border">{module.beta}</td>
                    <td
                      className={
                        "px-4 py-2 border " +
                        (module.allocation == 1 ? "bg-green-200" : "bg-red-200")
                      }
                    >
                      {module.allocation}
                    </td>
                  </tr>
                ),
              )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
