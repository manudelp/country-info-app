"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
import Loader from "../../components/loader";

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

interface BorderCountry {
  commonName: string;
  officialName: string;
  countryCode: string;
  region: string;
  borders: BorderCountry[] | null;
}

interface PopulationData {
  year: number;
  value: number;
}

interface CountryData {
  country: string;
  borders: BorderCountry[];
  populationData: PopulationData[];
  flagUrl: string | null;
}

export default function CountryInfoPage({
  params,
}: {
  params: Promise<{ countryCode: string }>;
}) {
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [countryData, setCountryData] = useState<CountryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Unwrap the `params` and set the `countryCode`
  useEffect(() => {
    async function unwrapParams() {
      const unwrappedParams = await params;
      if (!unwrappedParams.countryCode) {
        setError("Invalid country code");
        setLoading(false);
        return;
      }
      setCountryCode(unwrappedParams.countryCode);
    }
    unwrapParams();
  }, [params]);

  // Fetch country data when `countryCode` changes
  useEffect(() => {
    async function fetchCountryData() {
      if (!countryCode) return;
      setLoading(true); // Set loading to true when fetching starts
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/countries/${countryCode}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch country data");
        }
        const data = await response.json();
        setCountryData(data);
        console.log(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchCountryData();
  }, [countryCode]);

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500">{error}</div>;

  if (!countryData) return null;

  const { country, borders, populationData, flagUrl } = countryData;

  // Prepare population chart data
  const chartData = {
    labels: populationData.map((data: { year: number }) => data.year), // Extract years
    datasets: [
      {
        label: "Population",
        data: populationData.map((data: { value: number }) => data.value), // Extract population values
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: `Population of ${country}` },
    },
    scales: {
      x: { title: { display: true, text: "Year" } },
      y: { title: { display: true, text: "Population" } },
    },
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-6">{country}</h1>
      <div className="flex justify-center mb-6">
        <Image
          priority
          src={flagUrl || "/flag-placeholder.svg"}
          alt={`${country} flag`}
          className="w-32 h-auto rounded shadow-md"
          width={128}
          height={80}
        />
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold border-b-2 border-gray-300 pb-2">
          Border Countries
        </h2>
        <div className="flex gap-2 mt-4">
          {borders.length > 0 ? (
            borders.map((border, index) => (
              <Link
                href={`/country/${border.countryCode}`}
                key={index}
                className="bg-gray-800 p-2 rounded-lg text-white"
              >
                {border.commonName}
              </Link>
            ))
          ) : (
            <div className="text-gray-500 italic">
              No border countries available
            </div>
          )}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold border-b-2 border-gray-300 pb-2">
          Population Chart
        </h2>
        {populationData.length > 0 ? (
          <div className="bg-white p-4 rounded shadow-md">
            <Line data={chartData} options={chartOptions} />
          </div>
        ) : (
          <div className="text-gray-500 italic mt-4">
            No population data available
          </div>
        )}
      </div>
    </div>
  );
}
