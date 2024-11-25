import React from "react";
import Link from "next/link";

interface Border {
  countryCode: string;
  commonName: string;
}

interface BordersProps {
  borders: Border[];
}

const Borders: React.FC<BordersProps> = ({ borders }) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl md:text-2xl font-semibold border-b-2 border-gray-300 pb-2 mb-4">
        Border Countries
      </h2>
      <div className="flex flex-wrap justify-center gap-2">
        {borders.length > 0 ? (
          borders.map((border, index) => (
            <Link
              href={`/country/${border.countryCode}`}
              key={index}
              className="bg-gray-800 px-3 py-1 rounded-lg text-white hover:bg-gray-700 transition-colors duration-200 text-center"
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
  );
};

export default Borders;
