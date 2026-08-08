import en from "../messages/en.json";
import pt from "../messages/pt.json";

export type Locale = "pt" | "en";
export type Translator = (key: string) => string;

const messages = { pt, en } as const;

export function localeFromPath(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "pt";
}

export function translatorFor(locale: Locale): Translator {
  const homeMessages = messages[locale].HomePage as Record<string, unknown>;

  return (key: string) => {
    const value = key.split(".").reduce<unknown>((current, segment) => {
      if (!current || typeof current !== "object") return undefined;
      return (current as Record<string, unknown>)[segment];
    }, homeMessages);

    if (typeof value !== "string") {
      throw new Error(`Missing ${locale} translation: HomePage.${key}`);
    }

    return value;
  };
}
