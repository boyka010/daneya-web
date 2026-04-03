import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Daneya — Timeless Feminine Luxury",
  description:
    "Discover elegant abayas, flowing capes, and sophisticated sets crafted for the modern woman. Timeless luxury meets modest fashion.",
  keywords: [
    "Daneya",
    "modest fashion",
    "abayas",
    "luxury hijab",
    "premium modest wear",
    "elegant abaya",
    "Egyptian fashion",
    "modest luxury",
  ],
  icons: {
    icon: "/images/logo.png",
  },
  openGraph: {
    title: "Daneya — Timeless Feminine Luxury",
    description: "Discover elegant abayas, flowing capes, and sophisticated sets crafted for the modern woman.",
    type: "website",
    locale: "en_US",
    siteName: "Daneya",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${playfair.variable} ${inter.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
