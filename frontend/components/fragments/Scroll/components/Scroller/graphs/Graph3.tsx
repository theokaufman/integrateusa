import React from "react";
import {
  Chart as ChartJS,
  LinearScale,
  BarElement,
  CategoryScale,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import annotationPlugin from "chartjs-plugin-annotation";

ChartJS.register(
  LinearScale,
  BarElement,
  CategoryScale,
  Tooltip,
  annotationPlugin
);

export default function ScrollerBar2({ exposureData }) {
  const labels = [
    "Demographics of Avg White Student's School",
    "Demograpics of Avg Non-White Student's school",
  ];

  const bar = (data, group) => {
    return data.map((e) => e[group]);
  };

  const barData = [
    {
      label: "White",
      id: "prop_wh",
      data: bar(exposureData, "white"),
      backgroundColor: "#339933",
    },
    {
      label: "Asian",
      id: "prop_as",
      data: bar(exposureData, "asian"),
      backgroundColor: "#FF5050",
    },
    {
      label: "Black",
      id: "prop_bl",
      data: bar(exposureData, "black"),
      backgroundColor: "#4472C4",
    },
    {
      label: "Hispanic",
      id: "prop_hi",
      data: bar(exposureData, "hispanic"),
      backgroundColor: "#FF9900",
    },
    {
      label: "Other",
      id: "prop_or",
      data: bar(exposureData, "other"),
      backgroundColor: "#FFC000",
    },
  ];

  const data = {
    labels: labels,
    datasets: barData,
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        display: true,
        callbacks: {
          label: function (context) {
            let label = context.dataset.data[context.dataIndex];
            return context.dataset.label + " " + label + "%";
          },
        },
      },
    },
    responsive: true,
    scales: {
      x: {
        grid: {
          display: false,
        },
        display: true,
        stacked: true,
        barPercentage: 1,
      },
      y: {
        stacked: true,
        max: 100,
        grid: {
          display: false,
        },
        position: "right",
      },
    } as any,
  };

  return <Bar data={data} options={options} />;
}
