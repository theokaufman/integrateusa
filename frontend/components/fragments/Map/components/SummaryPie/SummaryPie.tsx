import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function SummaryPie({ pieData }) {
  const options = {
    reponsive: true,
    plugins: {
      tooltip: {
        enabled: true,
        display: true,
        callbacks: {
          label: function (context) {
            let label = context.dataset.data[context.dataIndex];
            return (
              data.labels[context.dataIndex] + " " + label.toFixed(1) + "%"
            );
          },
        },
      },
      legend: {
        display: false,
      },
    },
  };

  const data = {
    labels: ["Asian", "Black", "Hispanic", "White", "Other"],
    datasets: [
      {
        label: "Enrollment Share by Race",
        data: pieData,
        borderColor: ["#FF5050", "#4472C4", "#FF9900", "#339933", "#FFC000"],
        borderWidth: 1,
        backgroundColor: [
          "#FF5050",
          "#4472C4",
          "#FF9900",
          "#339933",
          "#FFC000",
        ],
      },
    ],
  };

  return <Pie data={data} options={options} />;
}
