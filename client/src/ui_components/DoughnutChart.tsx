import { Doughnut } from "react-chartjs-2";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartOptions,
  type ChartData,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function DoughnutChart({
  data,
  title,
}: {
  data: ChartData<"doughnut">;
  title: string;
}) {
  const options: ChartOptions<"doughnut"> = {
    plugins: {
      legend: {
        position: "bottom",
      },
    },
    cutout: "65%", // makes it a doughnut
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white rounded-2xl shadow">
      <h2 className="text-lg font-semibold text-center mb-4">{title}</h2>
      <Doughnut data={data} options={options} />
    </div>
  );
}

export default DoughnutChart;
