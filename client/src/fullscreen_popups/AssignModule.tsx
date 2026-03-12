import { fetchAvailableStaff } from "@/api/modules";
import type { AssignmentRow } from "@/types/assignment_row";
import type { Staff } from "@/types/staff_type";
import { useEffect, useState } from "react";

type StaffRow = Staff & {selected: boolean}

export default function AssignModule({offering_id, moduleAssignments, onAdd}: {offering_id: number, moduleAssignments: AssignmentRow[], onAdd: (data: Staff[] | undefined) => void}) {
    const [data, setData] = useState<(StaffRow)[]>();

    useEffect(() => {
        fetchAvailableStaff(offering_id).then(data => {
            setData(data.filter((item: AssignmentRow) => !moduleAssignments.some(a => a.user_id === item.user_id))) // filter data added in current state before saving
        })
    }, [offering_id, moduleAssignments]);

    const updateSelection = (e: React.MouseEvent<HTMLTableRowElement>, user_id: number | undefined, value: boolean) => {
        // find module 
        e.preventDefault();
        setData(prev =>
            prev?.map(item =>
                item.user_id === user_id
                ? { ...item, selected: value }
                : item
            )
        );
    }

    return <div className="text-2xl p-4 flex flex-col h-full gap-2">
         Assign staff member to module
        
        <p className="text-lg">Available modules not already assigned to <b>{}</b></p>

        <div className="overflow-y-auto">
            <table className="mt-4 text-lg w-full">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">Name</th>
                        <th className="border px-4 py-2">Email</th>
                    </tr>
                </thead>
                <tbody>
                    {data && data.map((item: StaffRow) => <tr className={"cursor-pointer " + (!item.selected ? "bg-white hover:bg-gray-100 " : "") + (item.selected ? "bg-green-200 hover:bg-green-100 " : "")} onClick={(e: React.MouseEvent<HTMLTableRowElement>) => updateSelection(e, item.user_id, !item.selected)}>
                        <td className="border px-4 py-2">{item.name}</td>
                        <td className="border px-4 py-2">{item.email}</td>
                    </tr>)}
                </tbody>
            </table>
        </div>

        <div className="flex text-xl mt-auto justify-end">
            <button className="border rounded-md p-2 hover:bg-gray-200 cursor-pointer" onClick={() => onAdd(data?.filter(item => item.selected))}>
                Add
            </button>
        </div>
    </div>
}