import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Rifat Hosen | Full Stack Software Engineer",
  description:
    "Portfolio of Rifat Hosen — Full Stack Developer specializing in Next.js, Flutter, and AI-powered applications. 1000+ problems solved across competitive programming platforms.",
  keywords: [
    "Rifat Hosen",
    "Software Engineer",
    "Full Stack Developer",
    "Next.js",
    "Flutter",
    "React",
    "Portfolio",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
