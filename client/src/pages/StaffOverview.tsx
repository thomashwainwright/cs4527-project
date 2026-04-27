import { default_formula } from "@/lib/default_formula";
import evaluateFormula from "@/lib/formula";
import type { CombinedAssignmentType } from "@/types/combined_assignment_type";
import type { Staff } from "@/types/staff_type";
import DoughnutChart from "@/ui_components/DoughnutChart";
import type { ChartData } from "chart.js";
import { useOutletContext } from "react-router";

type Totals = {
  teaching: number | "ERROR";
  supervision_marking: number | "ERROR";
  admin: number | "ERROR";
};

export default function StaffOverview() {
  const { data, staff } = useOutletContext<{
    data: CombinedAssignmentType[];
    setData: React.Dispatch<React.SetStateAction<CombinedAssignmentType[]>>;
    staff: Staff & { allocation: number };
    setStaff: React.Dispatch<React.SetStateAction<Staff>>;
  }>();

  const totals = data.reduce(
    (acc: Totals, item) => {
      const type = item.module_type as
        | "teaching"
        | "supervision_marking"
        | "admin";

      if (acc[type] == "ERROR") return acc;

      if (!item.custom_formula) {
        item.custom_formula = default_formula(item.module_type);
      }

      const hours = evaluateFormula(item, item.custom_formula);
      if (hours == "ERROR") {
        acc[type] = "ERROR";
        return acc;
      }

      acc[type] += hours;
      return acc;
    },
    { teaching: 0, supervision_marking: 0, admin: 0 },
  );

  const total = [
    totals.admin,
    totals.teaching,
    totals.supervision_marking,
  ].some((v) => v === "ERROR")
    ? "ERROR"
    : Number(totals.admin) +
      Number(totals.teaching) +
      Number(totals.supervision_marking);

  function getWorkloadByType(): ChartData<"doughnut"> {
    if (!staff)
      return {
        labels: ["Teaching", "Supervision/Marking", "Admin"],
        datasets: [
          {
            data: [0, 0, 0],
            backgroundColor: ["#60A5FA", "#34D399", "#FBBF24"],
          },
        ],
      };

    const data: ChartData<"doughnut"> = {
      labels: ["Teaching", "Supervision/Marking", "Admin"],
      datasets: [
        {
          label: "Time Allocation (hours)",
          data: [
            totals.teaching == "ERROR" ? 0 : totals.teaching,
            totals.supervision_marking == "ERROR"
              ? 0
              : totals.supervision_marking,
            totals.admin == "ERROR" ? 0 : totals.admin,
          ],
          backgroundColor: [
            "#60A5FA", // blue
            "#34D399", // green
            "#F87171", // red
          ],
          borderWidth: 1,
        },
      ],
    };

    return data;
  }

  return (
    <div className="p-12 flex flex-row">
      <div className="w-1/2">
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
              <td className="px-4 py-2 border">
                {data.filter((item) => item.module_type == "teaching").length}
              </td>
              <td className="px-4 py-2 border">{totals.teaching}</td>
            </tr>
            <tr className="hover:bg-gray-100">
              <td className="px-4 py-2 border">Supervision/Marking</td>
              <td className="px-4 py-2 border">
                {
                  data.filter(
                    (item) => item.module_type == "supervision_marking",
                  ).length
                }
              </td>
              <td className="px-4 py-2 border">{totals.supervision_marking}</td>
            </tr>
            <tr className="hover:bg-gray-100">
              <td className="px-4 py-2 border">Admin</td>
              <td className="px-4 py-2 border">
                {data.filter((item) => item.module_type == "admin").length}
              </td>
              <td
                className={
                  "px-4 py-2 border " +
                  (totals.admin == "ERROR" ? "bg-red-200" : "")
                }
              >
                {totals.admin}
              </td>
            </tr>
            <tr className="hover:bg-gray-100">
              <td className="px-4 py-2 ">
                <b>Total</b>
              </td>
              <td
                className={
                  "px-4 py-2 " + (totals.admin == "ERROR" ? "bg-red-200" : "")
                }
              >
                {data.filter((item) => item.module_id).length}
              </td>
              <td
                className={
                  "px-4 py-2 " + (totals.admin == "ERROR" ? "bg-red-200" : "")
                }
              >
                {total == "ERROR" ? total : total.toFixed(2)}
              </td>
            </tr>
            <tr className="hover:bg-gray-100">
              <td className="px-4 py-2 ">
                <b>Total Permitted</b>
              </td>
              <td />
              <td
                className={
                  "px-4 py-2 " + (totals.admin == "ERROR" ? "bg-red-200" : "")
                }
              >
                {staff && staff.contract_hours}
              </td>
            </tr>
            <tr className="hover:bg-gray-100">
              <td className="px-4 py-2 ">
                <b>Total Remaining</b>
              </td>
              <td />
              <td
                className={
                  "px-4 py-2 " + (totals.admin == "ERROR" ? "bg-red-200" : "")
                }
              >
                {total == "ERROR"
                  ? "ERROR"
                  : staff && (Number(staff.contract_hours) - total).toFixed(2)}
              </td>
            </tr>
            <tr className="hover:bg-gray-100">
              <td className="px-4 py-2 ">
                <b>Allocation</b>
              </td>
              <td />
              <td
                className={
                  "px-4 py-2 " + (totals.admin == "ERROR" ? "bg-red-200" : "")
                }
              >
                {total == "ERROR"
                  ? "ERROR"
                  : staff && staff.contract_hours
                    ? ((100 * total) / Number(staff.contract_hours)).toFixed(1)
                    : "No specified time permitted. "}
                %
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="w-1/2">
        <DoughnutChart data={getWorkloadByType()} title={"Workload by type"} />
      </div>
    </div>
  );
}
