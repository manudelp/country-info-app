import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { ChartData, ChartOptions } from "chart.js";

// Register ChartJS components
ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

interface PopulationProps {
  populationData: { year: number; value: number }[];
  country: string;
}

const Population: React.FC<PopulationProps> = ({ populationData, country }) => {
  const chartData: ChartData<"line"> = {
    labels: populationData?.map((data) => data.year),
    datasets: [
      {
        label: "Population",
        data: populationData?.map((data) => data.value),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: `Population of ${country}` },
    },
    scales: {
      x: { title: { display: true, text: "Year" } },
      y: { title: { display: true, text: "Population" } },
    },
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl md:text-2xl font-semibold border-b-2 border-gray-300 pb-2 mb-4">
        Population Chart
      </h2>
      {populationData ? (
        <div className="bg-white p-4 rounded-lg mt-4">
          <Line data={chartData} options={chartOptions} />
        </div>
      ) : (
        <div className="text-gray-500 italic mt-4">
          No population data available
        </div>
      )}
    </div>
  );
};

export default Population;
