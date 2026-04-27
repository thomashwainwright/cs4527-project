import { fetchModulesNotAssignedTo } from "@/api/modules";
import { useAcademicYear } from "@/context/useAcademicYear";
import type { Module } from "@/types/module_type";
import { useEffect, useState } from "react";

// add a selected flag for UI use
type ModuleRow = Module & { selected: boolean };

export default function AddModule({
  onAdd,
}: {
  onAdd: (data: Module[] | undefined) => void;
}) {
  const { selectedYear } = useAcademicYear();
  const [data, setData] = useState<ModuleRow[]>();

  // fetch modules when year changes
  useEffect(() => {
    if (!selectedYear) return;

    fetchModulesNotAssignedTo(selectedYear).then((data) => setData(data));
  }, [selectedYear]);

  // toggle a row's selected state
  const updateSelection = (
    e: React.MouseEvent<HTMLTableRowElement>,
    module_id: number | undefined,
    value: boolean,
  ) => {
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
        available modules not already assigned to <b>{selectedYear?.label}</b>
      </p>

      {/* module list */}
      <table className="mt-4 text-lg w-full">
        <thead>
          {/* column headers */}
          <tr>
            <th className="border px-4 py-2">Code</th>
            <th className="border px-4 py-2">Name</th>
          </tr>
        </thead>

        <tbody>
          {/* rows */}
          {data &&
            data.map((item: ModuleRow) => (
              <tr
                // simple highlight for selected rows
                className={
                  "cursor-pointer " +
                  (!item.selected ? "bg-white hover:bg-gray-100 " : "") +
                  (item.selected ? "bg-green-200 hover:bg-green-100 " : "")
                }
                // click row to select/deselect
                onClick={(e) =>
                  updateSelection(e, item.module_id, !item.selected)
                }
              >
                {/* module code */}
                <td className="border px-4 py-2">{item.code}</td>

                {/* module name */}
                <td className="border px-4 py-2">{item.name}</td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* action button */}
      <div className="flex text-xl mt-auto justify-end">
        <button
          className="border rounded-md p-2 hover:bg-gray-200 cursor-pointer"
          // send selected modules back up
          onClick={() => onAdd(data?.filter((item) => item.selected))}
        >
          Add
        </button>
      </div>
    </div>
  );
}
