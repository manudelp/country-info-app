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
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-semibold text-center mb-8 text-white">
        Available Countries
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {countries.map((country: { countryCode: string; name: string }) => (
          <Link
            key={country.countryCode}
            href={`/country/${country.countryCode}`}
            className="block p-4 border border-gray-300 rounded-lg text-lg text-center text-white hover:bg-blue-100 hover:text-blue-600 transition-all duration-200"
          >
            {country.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
