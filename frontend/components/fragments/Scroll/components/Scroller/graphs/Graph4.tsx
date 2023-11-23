import React from "react";
import {
  Chart as ChartJS,
  LinearScale,
  BarElement,
  CategoryScale,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import annotationPlugin from "chartjs-plugin-annotation";

ChartJS.register(
  LinearScale,
  BarElement,
  CategoryScale,
  // Tooltip,
  annotationPlugin
);

export default function ScrollerBar3({ comparisonData }) {
  const labels = [
    "Demographics of Avg White Student's School",
    "Demograpics of Avg Non-White Student's school",
  ];

  const data = {
    labels: labels,
    datasets: [
      {
        data: comparisonData,
        backgroundColor: ["#339933", "#339933", "#000000"],
        borderColor: ["#339933", "#339933", "#000000"],
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
        display: false,
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
        barPercentage: 1,
      },
      y: {
        max: 100,
        grid: {
          display: false,
        },
        position: "right",
      },
    } as any,
    annotations: {
      label1: {
        type: "label",
        xValue: 0,
        yValue: 21,
        content: ["42%"],
        font: {
          size: 18,
        },
      },
      label2: {
        type: "label",
        xValue: 1,
        yValue: 12,
        content: ["24%"],
        font: {
          size: 18,
        },
      },
      label3: {
        type: "label",
        xValue: 2,
        yValue: 9,
        color: "white",
        content: ["18%"],
        font: {
          size: 18,
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
}
