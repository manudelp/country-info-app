// app/page.tsx
import Link from "next/link";

async function fetchCountries() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/countries`
  );
  if (!res.ok) {
    throw new Error("Failed to fetch countries");
  }
  return res.json();
}

export default async function HomePage() {
  const countries = await fetchCountries();

  return (
    <div className="container mx-auto p-6 ">
      <h1 className="text-3xl font-bold text-center mb-6">
        Available Countries
      </h1>
      <div className="grid grid-cols-3 gap-4">
        {countries.map((country: { countryCode: string; name: string }) => (
          <Link
            key={country.countryCode}
            href={`/country/${country.countryCode}`}
            className="text-lg text-center text-blue-400 hover:underline hover:text-blue-600 transition-colors"
          >
            {country.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
