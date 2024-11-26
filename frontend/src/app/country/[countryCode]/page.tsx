"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Loader from "../../components/loader";
import Borders from "@/app/components/borders";
import Population from "@/app/components/population";

interface BorderCountry {
  commonName: string;
  officialName: string;
  countryCode: string;
  region: string;
  borders: BorderCountry[] | null;
}

interface CountryData {
  country: string;
  borders: BorderCountry[];
  populationData: { year: number; value: number }[];
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

  useEffect(() => {
    async function fetchCountryData() {
      if (!countryCode) return;
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/countries/${countryCode}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch country data");
        }
        const data = await response.json();
        setCountryData(data);
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
  if (error)
    return (
      <div className="text-red-500 text-3xl w-full h-screen grid place-items-center">
        {error}
      </div>
    );

  if (!countryData) return null;
  const { country, borders, populationData, flagUrl } = countryData;
  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-3xl md:text-4xl font-semibold text-center mb-6 text-white">
        {country}
      </h1>

      <div className="flex justify-center mb-4">
        <Image
          priority
          src={flagUrl || "/placeholder.png"}
          alt={`${country} flag`}
          className="w-24 h-auto sm:w-32 md:w-56"
          width={128}
          height={80}
        />
      </div>

      <Borders borders={borders} />

      <Population populationData={populationData} country={country} />
    </div>
  );
}
