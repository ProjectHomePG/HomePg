import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";
import { ThemeProvider } from "../context/ThemeContext";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:8082";

export const metadata = {
<<<<<<< HEAD
  metadataBase: new URL(siteUrl),
=======
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
>>>>>>> 16d18e3f86c17e9e28a829c01cf0864b5cb53ad0
  title: {
    default: "Livio | Premium PG & Co-Living Spaces",
    template: "%s | Livio",
  },
  description: "Find premium, verified PG (Paying Guest) rooms and co-living accommodations near tech parks, colleges, metro stations, and hospitals.",
  keywords: ["PG", "Paying Guest", "Co-living", "Hostel", "Student Accommodation", "Rooms for rent"],
  authors: [{ name: "Livio" }],
  openGraph: {
    title: "Livio | Premium PG & Co-Living Spaces",
    description: "Find premium, verified PG rooms and co-living accommodations.",
<<<<<<< HEAD
    url: siteUrl,
=======
    url: "/",
>>>>>>> 16d18e3f86c17e9e28a829c01cf0864b5cb53ad0
    siteName: "Livio",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Livio | Premium PG & Co-Living Spaces",
    description: "Find premium, verified PG rooms and co-living accommodations.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('livio-theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}else{document.documentElement.classList.remove('dark')}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-primary-500 selection:text-white">
        <ThemeProvider>
          <Navbar />
          <main className="flex-grow w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 py-8 md:py-12">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
