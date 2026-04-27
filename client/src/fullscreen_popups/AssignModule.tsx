import { fetchAvailableStaff } from "@/api/modules";
import type { AssignmentRow } from "@/types/assignment_row";
import type { Staff } from "@/types/staff_type";
import { useEffect, useState } from "react";

// add selected flag for UI
type StaffRow = Staff & { selected: boolean };

export default function AssignModule({
  offering_id,
  moduleAssignments,
  onAdd,
}: {
  offering_id: number;
  moduleAssignments: AssignmentRow[];
  onAdd: (data: Staff[] | undefined) => void;
}) {
  const [data, setData] = useState<StaffRow[]>();

  // fetch staff when offering or assignments change
  useEffect(() => {
    fetchAvailableStaff(offering_id).then((data) => {
      let filteredData = data;

      // remove staff already assigned
      if (moduleAssignments) {
        filteredData = data.filter(
          (item: AssignmentRow) =>
            !moduleAssignments.some((a) => a.user_id === item.user_id),
        );
      }

      setData(filteredData);
    });
  }, [offering_id, moduleAssignments]);

  // toggle row selection
  const updateSelection = (
    e: React.MouseEvent<HTMLTableRowElement>,
    user_id: number | undefined,
    value: boolean,
  ) => {
    e.preventDefault();

    setData((prev) =>
      prev?.map((item) =>
        item.user_id === user_id ? { ...item, selected: value } : item,
      ),
    );
  };

  return (
    <div className="text-2xl p-4 flex flex-col h-full gap-2">
      Assign staff member to module
      <p className="text-lg">Available staff not already assigned:</p>
      {/* scrollable table container */}
      <div className="overflow-y-auto">
        <table className="mt-4 text-lg w-full">
          <thead>
            {/* column headers */}
            <tr>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
            </tr>
          </thead>

          <tbody>
            {/* staff rows */}
            {data &&
              data.map((item: StaffRow) => (
                <tr
                  // highlight selected rows
                  className={
                    "cursor-pointer " +
                    (!item.selected ? "bg-white hover:bg-gray-100 " : "") +
                    (item.selected ? "bg-green-200 hover:bg-green-100 " : "")
                  }
                  // click to select/deselect
                  onClick={(e) =>
                    updateSelection(e, item.user_id, !item.selected)
                  }
                >
                  {/* staff name */}
                  <td className="border px-4 py-2">{item.name}</td>

                  {/* staff email */}
                  <td className="border px-4 py-2">{item.email}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {/* action button */}
      <div className="flex text-xl mt-auto justify-end">
        <button
          className="border rounded-md p-2 hover:bg-gray-200 cursor-pointer"
          // send selected staff back up
          onClick={() => onAdd(data?.filter((item) => item.selected))}
        >
          Add
        </button>
      </div>
    </div>
  );
}
