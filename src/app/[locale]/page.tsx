"use client";

import ClientWrapper from "@/components/ClientWrapper";
import AnimatedContent from "@/components/AnimatedContent";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Image from "next/image";
import { useTranslations } from "next-intl";

const projects = [
  {
    name: "Pinubi",
    descriptionKey: "projects.pinubi.description",
    engineeringDescriptionKey: "projects.pinubi.engineeringDescription",
    stack: [
      "React Native",
      "Expo",
      "Deep Linking",
      "RevenueCat",
      "OneSignal",
      "PostHog",
      "Hono",
      "Firebase",
      "Cloud Run",
      "Gemini",
      "Langfuse",
    ],
    href: "https://pinubi.com.br?utm_source=bridglabs&utm_medium=website&utm_campaign=homepage",
    image: "/pinubi-logo.png",
  },
  {
    name: "Destrua.me",
    descriptionKey: "projects.destrua.description",
    engineeringDescriptionKey: "projects.destrua.engineeringDescription",
    stack: [
      "React 19",
      "Vite",
      "Tailwind CSS 4",
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

export default function Home() {
  const t = useTranslations("HomePage");

  return (
    <div className="bg-white text-[#1d1d1f] min-h-screen">
      <ClientWrapper>
        <AnimatedContent>
          <main className="mx-auto max-w-3xl px-6 pb-16 pt-24 md:pt-32">
            {/* Language Switcher */}
            <div data-hero className="flex justify-end mb-6">
              <LanguageSwitcher />
            </div>

            {/* Intro */}
            <div data-hero className="flex items-center gap-3 mb-8">
              <h1 className="text-2xl md:text-3xl font-medium">
                {t("greeting")}
              </h1>
              <Image
                src="/bruno.jpg"
                alt="Bruno Pinheiro"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
                priority
              />
            </div>

            <div data-hero className="mb-12 max-w-2xl">
              <p className="text-lg leading-relaxed text-[#6e6e73] md:text-xl">
                {t("bio")}
              </p>
            </div>

            {/* Projects */}
            <section
              data-hero
              aria-labelledby="projects-heading"
              className="mb-12"
            >
              <h2
                id="projects-heading"
                className="mb-5 text-lg font-medium text-[#1d1d1f] md:text-xl"
              >
                {t("sideProjectsTitle")}
              </h2>

              <ul className="divide-y divide-[#d2d2d7] border-y border-[#d2d2d7]">
                {projects.map((project) => (
                  <li key={project.name}>
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block py-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a855f7] focus-visible:ring-offset-4"
                    >
                      <span className="flex items-start justify-between gap-5">
                        <span className="flex min-w-0 items-start gap-3">
                          <Image
                            src={project.image}
                            alt=""
                            width={36}
                            height={36}
                            className="h-9 w-9 shrink-0 rounded-lg"
                          />
                          <span className="min-w-0 text-xl font-medium leading-9 text-[#1d1d1f] transition-colors group-hover:text-[#6e6e73] md:text-2xl">
                            {project.name}
                          </span>
                        </span>
                        <svg
                          aria-hidden="true"
                          className="mt-1 h-5 w-5 shrink-0 text-[#86868b] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 motion-reduce:transform-none"
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
                      </span>

                      <span className="mt-4 block max-w-2xl text-base leading-relaxed text-[#6e6e73] md:text-lg">
                        {t(project.descriptionKey)}
                      </span>

                      <span className="mt-5 block border-t border-[#e5e5e7] pt-4">
                        <span className="block text-[11px] font-medium uppercase tracking-[0.14em] text-[#86868b]">
                          {t("howBuilt")}
                        </span>
                        <span className="mt-2 block max-w-2xl text-sm leading-relaxed text-[#6e6e73] md:text-[15px]">
                          {t(project.engineeringDescriptionKey)}
                        </span>
                      </span>

                      <span className="mt-4 flex flex-wrap gap-x-3 gap-y-1.5 font-mono text-[11px] text-[#6e6e73]">
                        {project.stack.map((technology) => (
                          <span key={technology}>{technology}</span>
                        ))}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>

            {/* Links */}
            <div data-hero className="flex items-center gap-5">
              <a
                href="https://x.com/brunopinheiroms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#86868b] hover:text-[#1d1d1f] transition-colors"
                aria-label="X (Twitter)"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/bpinheiroms/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#86868b] hover:text-[#0A66C2] transition-colors"
                aria-label="LinkedIn"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </main>

          {/* Footer */}
          <footer className="mx-auto max-w-3xl px-6 pb-12">
            <div
              data-entrance
              className="flex items-center gap-4 text-sm text-[#86868b]"
            >
              <a
                href={`mailto:${t("footerEmail")}`}
                className="hover:text-[#1d1d1f] transition-colors"
              >
                {t("footerEmail")}
              </a>
              <span className="text-[#d2d2d7]">&middot;</span>
              <span>&copy; {new Date().getFullYear()} Bruno Pinheiro</span>
            </div>
          </footer>
        </AnimatedContent>
      </ClientWrapper>
    </div>
  );
}
