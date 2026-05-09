import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Guitar Vault",
  description: "Личный архив песен для гитары",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body
        className={`${montserrat.variable}`}
        style={{
          fontFamily: "Montserrat, sans-serif",
          background: "#0d0d0d",
          color: "#f0ede8",
          minHeight: "100vh",
        }}
      >
        {children}
      </body>
    </html>
  );
}
