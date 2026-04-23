import { fetchModulesNotAssignedTo } from "@/api/modules";
import { useAcademicYear } from "@/context/useAcademicYear";
import type { Module } from "@/types/module_type";
import { useEffect, useState } from "react";

type ModuleRow = Module & { selected: boolean };

export default function AddModule({
  onAdd,
}: {
  onAdd: (data: Module[] | undefined) => void; // passing onAdd function arg gets called when add button is pressed.
}) {
  const { selectedYear } = useAcademicYear();
  const [data, setData] = useState<ModuleRow[]>();

  useEffect(() => {
    if (!selectedYear) return;

    fetchModulesNotAssignedTo(selectedYear).then((data) => setData(data));
  }, [selectedYear]);

  const updateSelection = (
    e: React.MouseEvent<HTMLTableRowElement>,
    module_id: number | undefined,
    value: boolean,
  ) => {
    // find module
    e.preventDefault();
    setData((prev) =>
      prev?.map((item) =>
        item.module_id === module_id ? { ...item, selected: value } : item,
      ),
    );
  };

  return (
    <div className="text-2xl p-4 flex flex-col h-full">
      <p>Assign Module</p>
      <p className="text-lg mt-4">
        Available modules not already assigned to <b>{selectedYear?.label}</b>
      </p>

      <table className="mt-4 text-lg w-full">
        <thead>
          <tr>
            <th className="border px-4 py-2">Code</th>
            <th className="border px-4 py-2">Name</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((item: ModuleRow) => (
              <tr
                className={
                  "cursor-pointer " +
                  (!item.selected ? "bg-white hover:bg-gray-100 " : "") +
                  (item.selected ? "bg-green-200 hover:bg-green-100 " : "")
                }
                onClick={(e: React.MouseEvent<HTMLTableRowElement>) =>
                  updateSelection(e, item.module_id, !item.selected)
                }
              >
                <td className="border px-4 py-2">{item.code}</td>
                <td className="border px-4 py-2">{item.name}</td>
              </tr>
            ))}
        </tbody>
      </table>

      <div className="flex text-xl mt-auto justify-end">
        <button
          className="border rounded-md p-2 hover:bg-gray-200 cursor-pointer"
          onClick={() => onAdd(data?.filter((item) => item.selected))}
        >
          Add
        </button>
      </div>
    </div>
  );
}
