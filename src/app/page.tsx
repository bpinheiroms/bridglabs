import ClientWrapper from "@/components/ClientWrapper";
import AnimatedContent from "@/components/AnimatedContent";
import TextCycle from "@/components/TextCycle";
import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-white text-[#1d1d1f] overflow-x-hidden">
      <ClientWrapper>
        <AnimatedContent>
          {/* Hero Section */}
          <section className="min-h-screen flex items-center relative px-6 md:px-12 lg:px-24 py-20 overflow-hidden">
            {/* Background gradient orbs */}
            <div
              data-speed="0.5"
              className="absolute top-20 -left-40 w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-gradient-to-br from-purple-300/20 to-violet-400/20 rounded-full blur-[120px] pointer-events-none"
            />

            <div className="w-full max-w-6xl mx-auto">
              {/* Mobile Photo - visible only on mobile */}
              <div className="flex justify-center mb-8 lg:hidden">
                <div
                  data-hero
                  className="relative w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden shadow-lg"
                >
                  <Image
                    src="/bruno.jpg"
                    alt="Bruno Pinheiro"
                    width={144}
                    height={144}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                {/* Left - Text */}
                <div className="space-y-6 md:space-y-8 text-center lg:text-left">
                  <h1
                    data-hero
                    className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold leading-[1.1] tracking-[-0.03em]"
                  >
                    Crio apps que{" "}
                    <span className="bg-gradient-to-r from-purple-500 via-violet-500 to-purple-600 bg-clip-text text-transparent">
                      simplificam
                    </span>{" "}
                    sua vida.
                  </h1>

                  <p
                    data-hero
                    className="text-lg md:text-xl text-[#86868b] leading-relaxed max-w-lg mx-auto lg:mx-0"
                  >
                    Transformo ideias em produtos reais.
                  </p>

                  <div
                    data-hero
                    className="flex items-center justify-center lg:justify-start gap-5"
                  >
                    <a
                      href="https://x.com/brunopinheiroms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#86868b] hover:text-[#1d1d1f]  transition-colors duration-300"
                      aria-label="X (Twitter)"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                    <a
                      href="https://www.linkedin.com/in/bpinheiroms/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#86868b] hover:text-[#0A66C2] transition-colors duration-300"
                      aria-label="LinkedIn"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                  </div>
                </div>

                {/* Right - Photo (Desktop only) */}
                <div className="relative hidden lg:flex items-center justify-center">
                  <div
                    data-speed="0.6"
                                        className="absolute w-[500px] h-[500px] bg-gradient-to-br from-purple-200/40 to-violet-300/40 rounded-full blur-[100px]"
                  />
                  <div
                    data-speed="1.1"
                    className="relative z-10 w-72 h-72 md:w-80 md:h-80 rounded-full overflow-hidden transition-transform duration-700 hover:scale-105 shadow-2xl"
                  >
                    <Image
                      src="/bruno.jpg"
                      alt="Bruno Pinheiro"
                      width={320}
                      height={320}
                      className="w-full h-full object-cover"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
              <span className="text-[10px] tracking-[0.2em] uppercase">Scroll</span>
              <div className="w-px h-8 bg-gradient-to-b from-current to-transparent" />
            </div>
          </section>

          {/* Pinubi Section */}
          <section className="min-h-screen flex items-center relative py-20 md:py-32 px-6 md:px-12 lg:px-24 bg-[#f5f5f7] overflow-hidden">
            {/* Animated background */}
            <div
              data-speed="0.4"
              className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[400px] h-[400px] md:w-[700px] md:h-[700px] bg-gradient-to-br from-purple-400/20 to-violet-500/20 rounded-full blur-[150px] pointer-events-none"
            />

            <div className="w-full max-w-6xl mx-auto relative z-10">
              <div className="flex flex-col items-center text-center gap-8 lg:gap-12">
                {/* Logo */}
                <div data-reveal-left className="relative flex-shrink-0">
                  <Image
                    src="/pinubi-logo.png"
                    alt="Pinubi"
                    width={200}
                    height={200}
                    className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 drop-shadow-xl transition-transform duration-500 hover:scale-110"
                  />
                </div>

                {/* Text */}
                <div className="space-y-4 md:space-y-6">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold leading-[1.1] tracking-[-0.02em]">
                    <TextCycle />
                  </h2>

                  <p
                    data-scroll-fade
                    className="text-base md:text-lg lg:text-xl text-[#86868b] max-w-md mx-auto leading-relaxed"
                  >
                    Pinubi ajuda voce a descobrir e organizar os melhores lugares da sua cidade.
                  </p>
                </div>

                {/* Button */}
                <div data-scale>
                  <a
                    href="https://pinubi.com.br"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-[#1d1d1f] text-white text-base md:text-lg font-medium rounded-full hover:scale-105 hover:shadow-xl active:scale-95 transition-all duration-300"
                  >
                    Conhecer Pinubi
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="py-24 md:py-40 px-6 md:px-12 lg:px-24 relative overflow-hidden">
            {/* Background elements */}
            <div
              data-speed="0.3"
                            className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] md:w-[800px] md:h-[400px] bg-gradient-to-b from-purple-200/20 to-transparent rounded-full blur-[120px] pointer-events-none"
            />

            <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-10 relative z-10">
              <h2
                data-text-reveal
                className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold tracking-[-0.03em]"
              >
                Vamos conversar?
              </h2>

              <div data-scale className="space-y-4">
                <a
                  href="mailto:contato@bridglabs.com"
                  className="inline-flex items-center text-lg md:text-xl text-[#86868b] hover:text-[#1d1d1f]  transition-all duration-300 border-b border-[#86868b]/30 hover:border-purple-500 pb-1"
                >
                  contato@bridglabs.com
                </a>
              </div>

              {/* Social links */}
              <div data-scroll-fade className="flex items-center justify-center gap-6 pt-4">
                <a
                  href="https://x.com/brunopinheiroms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#86868b] hover:text-[#1d1d1f]  transition-colors duration-300"
                  aria-label="X (Twitter)"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/in/bpinheiroms/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#86868b] hover:text-[#0A66C2] transition-colors duration-300"
                  aria-label="LinkedIn"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="py-6 md:py-8 px-6 md:px-12 lg:px-24 border-t border-[#d2d2d7]/50">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-xs md:text-sm text-[#86868b]">
                © {new Date().getFullYear()} Bruno Pinheiro
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="https://x.com/brunopinheiroms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#86868b] hover:text-[#1d1d1f]  transition-colors duration-300"
                  aria-label="X (Twitter)"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/in/bpinheiroms/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#86868b] hover:text-[#0A66C2] transition-colors duration-300"
                  aria-label="LinkedIn"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          </footer>
        </AnimatedContent>
      </ClientWrapper>
    </div>
  );
}
