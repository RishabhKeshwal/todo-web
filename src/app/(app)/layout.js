import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

// Font configurations
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Todo App - Organize Your Life",
  description:
    "A modern Todo application built with Next.js, Express, and MongoDB Atlas. Manage tasks effortlessly with login, registration, and full CRUD functionality—stay productive and organized!",
};

// RootLayout component with server-side Axios fetch
export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Pass user to Navbar */}
        <Navbar />
        <div className="py-16">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
