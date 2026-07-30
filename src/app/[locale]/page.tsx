"use client";

import AnimatedContent from "@/components/AnimatedContent";
import ClientWrapper from "@/components/ClientWrapper";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Image from "next/image";
import { useTranslations } from "next-intl";

const shippedProjects = [
  {
    number: "01",
    name: "Pinubi",
    descriptionKey: "projects.pinubi.description",
    engineeringDescriptionKey: "projects.pinubi.engineeringDescription",
    tagKeys: ["mobile", "maps", "ai"],
    stack: [
      "React Native",
      "Expo",
      "Gemini",
      "Google Maps",
      "Langfuse",
      "Cloud Run",
    ],
    href: "https://pinubi.com.br?utm_source=bridglabs&utm_medium=website&utm_campaign=homepage",
    image: "/pinubi-logo.png",
  },
  {
    number: "02",
    name: "Destrua.me",
    descriptionKey: "projects.destrua.description",
    engineeringDescriptionKey: "projects.destrua.engineeringDescription",
    tagKeys: ["web", "ai", "cloud"],
    stack: [
      "React 19",
      "Hono",
      "OpenRouter",
      "Cloudflare Workers",
      "D1",
      "KV",
    ],
    href: "https://destrua.me?utm_source=bridglabs&utm_medium=website&utm_campaign=homepage",
    image: "/destrua-me-logo.svg",
  },
] as const;

const nextProject = {
  name: "Pemuli",
  descriptionKey: "projects.pemuli.description",
  engineeringDescriptionKey: "projects.pemuli.engineeringDescription",
  stack: [
    "Swift 6",
    "SwiftUI",
    "ActivityKit",
    "WidgetKit",
    "watchOS",
    "WatchConnectivity",
  ],
  href: "https://pemuli.com?utm_source=bridglabs&utm_medium=website&utm_campaign=homepage",
  image: "/pemuli-logo.svg",
} as const;

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

export default function Home() {
  const t = useTranslations("HomePage");

  return (
    <div className="site-shell">
      <ClientWrapper>
        <AnimatedContent>
          <header data-hero className="site-header">
            <a className="wordmark" href="#top" aria-label="BridgLabs — início">
              <span className="wordmark-mark" aria-hidden="true">
                B
              </span>
              <span>
                bridg<span>/labs</span>
              </span>
            </a>

            <nav className="site-nav" aria-label={t("navLabel")}>
              <a href="#build-log">{t("navWork")}</a>
              <a href={`mailto:${t("footerEmail")}`}>{t("navContact")}</a>
              <LanguageSwitcher />
            </nav>
          </header>

          <main id="top">
            <section className="hero" aria-labelledby="hero-heading">
              <div data-hero className="hero-identity">
                <Image
                  src="/bruno.jpg"
                  alt=""
                  width={52}
                  height={52}
                  className="hero-avatar"
                  priority
                />
                <p>{t("heroEyebrow")}</p>
              </div>

              <h1 data-hero id="hero-heading">
                {t("headline")}
              </h1>

              <div data-hero className="hero-copy">
                <p>{t("bio")}</p>
                <a href="#build-log" className="text-link">
                  {t("seeProjects")}
                  <span aria-hidden="true">↓</span>
                </a>
              </div>
            </section>

            <section
              id="build-log"
              className="build-log"
              aria-labelledby="build-log-heading"
            >
              <div data-project className="section-heading">
                <p className="log-meta">{t("logMeta")}</p>
                <h2 id="build-log-heading">{t("logTitle")}</h2>
              </div>

              <ol className="timeline">
                {shippedProjects.map((project) => (
                  <li key={project.name} data-project className="timeline-entry">
                    <span className="timeline-node" aria-hidden="true">
                      <span />
                    </span>

                    <article className="project-card">
                      <div className="project-meta">
                        <span className="release-number">
                          rel/{project.number}
                        </span>
                        <span className="project-tags">
                          {project.tagKeys.map((tagKey) => (
                            <span key={tagKey}>{t(`tags.${tagKey}`)}</span>
                          ))}
                        </span>
                        <span className="meta-rule" aria-hidden="true" />
                        <span className="release-state">{t("live")}</span>
                      </div>

                      <div
                        data-stamp
                        className="shipped-stamp"
                        role="img"
                        aria-label={t("shippedStampLabel")}
                      >
                        <span>{t("shippedStamp")}</span>
                      </div>

                      <div className="project-body">
                        <div className="project-mark" aria-hidden="true">
                          <Image
                            src={project.image}
                            alt=""
                            width={72}
                            height={72}
                          />
                        </div>

                        <div className="project-content">
                          <h3>{project.name}</h3>
                          <p className="project-description">
                            {t(project.descriptionKey)}
                          </p>

                          <div className="engineering-note">
                            <span>{t("howBuilt")}</span>
                            <p>{t(project.engineeringDescriptionKey)}</p>
                          </div>

                          <div className="project-footer">
                            <a
                              href={project.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="project-link"
                            >
                              {t("visitProject")}
                              <ArrowIcon />
                            </a>

                            <ul
                              className="tech-list"
                              aria-label={t("technologiesLabel")}
                            >
                              {project.stack.map((technology) => (
                                <li key={technology}>{technology}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </article>
                  </li>
                ))}

                <li data-next className="timeline-entry timeline-next">
                  <span className="timeline-node" aria-hidden="true">
                    <span />
                  </span>

                  <article className="next-card">
                    <div className="project-meta">
                      <span className="release-number">v-next</span>
                      <span className="progress-badge">{t("inProgress")}</span>
                      <span className="meta-rule" aria-hidden="true" />
                      <span className="release-state">{t("landsHere")}</span>
                    </div>

                    <div className="next-content">
                      <div className="project-mark next-project-mark" aria-hidden="true">
                        <Image
                          src={nextProject.image}
                          alt=""
                          width={72}
                          height={72}
                        />
                      </div>

                      <div>
                        <p className="next-kicker">{t("whatsNext")}</p>
                        <h3>{nextProject.name}</h3>
                        <p className="project-description">
                          {t(nextProject.descriptionKey)}
                        </p>

                        <div className="engineering-note">
                          <span>{t("buildingNow")}</span>
                          <p>{t(nextProject.engineeringDescriptionKey)}</p>
                        </div>

                        <a
                          href={nextProject.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-link"
                        >
                          {t("followProject")}
                          <ArrowIcon />
                        </a>
                      </div>
                    </div>
                  </article>
                </li>
              </ol>
            </section>
          </main>

          <footer data-entrance className="site-footer">
            <p>{t("footerNote")}</p>
            <div>
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
              <a href={`mailto:${t("footerEmail")}`}>{t("footerEmail")}</a>
            </div>
          </footer>
        </AnimatedContent>
      </ClientWrapper>
    </div>
  );
}
