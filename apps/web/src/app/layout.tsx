import type { Metadata } from "next";
import { Fraunces, Sora } from "next/font/google";
import { AppShell } from "@/components/app-shell";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

export const metadata: Metadata = {
  title: "CommunityOS",
  description: "Society Intelligence, Management & Community Network Platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${sora.variable} ${fraunces.variable}`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
