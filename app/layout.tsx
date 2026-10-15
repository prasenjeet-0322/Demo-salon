import type { Metadata, Viewport } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/Toast";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DEMO | Luxury Salon & Spa Atelier",
  description:
    "Experience bespoke couture hair styling, restorative 24k gold facials, and luxury bridal artistry in an oasis of modern elegance.",
  keywords: [
    "Luxury Salon",
    "Hair Styling",
    "Bridal Makeup",
    "Hydra Facial",
    "Nail Art",
    "Spa Treatment",
    "Demo Salon",
  ],
  authors: [{ name: "Demo Atelier" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${plusJakarta.variable}`}>
      <body className="bg-[#FAF8F5] text-zinc-900 font-sans antialiased selection:bg-[#c59c47] selection:text-white min-h-screen flex flex-col">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
