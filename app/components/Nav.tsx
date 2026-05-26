"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b-2 border-[var(--color-border)] bg-[var(--color-bg)]">
      <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-[1.1rem] font-bold tracking-[-0.02em] text-[var(--color-text)]"
        >
          ryan houlberg
        </Link>
        <div className="flex flex-wrap gap-4 sm:gap-7">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`border-b-2 pb-0.5 font-[family-name:var(--font-display)] text-[0.85rem] transition-colors duration-150 ${
                  isActive
                    ? "border-[var(--color-accent)] font-semibold text-[var(--color-accent)]"
                    : "border-transparent font-normal text-[var(--color-text-muted)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
