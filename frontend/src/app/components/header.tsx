import React from "react";
import Link from "next/link";

const Header: React.FC = () => {
  return (
    <header className="bg-blue-500 text-white p-4">
      <Link href={"/"} className="text-xl font-bold">
        Country Info App
      </Link>
    </header>
  );
};

export default Header;
