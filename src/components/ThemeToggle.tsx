import Sprite from "@/components/Sprite";
import type { Translator } from "@/i18n";
import { moonMini, sunMini } from "@/sprites";
import { toggleTheme, useTheme } from "@/theme";

const sunColors = { y: "#ffb92e", o: "#ffe680" };
const moonColors = { m: "#f3efd8", s: "#c9c5b4" };

export default function ThemeToggle({ t }: { t: Translator }) {
  const theme = useTheme();

  return (
    <button
      type="button"
      className="theme-toggle"
      role="switch"
      aria-checked={theme === "night"}
      aria-label={t("theme.label")}
      onClick={toggleTheme}
    >
      <span className="theme-toggle-knob" aria-hidden="true">
        <Sprite art={theme === "night" ? moonMini : sunMini} colors={theme === "night" ? moonColors : sunColors} />
      </span>
    </button>
  );
}
