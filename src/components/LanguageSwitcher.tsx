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
      <button
        type="button"
        onClick={() => switchLocale("pt")}
        aria-pressed={locale === "pt"}
        aria-label="Usar português"
      >
        PT
      </button>
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
