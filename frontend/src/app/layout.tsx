import type { Metadata } from "next";

import { Poppins } from "next/font/google";

import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],

  weight: ["400", "500", "600", "700"],

  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "GrainTrail",

  description: "Follow your grain from the border to the buyer.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} font-sans antialiased bg-ink text-snow`}
      >
        {children}
      </body>
    </html>
  );
}
