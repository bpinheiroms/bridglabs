import LanguageSwitcher from "@/components/LanguageSwitcher";
import CountUp from "@/components/CountUp";
import Mark from "@/components/Mark";
import Scribble from "@/components/Scribble";
import Stickers from "@/components/Stickers";
import ThemeToggle from "@/components/ThemeToggle";
import type { Locale, Translator } from "@/i18n";
import { richText } from "@/richText";
import { fill, formatCount, formatDay, formatRevenue } from "@/stats";
import { useStats } from "@/useStats";

const overcoded = {
  href: "https://overcoded.app/?utm_source=bridglabs&utm_medium=website&utm_campaign=homepage",
  image: "/overcoded-icon.png",
};

// `hidden` keeps a product ready here without showing it yet.
const projects = [
  {
    key: "adevinha",
    name: "aDEVinha",
    href: "https://adevinha.com.br/?utm_source=bridglabs&utm_medium=website&utm_campaign=homepage",
    domain: "adevinha.com.br",
    image: "/adevinha-icon.svg",
    hidden: false,
  },
  {
    key: "opencodereview",
    name: "OpenCodeReview",
    href: "https://opencodereview.run/?utm_source=bridglabs&utm_medium=website&utm_campaign=homepage",
    domain: "opencodereview.run",
    image: "/opencodereview-icon.svg",
    hidden: true,
  },
  {
    key: "jobsSearch",
    name: "Jobs Search",
    href: "https://jobs.bridglabs.com/?utm_source=bridglabs&utm_medium=website&utm_campaign=homepage",
    domain: "jobs.bridglabs.com",
    image: "/jobs-search-logo.svg",
    hidden: false,
  },
  {
    key: "sentuni",
    name: "Sentuni",
    href: "https://apps.apple.com/app/id6811380725",
    domain: "App Store",
    image: "/sentuni-logo.png",
    hidden: false,
  },
  {
    key: "pinubi",
    name: "Pinubi",
    href: "https://pinubi.com/pt?utm_source=bridglabs&utm_medium=website&utm_campaign=homepage",
    domain: "pinubi.com",
    image: "/pinubi-logo.png",
    hidden: false,
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

function Arrow() {
  return (
    <svg className="arrow" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export default function Home({ locale, t }: { locale: Locale; t: Translator }) {
  const stats = useStats();
  const count = (n: number) => formatCount(n, locale);
  // Products with a line of real numbers, filled into the `{slots}` of `building.stats.*`.
  const statValues: Record<string, Record<string, string>> = {
    adevinha: { games: count(stats.adevinha.games), answers: count(stats.adevinha.answers) },
    jobsSearch: {
      subscribers: String(stats.jobsSearch.subscribers),
      revenue: formatRevenue(stats.jobsSearch.revenue, locale),
      requests: count(stats.jobsSearch.requests),
    },
  };

  return (
    <div className="page">
      <header className="topbar">
        <div className="topbar-controls">
          <LanguageSwitcher locale={locale} />
          <ThemeToggle t={t} />
        </div>
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-heading">
          <p className="eyebrow">{t("hero.role")}</p>
          <h1 id="hero-heading">
            <span className="hero-greeting">{t("hero.greeting")}</span>
            {richText(t("hero.headline"))}
          </h1>
          <Stickers label={t("contact.navLabel")} email={t("contact.email")} />
          <div className="hero-lead">
            <Scribble />
            <p>{richText(t("hero.lead"))}</p>
          </div>
          <figure className="polaroid">
            <div className="polaroid-photo">
              <img
                src="/illustrations/bruno-portrait-v4.webp"
                alt={t("hero.photoAlt")}
                width={1254}
                height={1254}
                fetchPriority="high"
              />
            </div>
            <figcaption className="hand">{t("hero.caption")}</figcaption>
          </figure>
        </section>

        <section className="block" aria-labelledby="chapters-heading">
          <h2 id="chapters-heading" className="block-title">
            <span className="eyebrow">{t("chapters.heading")}</span>
          </h2>
          <ol className="timeline">
            {chapters.map((chapter) => (
              <li key={chapter.key} className="timeline-item">
                <span className="timeline-years">
                  {chapter.from === chapter.to
                    ? chapter.from
                    : `${chapter.from} — ${chapter.to ?? t("chapters.now")}`}
                </span>
                <h3>
                  {t(`chapters.${chapter.key}.company`)}
                  <span className="timeline-role">{t(`chapters.${chapter.key}.role`)}</span>
                </h3>
                <p className="timeline-text">{richText(t(`chapters.${chapter.key}.text`))}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="block" aria-labelledby="building-heading">
          <h2 id="building-heading" className="block-title">
            <span className="eyebrow">{t("building.heading")}</span>
          </h2>
          <p className="block-lead">{t("building.lead")}</p>
          <p className="live-note">
            <span className="live-dot" aria-hidden="true" />
            {fill(t("building.updated"), { day: formatDay(stats.updatedAt, locale) })}
          </p>

          <a className="sheet" href={overcoded.href} target="_blank" rel="noopener noreferrer">
            <div className="sheet-copy">
              <span className="card-head">
                <img src={overcoded.image} alt="" width={32} height={32} />
                <span className="card-name hand">Overcoded</span>
              </span>
              <p className="sheet-tagline">{t("building.overcoded.tagline")}</p>
              <p>{t("building.overcoded.text")}</p>
              <span className="sheet-cta">
                {t("building.play")}
                <Arrow />
              </span>
            </div>
            <div className="sheet-stat">
              <Mark kind="highlight">
                <CountUp value={stats.overcoded.players} format={count} />
              </Mark>
              <span>{t("building.overcoded.statLabel")}</span>
              <p className="sheet-facts">{richText(
                  fill(t("building.overcoded.facts"), {
                    visitors: count(stats.overcoded.visitors),
                    rounds: count(stats.overcoded.rounds),
                  }),
                )}</p>
            </div>
          </a>

          <ul className="index-cards">
            {projects
              .filter((project) => !project.hidden)
              .map((project) => (
                <li key={project.key}>
                  <a className="index-card" href={project.href} target="_blank" rel="noopener noreferrer">
                    <span className="card-head">
                      <img src={project.image} alt="" width={26} height={26} loading="lazy" />
                      <span className="card-name hand">{project.name}</span>
                      <Arrow />
                    </span>
                    <p>{t(`building.${project.key}`)}</p>
                    {statValues[project.key] && (
                      <p className="card-stat">
                        {richText(fill(t(`building.stats.${project.key}`), statValues[project.key]))}
                      </p>
                    )}
                    <span className="card-domain">{project.domain}</span>
                  </a>
                </li>
              ))}
          </ul>
        </section>

        <section className="contact" aria-labelledby="contact-heading">
          <h2 id="contact-heading" className="contact-cta hand">
            {t("contact.cta")}
          </h2>
          <a className="contact-email" href={`mailto:${t("contact.email")}`}>
            <Mark kind="underline">{t("contact.email")}</Mark>
          </a>
          <Stickers label={t("contact.navLabel")} />
          <p className="contact-foot">
            {t("contact.location")} · {new Date().getFullYear()}
          </p>
        </section>
      </main>
    </div>
  );
}
