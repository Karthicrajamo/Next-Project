"use client";

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ComputeChart({ computeValue }) {
  const data = {
    datasets: [
      {
        data: [computeValue, 100 - computeValue],
        backgroundColor: ["#22c55e", "#e0e0e0"],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "80%",
    plugins: {
      tooltip: { enabled: false },
      legend: { display: false },
    },
    animation: { duration: 800, easing: "easeInOutCubic" },
  };

  return <Doughnut data={data} options={options} />;
}
