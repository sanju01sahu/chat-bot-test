"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-700 bg-[#1E293B]">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-4 px-4">
        <Link href="/" className="group inline-flex items-center gap-2">
          <Image
            src="https://festivals-banners.s3.ap-south-1.amazonaws.com/nosky-logo-white.webp"
            alt="Nosky Logo"
            width={24}
            height={24}
            className="h-15 w-15 rounded object-contain"
          />
          <span className="text-sm font-semibold tracking-wide text-white group-hover:text-indigo-100">
            CRM GenAI
          </span>
        </Link>
        <nav className="ml-auto flex items-center gap-1 text-sm">
          <NavLink href="/" active={pathname === "/"}>
            Home
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={[
        "rounded px-3 py-1.5 transition-colors", // 4px rounding = Tailwind `rounded`
        active
          ? "text-white border border-white"
          : "text-slate-200 hover:text-white hover:border hover:border-white",
      ].join(" ")}
      style={{ backgroundColor: "#1E293B" }} // ensures it matches parent bg
    >
      {children}
    </Link>
  );
}
