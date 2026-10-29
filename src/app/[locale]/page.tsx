import LanguageSwitcher from "@/components/LanguageSwitcher";
import Mark from "@/components/Mark";
import ThemeToggle from "@/components/ThemeToggle";
import type { Locale, Translator } from "@/i18n";
import { richText } from "@/richText";

const overcoded = {
  href: "https://overcoded.app/?utm_source=bridglabs&utm_medium=website&utm_campaign=homepage",
  image: "/overcoded-icon.png",
};

// `hidden` keeps a product ready here without showing it yet; `stat` adds a line of real numbers.
const projects = [
  {
    key: "adevinha",
    name: "aDEVinha",
    href: "https://adevinha.com.br/?utm_source=bridglabs&utm_medium=website&utm_campaign=homepage",
    domain: "adevinha.com.br",
    image: "/adevinha-icon.svg",
    hidden: false,
    stat: true,
  },
  {
    key: "opencodereview",
    name: "OpenCodeReview",
    href: "https://opencodereview.run/?utm_source=bridglabs&utm_medium=website&utm_campaign=homepage",
    domain: "opencodereview.run",
    image: "/opencodereview-icon.svg",
    hidden: true,
    stat: false,
  },
  {
    key: "jobsSearch",
    name: "Jobs Search",
    href: "https://jobs.bridglabs.com/?utm_source=bridglabs&utm_medium=website&utm_campaign=homepage",
    domain: "jobs.bridglabs.com",
    image: "/jobs-search-logo.svg",
    hidden: false,
    stat: true,
  },
  {
    key: "sentuni",
    name: "Sentuni",
    href: "https://apps.apple.com/app/id6811380725",
    domain: "App Store",
    image: "/sentuni-logo.png",
    hidden: false,
    stat: false,
  },
  {
    key: "pinubi",
    name: "Pinubi",
    href: "https://pinubi.com/pt?utm_source=bridglabs&utm_medium=website&utm_campaign=homepage",
    domain: "pinubi.com",
    image: "/pinubi-logo.png",
    hidden: false,
    stat: false,
  },
] as const;

const chapters = [
  { key: "blueRiver", from: "2022", to: null },
  { key: "pagaleve", from: "2022", to: "2022" },
  { key: "gavea", from: "2021", to: "2022" },
  { key: "globo", from: "2020", to: "2021" },
  { key: "b3", from: "2018", to: "2020" },
  { key: "oxxy", from: "2015", to: "2018" },
] as const;

const profiles = [
  { name: "GitHub", href: "https://github.com/bpinheiroms" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/bpinheiroms/" },
  { name: "X", href: "https://x.com/brunopinheiroms" },
] as const;

function Arrow() {
  return (
    <svg className="arrow" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export default function Home({ locale, t }: { locale: Locale; t: Translator }) {
  return (
    <div className="page">
      <header className="topbar">
        <span className="topbar-name">{t("hero.name")}</span>
        <div className="topbar-controls">
          <LanguageSwitcher locale={locale} />
          <ThemeToggle t={t} />
        </div>
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-heading">
          <div className="hero-copy">
            <p className="eyebrow">{t("hero.role")}</p>
            <h1 id="hero-heading">{richText(t("hero.headline"))}</h1>
            <p className="hero-lead">{t("hero.lead")}</p>
          </div>
          <img
            className="hero-avatar"
            src="/illustrations/bruno-portrait-v4.webp"
            alt={t("hero.photoAlt")}
            width={1254}
            height={1254}
            fetchPriority="high"
          />
        </section>

        <section className="block" aria-labelledby="chapters-heading">
          <h2 id="chapters-heading" className="eyebrow">
            {t("chapters.heading")}
          </h2>
          <ol className="chapters">
            {chapters.map((chapter) => (
              <li key={chapter.key} className="chapter">
                {/* Holds its place while the chapter's text scrolls past. */}
                <div className="chapter-label">
                  <span className="chapter-years">
                    {chapter.from === chapter.to
                      ? chapter.from
                      : `${chapter.from} — ${chapter.to ?? t("chapters.now")}`}
                  </span>
                  <h3>{t(`chapters.${chapter.key}.company`)}</h3>
                  <span className="chapter-role">{t(`chapters.${chapter.key}.role`)}</span>
                </div>
                <p className="chapter-text">{richText(t(`chapters.${chapter.key}.text`))}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="block" aria-labelledby="building-heading">
          <h2 id="building-heading" className="eyebrow">
            {t("building.heading")}
          </h2>
          <p className="block-lead">{t("building.lead")}</p>

          <a className="feature" href={overcoded.href} target="_blank" rel="noopener noreferrer">
            <div className="feature-copy">
              <span className="card-head">
                <img src={overcoded.image} alt="" width={28} height={28} />
                <span className="card-name">Overcoded</span>
              </span>
              <p className="feature-tagline">{t("building.overcoded.tagline")}</p>
              <p>{t("building.overcoded.text")}</p>
              <span className="feature-cta">
                {t("building.play")}
                <Arrow />
              </span>
            </div>
            <div className="feature-stat">
              <Mark kind="highlight">{t("building.overcoded.stat")}</Mark>
              <span>{t("building.overcoded.statLabel")}</span>
              <p className="feature-facts">{richText(t("building.overcoded.facts"))}</p>
            </div>
          </a>

          <ul className="cards">
            {projects
              .filter((project) => !project.hidden)
              .map((project) => (
                <li key={project.key}>
                  <a className="card" href={project.href} target="_blank" rel="noopener noreferrer">
                    <span className="card-head">
                      <img src={project.image} alt="" width={22} height={22} loading="lazy" />
                      <span className="card-name">{project.name}</span>
                      <Arrow />
                    </span>
                    <p>{t(`building.${project.key}`)}</p>
                    {project.stat && <p className="card-stat">{richText(t(`building.stats.${project.key}`))}</p>}
                    <span className="card-domain">{project.domain}</span>
                  </a>
                </li>
              ))}
          </ul>
        </section>

        <section className="contact" aria-label={t("contact.navLabel")}>
          <a className="contact-email" href={`mailto:${t("contact.email")}`}>
            <Mark kind="underline">{t("contact.email")}</Mark>
          </a>
          <nav className="contact-links" aria-label={t("contact.navLabel")}>
            {profiles.map((profile) => (
              <a key={profile.name} href={profile.href} target="_blank" rel="noopener noreferrer">
                {profile.name}
              </a>
            ))}
            <span>
              {t("contact.location")} · {new Date().getFullYear()}
            </span>
          </nav>
        </section>
      </main>
    </div>
  );
}
