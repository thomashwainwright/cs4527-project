import evaluateFormula from "@/lib/formula";
import type { CombinedAssignmentType } from "@/types/combined_assignment_type";
import { useOutletContext } from "react-router";

type Totals = {
  teaching: number | "ERROR",
  supervision_marking: number | "ERROR",
  admin: number | "ERROR"
}

export default function StaffOverview() {
  const { data } = useOutletContext<{
    data: CombinedAssignmentType[];
    setData: React.Dispatch<React.SetStateAction<CombinedAssignmentType[]>>;
  }>();


  const totals = data.reduce(
    (acc: Totals, item) => {
      const type = item.module_type as ("teaching" | "supervision_marking" | "admin")

      if (acc[type] == "ERROR") return acc;

      const hours = evaluateFormula(item, item.custom_formula);
      if (hours == "ERROR") {
        acc[type] = "ERROR"
        return acc
      } 

      acc[type] += hours
      return acc;
    },
    { teaching: 0, supervision_marking: 0, admin: 0 }
  );

  return <div className="p-12">
    <table className="border text-2xl">
      <thead>
        <tr>
          <th className="px-4 py-2 border">Type</th>
          <th className="px-4 py-2 border">Hours</th>
        </tr>
      </thead>
      <tbody>
        <tr className="clickable-row hover:bg-gray-100 cursor-pointer">
          <td className="px-4 py-2 border">Teaching</td>
          <td className="px-4 py-2 border">{totals.teaching}</td>
        </tr>
        <tr className="clickable-row hover:bg-gray-100 cursor-pointer">
          <td className="px-4 py-2 border">Supervision/Marking</td>
          <td className="px-4 py-2 border">{totals.supervision_marking}</td>
        </tr>
        <tr className="clickable-row hover:bg-gray-100 cursor-pointer">
          <td className="px-4 py-2 border">Admin</td>
          <td className={"px-4 py-2 border " + (totals.admin == "ERROR" ? "bg-red-200" : "")}>{totals.admin}</td>
        </tr>
      </tbody>
    </table>
  </div>;
}
