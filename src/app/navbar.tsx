"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  // The page the customer is on right now, like "/" or "/menu"
  const currentPage = usePathname();

  // Gives a menu link its style. The current page gets a white underline.
  function getLinkStyle(path: string) {
    const baseStyle = "border-b-2 px-2 py-2 transition duration-200";

    if (currentPage === path) {
      return baseStyle + " border-white text-white";
    }

    return baseStyle + " border-transparent text-stone-300 hover:text-white";
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#111111]">
      <nav
        aria-label="Main Navigation"
        className="mx-auto grid w-full grid-cols-3 items-center gap-2 px-4 py-3 text-white sm:px-6"
      >
        {/* Logo */}
        <div className="flex items-center justify-start">
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white/5 transition hover:bg-white/10 sm:h-10 sm:w-10"
          >
            <Image
              src="/Messenger_creation_ACB7DC2C-7AB6-4CBB-817C-DE6ACAA416C2.webp"
              alt="شعار الأكل وسنينه"
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          </Link>
        </div>

        {/* Menu links */}
        <ul className="flex items-center justify-center gap-4 text-sm font-medium sm:gap-8 sm:text-base">
          <li>
            <Link href="/" className={getLinkStyle("/")}>
              الرئيسية
            </Link>
          </li>
          <li>
            <Link href="/menu" className={getLinkStyle("/menu")}>
              القائمة
            </Link>
          </li>
        </ul>

        {/* Empty space on the right, so the menu links stay in the center */}
        <div />
      </nav>
    </header>
  );
}