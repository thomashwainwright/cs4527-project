import { useState } from "react";
import { fetchModules } from "../api/modules";
import { useNavigate } from "react-router-dom";

type Module = {
  module_id: number;
  code: string;
  name: string;
  module_type: string;
  estimated_number_students: number;
  alpha: number;
  beta: number;
};

export function Modules() {
  const navigate = useNavigate();

  const handleRowClick = () => {
    navigate("/");
  };

  const [data, setData] = useState([]);

  fetchModules().then((modules) => {
    setData(modules);
  });

  return (
    <div>
      <h1 className="text-5xl font-bold">Modules</h1>

      <table className="min-w-full mt-10 text-xl">
        <thead>
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
              onClick={handleRowClick}
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
  );
}
