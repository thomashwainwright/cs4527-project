import { useEffect, useState } from "react";
import { fetchModules } from "../api/modules";
import { useNavigate } from "react-router-dom";
import type { Module } from "../types/module_type";
import PageTitle from "@/ui_components/PageTitle";

export function Modules() {
  const navigate = useNavigate();

  const handleRowClick = (code: string) => {
    navigate(`/module/${code}`);
  };

  const [data, setData] = useState([]);

  useEffect(() => {
    fetchModules().then((modules) => {
      setData(modules);
    });
  }, []);

  return (
    <div className="flex flex-col h-dvh p-12">
      <PageTitle>Modules</PageTitle>

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
            </tr>
          </thead>

          <tbody>
            {data.map((module: Module) => (
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
