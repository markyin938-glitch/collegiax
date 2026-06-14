import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CollegiaX - The Intelligent Campus Ecosystem",
  description: "Discover events, join clubs, and connect with your campus community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      style={
        {
          "--font-syne": '"Avenir Next", "Segoe UI", sans-serif',
          "--font-dm-sans": '"Segoe UI", "Helvetica Neue", sans-serif',
          "--font-jetbrains": '"Consolas", "SFMono-Regular", monospace',
        } as React.CSSProperties
      }
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
