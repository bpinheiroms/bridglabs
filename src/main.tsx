import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Home from "@/app/[locale]/page";
import "@/app/globals.css";
import { localeFromPath, translatorFor } from "@/i18n";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Missing #root element");
}

const locale = localeFromPath(window.location.pathname);
document.documentElement.lang = locale === "pt" ? "pt-BR" : "en";

createRoot(root).render(
  <StrictMode>
    <Home locale={locale} t={translatorFor(locale)} />
  </StrictMode>,
);
