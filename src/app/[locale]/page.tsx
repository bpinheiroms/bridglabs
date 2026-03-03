"use client";

import ClientWrapper from "@/components/ClientWrapper";
import AnimatedContent from "@/components/AnimatedContent";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("HomePage");

  return (
    <div className="bg-white text-[#1d1d1f] min-h-screen">
      <ClientWrapper>
        <AnimatedContent>
          <main className="max-w-2xl mx-auto px-6 pt-24 md:pt-32 pb-16">
            {/* Language Switcher */}
            <div data-hero className="flex justify-end mb-6">
              <LanguageSwitcher />
            </div>

            {/* Intro */}
            <div data-hero className="flex items-center gap-3 mb-8">
              <span className="text-2xl md:text-3xl font-medium">
                {t("greeting")}
              </span>
              <Image
                src="/bruno.jpg"
                alt="Bruno Pinheiro"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
                priority
              />
            </div>

            <p
              data-hero
              className="text-lg md:text-xl text-[#86868b] leading-relaxed mb-6"
            >
              {t("bio")}
            </p>

            {/* Projects */}
            <div data-hero className="space-y-5 mb-12">
              <p className="text-lg md:text-xl text-[#86868b] leading-relaxed">
                {t("currentlyBuilding")}{" "}
                <a
                  href="https://pinubi.com.br?utm_source=bridglabs&utm_medium=website&utm_campaign=homepage"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-baseline gap-1.5 text-[#1d1d1f] font-medium hover:opacity-70 transition-opacity"
                >
                  <Image
                    src="/pinubi-logo.png"
                    alt="Pinubi"
                    width={20}
                    height={20}
                    className="w-5 h-5 rounded translate-y-0.5"
                  />
                  Pinubi
                </a>
                {t("projectConnector")}{" "}
                <a
                  href="https://destrua.me?utm_source=bridglabs&utm_medium=website&utm_campaign=homepage"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-baseline gap-1.5 text-[#1d1d1f] font-medium hover:opacity-70 transition-opacity"
                >
                  <Image
                    src="/destrua-me-logo.svg"
                    alt="destrua.me"
                    width={20}
                    height={20}
                    className="w-5 h-5 rounded translate-y-0.5"
                  />
                  destrua.me
                </a>
                {t("projectConnector")}{" "}
                <a
                  href="https://github.com/bpinheiroms/claude-office"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-baseline gap-1.5 text-[#1d1d1f] font-medium hover:opacity-70 transition-opacity"
                >
                  <svg
                    className="w-5 h-5 rounded translate-y-0.5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                  Claude Office
                </a>{" "}
                {t("andMoreProjects")}{" "}
                <span className="inline-flex items-center gap-1.5 text-[#1d1d1f]/40 font-medium select-none blur-[5px]">
                  <span className="w-5 h-5 rounded bg-[#d2d2d7] inline-block translate-y-0.5" />
                  {t("secretProject")}
                </span>
              </p>
            </div>

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
          <footer className="max-w-2xl mx-auto px-6 pb-12">
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
