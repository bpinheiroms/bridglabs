import AnimatedContent from "@/components/AnimatedContent";
import ClientWrapper from "@/components/ClientWrapper";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import type { Locale, Translator } from "@/i18n";

const bridgLabsIcon = new URL("../icon.svg", import.meta.url).href;

const projects = [
  {
    key: "pemuli",
    name: "Pemuli",
    status: "building",
    release: "v-next",
    href: "https://pemuli.com?utm_source=bridglabs&utm_medium=website&utm_campaign=homepage",
    image: "/pemuli-logo.svg",
  },
  {
    key: "refound",
    name: "Re:Found",
    status: "shipped",
    release: "rel/04",
    href: "https://refound.lol/?utm_source=bridglabs&utm_medium=website&utm_campaign=homepage",
    image: "/refound-logo.svg",
  },
  {
    key: "jobsSearch",
    name: "Jobs Search",
    status: "shipped",
    release: "rel/03",
    href: "https://jobs.bridglabs.com/?utm_source=bridglabs&utm_medium=website&utm_campaign=homepage",
    image: "/jobs-search-logo.svg",
  },
  {
    key: "pinubi",
    name: "Pinubi",
    status: "shipped",
    release: "rel/01",
    href: "https://pinubi.com/pt?utm_source=bridglabs&utm_medium=website&utm_campaign=homepage",
    image: "/pinubi-logo.png",
  },
  {
    key: "destrua",
    name: "Destrua.me",
    status: "shipped",
    release: "rel/02",
    href: "https://destrua.me?utm_source=bridglabs&utm_medium=website&utm_campaign=homepage",
    image: "/destrua-me-logo.svg",
  },
] as const;

const careerMilestones = [
  {
    key: "blueRiver",
    year: "2022",
    logos: [
      { src: "/company-logos/sparkai.jpg", name: "SparkAI" },
      { src: "/company-logos/blue-river.jpg", name: "Blue River Technology" },
      { src: "/company-logos/john-deere.jpg", name: "John Deere" },
    ],
  },
  {
    key: "gavea",
    year: "2021",
    logos: [{ src: "/company-logos/gavea.jpg", name: "Gavea Marketplace" }],
  },
  {
    key: "globo",
    year: "2020",
    logos: [{ src: "/company-logos/globo.jpg", name: "Globo" }],
  },
  {
    key: "b3",
    year: "2018",
    logos: [{ src: "/company-logos/b3.jpg", name: "B3" }],
  },
  {
    key: "oxxy",
    year: "2015",
    logos: [{ src: "/company-logos/grupo-oxxy.jpg", name: "Grupo Oxxy" }],
  },
] as const;

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      className="link-arrow"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.75"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 17 17 7M8 7h9v9"
      />
    </svg>
  );
}

function RouteStroke({ progress = false }: { progress?: boolean }) {
  return (
    <div
      className={`journey-route${progress ? " journey-route-progress" : " journey-route-base"}`}
      {...(progress ? { "data-route-progress": true } : {})}
      aria-hidden="true"
    >
      <span className="journey-route-line" />
    </div>
  );
}

