import type { Metadata } from "next";
import "./globals.css";
import Nav from "./components/Nav";

export const metadata: Metadata = {
  title: "Ryan Houlberg",
  description: "Software developer portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=Lato:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Nav />
        <main className="mx-auto max-w-[1100px] px-4 py-12 sm:px-6">
          {children}
        </main>
        <footer className="border-t-2 border-[var(--color-border)] px-4 py-6 text-center font-[family-name:var(--font-display)] text-[0.75rem] text-[var(--color-text-muted)]">
          &copy; 2026 Ryan Houlberg
        </footer>
      </body>
    </html>
  );
}
