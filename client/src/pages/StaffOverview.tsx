import { default_formula } from "@/lib/default_formula";
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
  console.log(data)

  const totals = data.reduce(
    (acc: Totals, item) => {
      const type = item.module_type as ("teaching" | "supervision_marking" | "admin")

      if (acc[type] == "ERROR") return acc;

      if (!item.custom_formula) {
        item.custom_formula = default_formula(item.module_type)
      }

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
    <table className="text-2xl">
      <thead>
        <tr>
          <th className="px-4 py-2 border">Module Type</th>
          <th className="px-4 py-2 border">Count</th>
          <th className="px-4 py-2 border">Hours</th>
        </tr>
      </thead>
      <tbody>
        <tr className="hover:bg-gray-100">
          <td className="px-4 py-2 border">Teaching</td>
          <td className="px-4 py-2 border">{data.filter(item => (item.module_type == "teaching")).length}</td>
          <td className="px-4 py-2 border">{totals.teaching}</td>
        </tr>
        <tr className="hover:bg-gray-100">
          <td className="px-4 py-2 border">Supervision/Marking</td>
          <td className="px-4 py-2 border">{data.filter(item => (item.module_type == "supervision_marking")).length}</td>
          <td className="px-4 py-2 border">{totals.supervision_marking}</td>
        </tr>
        <tr className="hover:bg-gray-100">
          <td className="px-4 py-2 border">Admin</td>
          <td className="px-4 py-2 border">{data.filter(item => (item.module_type == "admin")).length}</td>
          <td className={"px-4 py-2 border " + (totals.admin == "ERROR" ? "bg-red-200" : "")}>{totals.admin}</td>
        </tr>
        <tr className="hover:bg-gray-100">
          <td className="px-4 py-2 "><b>Total</b></td>
          <td className={"px-4 py-2 " + (totals.admin == "ERROR" ? "bg-red-200" : "")}>{data.filter(item => item.module_id).length}</td>
          <td className={"px-4 py-2 " + (totals.admin == "ERROR" ? "bg-red-200" : "")}>{[totals.admin, totals.teaching, totals.supervision_marking].some(v => v === "ERROR") ? "ERROR" : (Number(totals.admin) + Number(totals.teaching) + Number(totals.supervision_marking))}</td>
        </tr>
      </tbody>
    </table>
  </div>;
}