export default function Home({ locale, t }: { locale: Locale; t: Translator }) {
  return (
    <div className="site-shell">
      <ClientWrapper>
        <AnimatedContent>
          <header data-hero className="site-header">
            <a className="wordmark" href="#top" aria-label={t("homeLabel")}>
              <span className="wordmark-mark" aria-hidden="true">
                B
              </span>
              <span>
                bridg<span>/labs</span>
              </span>
            </a>

            <nav className="site-nav" aria-label={t("navLabel")}>
              <a href="#trajectory">{t("navJourney")}</a>
              <a
                className="nav-link-wide"
                href="https://www.linkedin.com/in/bpinheiroms/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("navLinkedIn")}
              </a>
              <a className="nav-link-wide" href={`mailto:${t("footer.email")}`}>
                {t("navContact")}
              </a>
              <LanguageSwitcher locale={locale} />
            </nav>
          </header>

          <main id="top">
            <section className="hero" aria-labelledby="hero-heading">
              <div className="hero-stage">
                <div data-hero className="hero-meta">
                  <p>{t("hero.name")}</p>
                  <span>{t("hero.location")}</span>
                  <span>{t("hero.experience")}</span>
                  <span>{t("hero.timezone")}</span>
                </div>

                <div data-hero className="hero-portrait">
                  <div className="portrait-frame">
                    <img
                      src="/bruno.jpg"
                      alt={t("hero.photoAlt")}
                      width={400}
                      height={400}
                    />
                  </div>
                  <span className="portrait-caption">{t("hero.portraitCaption")}</span>
                </div>

                <div data-hero className="hero-current">
                  <span>{t("hero.currentLabel")}</span>
                  <strong>{t("hero.currentValue")}</strong>
                  <p>{t("hero.currentNote")}</p>
                </div>
              </div>

              <div data-hero className="hero-thesis">
                <p className="hero-kicker">{t("hero.kicker")}</p>
                <h1 id="hero-heading">{t("hero.title")}</h1>
                <p>{t("hero.description")}</p>
              </div>
            </section>

            <section
              id="trajectory"
              className="journey-section"
              aria-label={t("navJourney")}
            >
              <div className="journey-list" data-journey>
                <RouteStroke />
                <RouteStroke progress />

                <a className="journey-launch" href="#trajectory">
                  <span className="journey-launch-label">{t("hero.cta")}</span>
                </a>

                <svg
                  className="journey-launch-curve"
                  aria-hidden="true"
                  focusable="false"
                  preserveAspectRatio="none"
                  viewBox="0 0 100 100"
                >
                  <path
                    d="M 100 0 C 100 38 90 52 68 60 C 42 70 12 68 4 86 C 1 91 0 96 0 100"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
                <span className="journey-launch-arrow" aria-hidden="true">↓</span>

                <ol>
                  <li
                    className="journey-entry journey-entry-first journey-entry-founder"
                    data-journey-entry
                  >
                    <time className="journey-date" dateTime="2026">
                      <span>{t("timeline.now")}</span>
                      <small>{t("timeline.current")}</small>
                    </time>
                    <span className="journey-node" aria-hidden="true"><span /></span>

                    <article className="milestone founder-milestone">
                      <div className="milestone-identity">
                        <span className="career-mark mark-brand" aria-hidden="true">
                          <img src={bridgLabsIcon} alt="" width={52} height={52} />
                        </span>
                        <div>
                          <p className="company-line">
                            <span>BridgLabs</span>
                            <span className="current-badge">{t("founder.badge")}</span>
                          </p>
                          <h3>{t("founder.role")}</h3>
                        </div>
                      </div>

                      <p className="milestone-description">{t("founder.description")}</p>
                      <p className="projects-heading">{t("founder.projectsHeading")}</p>

                      <ul className="project-list">
                        {projects.map((project) => (
                          <li key={project.key} className="project-row" data-project-row>
                            <span className="project-mark" aria-hidden="true">
                              <img src={project.image} alt="" width={58} height={58} />
                            </span>

                            <div className="project-copy">
                              <div className="project-title-line">
                                <span className="project-release">{project.release}</span>
                                <h4>{project.name}</h4>
                                {project.status === "building" ? (
                                  <span className="building-badge">{t("status.building")}</span>
                                ) : null}
                              </div>
                              <p>{t(`projects.${project.key}.description`)}</p>
                              <p className="project-highlight">
                                {t(`projects.${project.key}.highlight`)}
                              </p>
                              <div className="project-meta">
                                <a
                                  href={project.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {project.status === "building"
                                    ? t("status.follow")
                                    : t("status.visit")}
                                  <ArrowIcon />
                                </a>
                              </div>
                            </div>

                            {project.status === "shipped" ? (
                              <span
                                className="shipped-stamp"
                                data-stamp
                                role="img"
                                aria-label={t("status.shippedLabel")}
                              >
                                <span>SHIPPED</span>
                              </span>
                            ) : null}
                          </li>
                        ))}
                      </ul>
                    </article>
                  </li>

                  {careerMilestones.map((milestone) => (
                    <li key={milestone.key} className="journey-entry" data-journey-entry>
                      <time className="journey-date" dateTime={milestone.year}>
                        <span>{milestone.year}</span>
                        <small>{t(`career.${milestone.key}.periodShort`)}</small>
                      </time>
                      <span className="journey-node" aria-hidden="true"><span /></span>

                      <article className="milestone career-milestone">
                        <div className="milestone-identity">
                          <span className="company-logo-stack" aria-hidden="true">
                            {milestone.logos.map((logo) => (
                              <span className="company-logo" key={logo.src} title={logo.name}>
                                <img src={logo.src} alt="" width={52} height={52} />
                              </span>
                            ))}
                          </span>
                          <div>
                            <p className="company-line">
                              <span>{t(`career.${milestone.key}.company`)}</span>
                              {milestone.key === "blueRiver" ? (
                                <span className="current-badge">{t("timeline.current")}</span>
                              ) : null}
                            </p>
                            <h3>{t(`career.${milestone.key}.role`)}</h3>
                          </div>
                        </div>

                        <p className="milestone-description">
                          {t(`career.${milestone.key}.description`)}
                        </p>
                        <div className="career-proof">
                          <span>{t("journey.proofLabel")}</span>
                          <p>{t(`career.${milestone.key}.proof`)}</p>
                        </div>
                      </article>
                    </li>
                  ))}

                  <li className="journey-entry journey-entry-closing" data-journey-entry>
                    <span className="journey-date" aria-hidden="true">
                      <span>→</span>
                    </span>
                    <span className="journey-node journey-node-end" aria-hidden="true"><span /></span>
                    <div className="journey-closing">
                      <h3>{t("closing.title")}</h3>
                      <p>{t("closing.description")}</p>
                    </div>
                  </li>
                </ol>
              </div>
            </section>
          </main>

          <footer data-entrance className="site-footer">
            <p>{t("footer.note")}</p>
            <nav aria-label={t("footer.navLabel")}>
              <a href="#top">{t("footer.backTop")}</a>
              <a
                href="https://x.com/brunopinheiroms"
                target="_blank"
                rel="noopener noreferrer"
              >
                X
              </a>
              <a
                href="https://www.linkedin.com/in/bpinheiroms/"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
              <a href={`mailto:${t("footer.email")}`}>{t("footer.contact")}</a>
            </nav>
          </footer>
        </AnimatedContent>
      </ClientWrapper>
    </div>
  );
}
