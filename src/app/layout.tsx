import type { Metadata } from "next";
import AppLayout from "../components/AppLayout";
import "./globals.css";

export const metadata: Metadata = {
  title: "SLIIT Mozilla Club · Certify Platform",
  description: "Official Certificate Verification and Generation Platform for SLIIT Mozilla Club",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
