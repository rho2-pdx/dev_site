import type { Metadata } from "next";
import "./globals.css";
import Nav from "./components/Nav";

export const metadata: Metadata = {
  title: "Ryan Houlberg — Developer",
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
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Nav />
        <main
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "3rem 1.5rem",
          }}
        >
          {children}
        </main>
        <footer
          style={{
            borderTop: "1px solid var(--color-border)",
            padding: "1.5rem",
            textAlign: "center",
            color: "var(--color-text-muted)",
            fontFamily: "var(--font-display)",
            fontSize: "0.75rem",
          }}
        >
          © 2026 Ryan Houlberg
        </footer>
      </body>
    </html>
  );
}
