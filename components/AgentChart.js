"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function AgentChart({ graphData }) {
  const data = {
    labels: ["2000", "2005", "2010", "2015", "2020"],
    datasets: graphData.map((d) => ({
      label: d.label,
      data: d.data,
      borderColor:
        d.label === "Unreliable"
          ? "#22c55e"
          : d.label === "Reliable"
          ? "#ef4444"
          : "#6b7280",
      tension: 0.4,
      fill: false,
      pointRadius: 0,
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: { color: "rgba(0,0,0,0.1)" },
        ticks: { display: false },
      },
      x: {
        grid: { display: false },
        ticks: { color: "#6b7280" },
      },
    },
    plugins: {
      legend: { display: false },
    },
    animation: { duration: 800, easing: "easeInOutCubic" },
  };

  return <Line data={data} options={options} />;
}
