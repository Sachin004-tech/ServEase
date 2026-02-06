import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const ServicePieChart = () => {
  const data = {
    labels: ["Cleaning", "Electrician", "Salon", "AC Repair"],
    datasets: [
      {
        data: [35, 20, 25, 20],
        backgroundColor: [
          "rgba(255,99,132,0.6)",
          "rgba(54,162,235,0.6)",
          "rgba(255,206,86,0.6)",
          "rgba(75,192,192,0.6)",
        ],
      },
    ],
  };

  return <Pie data={data} height={280} />;
};

export default ServicePieChart;
