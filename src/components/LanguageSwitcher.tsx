"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function switchLocale(newLocale: "pt" | "en") {
    router.replace(pathname, { locale: newLocale });
  }

  return (
    <div className="flex items-center gap-1.5 text-sm">
      <svg
        className="w-4 h-4 text-[#86868b]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
      <button
        onClick={() => switchLocale("pt")}
        className={`transition-colors ${
          locale === "pt"
            ? "text-[#1d1d1f] font-medium"
            : "text-[#86868b] hover:text-[#1d1d1f]"
        }`}
      >
        PT
      </button>
      <span className="text-[#d2d2d7]">/</span>
      <button
        onClick={() => switchLocale("en")}
        className={`transition-colors ${
          locale === "en"
            ? "text-[#1d1d1f] font-medium"
            : "text-[#86868b] hover:text-[#1d1d1f]"
        }`}
      >
        EN
      </button>
    </div>
  );
}
