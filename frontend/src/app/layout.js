import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("http://localhost:8082"), // TODO: Replace with production domain
  title: {
    default: "Livio - Find Paying Guest Accommodations Instantly",
    template: "%s | Livio",
  },
  description: "Find premium, verified PG (Paying Guest) rooms and co-living accommodations near tech parks, colleges, metro stations, and hospitals.",
  keywords: ["PG", "Paying Guest", "Co-living", "Hostel", "Student Accommodation", "Rooms for rent"],
  authors: [{ name: "Livio" }],
  openGraph: {
    title: "Livio - Find Paying Guest Accommodations",
    description: "Find premium, verified PG rooms and co-living accommodations.",
    url: "http://localhost:8082",
    siteName: "Livio",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Livio - Find Paying Guest Accommodations",
    description: "Find premium, verified PG rooms and co-living accommodations.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg-light dark:bg-bg-dark text-slate-800 dark:text-slate-200">
        <Navbar />
        <main className="flex-grow w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
