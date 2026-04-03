import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pay My Bills | Bill AI Concierge",
  description:
    "Pay My Bills — Your Personal Customer Service Concierge. Educational simulation tool.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-pmb-gray min-h-screen">{children}</body>
    </html>
  );
}
