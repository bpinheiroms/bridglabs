import type { Locale } from "@/i18n";

export default function LanguageSwitcher({ locale }: { locale: Locale }) {
  function switchLocale(newLocale: Locale) {
    if (newLocale === locale) return;

    document.cookie = `bridglabs_locale=${newLocale}; Path=/; Max-Age=31536000; SameSite=Lax; Secure`;

    const destination = new URL(window.location.href);
    destination.pathname = `/${newLocale}/`;
    window.location.assign(destination);
  }

  return (
    <div className="language-switcher">
      <svg
        aria-hidden="true"
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
        type="button"
        onClick={() => switchLocale("pt")}
        aria-pressed={locale === "pt"}
        aria-label="Usar português"
      >
        PT
      </button>
      <span className="language-divider">/</span>
      <button
        type="button"
        onClick={() => switchLocale("en")}
        aria-pressed={locale === "en"}
        aria-label="Use English"
      >
        EN
      </button>
    </div>
  );
}
