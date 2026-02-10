import ClientWrapper from "@/components/ClientWrapper";
import AnimatedContent from "@/components/AnimatedContent";
import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-white text-[#1d1d1f] min-h-screen">
      <ClientWrapper>
        <AnimatedContent>
          <main className="max-w-2xl mx-auto px-6 pt-24 md:pt-32 pb-16">
            {/* Intro */}
            <div data-hero className="flex items-center gap-3 mb-8">
              <span className="text-2xl md:text-3xl font-medium">
                Oi, eu sou o Bruno
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
              Sou desenvolvedor e construo apps em público.
              Compartilho o processo, os erros e o que aprendo pelo caminho.
            </p>

            {/* Projects */}
            <div data-hero className="space-y-5 mb-12">
              <p className="text-lg md:text-xl text-[#86868b] leading-relaxed">
                Agora estou construindo o{" "}
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
                {" "}e mais dois projetos:
              </p>
              <div className="flex items-center gap-3 mt-3">
                <span className="inline-flex items-center gap-1.5 text-[#1d1d1f]/40 font-medium select-none blur-[5px]">
                  <span className="w-5 h-5 rounded bg-[#d2d2d7] inline-block" />
                  Projeto secreto
                </span>
                <span className="inline-flex items-center gap-1.5 text-[#1d1d1f]/40 font-medium select-none blur-[5px]">
                  <span className="w-5 h-5 rounded bg-[#d2d2d7] inline-block" />
                  Novo app
                </span>
              </div>
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
                href="mailto:contato@bridglabs.com"
                className="hover:text-[#1d1d1f] transition-colors"
              >
                contato@bridglabs.com
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
