import { lazy } from "react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import PixelImage from "@/components/PixelImage";
import RouteSection from "@/components/RouteSection";
import Scenery from "@/components/Scenery";
import Sprite from "@/components/Sprite";
import ThemeToggle from "@/components/ThemeToggle";
import type { Locale, Translator } from "@/i18n";
import { arrowDown, arrowOut, brand } from "@/sprites";
import { CAREER_LEAD } from "@/world/route";

// The 3D world is the heaviest thing on the page; the copy never waits for it.
const World = lazy(() => import("@/world/World"));

const brandColors = { "#": "var(--ink)", b: "var(--surface)" };

const projects = [
  {
    key: "jobsSearch",
    name: "Jobs Search",
    href: "https://jobs.bridglabs.com/?utm_source=bridglabs&utm_medium=website&utm_campaign=homepage",
    image: "/jobs-search-logo.svg",
  },
  {
    key: "sentuni",
    name: "Sentuni",
    href: "https://apps.apple.com/app/id6811380725",
    image: "/sentuni-logo.png",
  },
  {
    key: "pinubi",
    name: "Pinubi",
    href: "https://pinubi.com/pt?utm_source=bridglabs&utm_medium=website&utm_campaign=homepage",
    image: "/pinubi-logo.png",
  },
  {
    key: "refound",
    name: "Re:Found",
    href: "https://refound.lol/?utm_source=bridglabs&utm_medium=website&utm_campaign=homepage",
    image: "/refound-logo.svg",
  },
  {
    key: "destrua",
    name: "Destrua.me",
    href: "https://destrua.me?utm_source=bridglabs&utm_medium=website&utm_campaign=homepage",
    image: "/destrua-me-logo.svg",
  },
] as const;

const careerMilestones = [
  {
    key: "blueRiver",
    short: "Blue River Technology",
    year: "2022",
    logos: [
      { src: "/company-logos/sparkai.jpg", name: "SparkAI" },
      { src: "/company-logos/blue-river.jpg", name: "Blue River Technology" },
      { src: "/company-logos/john-deere.jpg", name: "John Deere" },
    ],
  },
  {
    key: "pagaleve",
    short: "Pagaleve",
    year: "2022",
    logos: [{ src: "/company-logos/pagaleve.jpg", name: "Pagaleve" }],
  },
  {
    key: "gavea",
    short: "Gavea Marketplace",
    year: "2021",
    logos: [{ src: "/company-logos/gavea.jpg", name: "Gavea Marketplace" }],
  },
  {
    key: "globo",
    short: "Globo",
    year: "2020",
    logos: [{ src: "/company-logos/globo.jpg", name: "Globo" }],
  },
  {
    key: "b3",
    short: "B3",
    year: "2018",
    logos: [{ src: "/company-logos/b3.jpg", name: "B3" }],
  },
  {
    key: "oxxy",
    short: "Grupo Oxxy",
    year: "2015",
    logos: [{ src: "/company-logos/grupo-oxxy.jpg", name: "Grupo Oxxy" }],
  },
] as const;

export default function Home({ locale, t }: { locale: Locale; t: Translator }) {
  const action = t("status.visit");
  const productStops = projects.map((project) => {
    return {
      id: project.key,
      marker: (
        <span className="logo-tile">
          <PixelImage src={project.image} grid={28} fit={0.86} />
        </span>
      ),
      title: project.name,
      body: (
        <>
          <p>{t(`projects.${project.key}.description`)}</p>
          <a
            className="px-btn"
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${action}: ${project.name}`}
          >
            {action}
            <Sprite art={arrowOut} />
          </a>
        </>
      ),
    };
  });

  const careerStops = careerMilestones.map((milestone) => ({
    id: milestone.key,
    marker: <span className="stop-year">{milestone.year}</span>,
    title: milestone.short,
    body: (
      <>
        <p className="stop-meta">
          {t(`career.${milestone.key}.role`)}
          <span>{t(`career.${milestone.key}.periodShort`)}</span>
        </p>
        <p>{t(`career.${milestone.key}.description`)}</p>
        <p className="stop-logos">
          {milestone.logos.map((logo) => (
            <img key={logo.src} src={logo.src} alt={logo.name} title={logo.name} />
          ))}
        </p>
      </>
    ),
  }));

  return (
    <div className="site-shell">
      <Scenery>
        <World
          logos={projects.map((project) => project.image)}
          years={careerMilestones.map((milestone) => milestone.year)}
          figure="/bruno-full.webp"
        />
      </Scenery>

      <header className="site-header">
        <a className="wordmark" href="#top" aria-label={t("homeLabel")}>
          <Sprite art={brand} colors={brandColors} className="wordmark-mark" />
          <span>
            bridg<span>/labs</span>
          </span>
        </a>

        <nav className="site-nav" aria-label={t("navLabel")}>
          <a className="nav-link" href="#lab">
            {t("navProducts")}
          </a>
          <a className="nav-link" href="#trajectory">
            {t("navJourney")}
          </a>
          <a className="nav-link" href="#closing">
            {t("navContact")}
          </a>
          <LanguageSwitcher locale={locale} />
          <ThemeToggle t={t} />
        </nav>
      </header>

      <main>
        <section id="top" className="hero" aria-labelledby="hero-heading">
          <div className="hero-inner">
            <img
              className="hero-avatar"
              src="/illustrations/bruno-portrait-v4.webp"
              alt={t("hero.photoAlt")}
              width={1254}
              height={1254}
              fetchPriority="high"
            />
            <h1 id="hero-heading">{t("hero.name")}</h1>
            <p className="hero-role">{t("hero.kicker")}</p>
          </div>
          <a className="scroll-cue" href="#lab">
            {t("hero.scrollCue")}
            <Sprite art={arrowDown} />
          </a>
        </section>

        <RouteSection
          id="lab"
          heading="BridgLabs"
          lead={t("founder.description")}
          stops={productStops}
        />

        <RouteSection
          id="trajectory"
          heading={t("navJourney")}
          lead={t("journey.lead")}
          stops={careerStops}
          leadIn={CAREER_LEAD}
        />

        <section id="closing" className="closing" aria-labelledby="closing-heading">
          <div className="closing-note">
            <h2 id="closing-heading">{t("closing.title")}</h2>
            <p>{t("closing.description")}</p>
            <nav className="closing-links" aria-label={t("footer.navLabel")}>
              <a className="px-btn px-btn-primary" href={`mailto:${t("footer.email")}`}>
                {t("footer.email")}
              </a>
              <a
                className="px-btn"
                href="https://www.linkedin.com/in/bpinheiroms/"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
                <Sprite art={arrowOut} />
              </a>
              <a
                className="px-btn"
                href="https://x.com/brunopinheiroms"
                target="_blank"
                rel="noopener noreferrer"
              >
                X
                <Sprite art={arrowOut} />
              </a>
            </nav>
          </div>
          <p className="closing-credit">{t("footer.note")}</p>
        </section>
      </main>
    </div>
  );
}
