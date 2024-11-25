// app/layout.tsx
import "./globals.css";
import Header from "./components/header";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"], // Specify the required subsets
  variable: "--font-poppins", // Define a CSS variable for the font
  weight: ["400", "700"], // Specify the required weights
});

export const metadata = {
  title: "Country Info App",
  description: "Get detailed information about countries.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="bg-gray-900 text-white">
        <Header />
        {children}
      </body>
    </html>
  );
}
