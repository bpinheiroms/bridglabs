type AssetsBinding = {
  fetch(request: Request): Promise<Response>;
};

export type Env = {
  ASSETS: AssetsBinding;
};

export type Locale = "pt" | "en";
type RedirectStatus = 301 | 302 | 308;

export const securityHeaders = {
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
} as const;

const sitemapBody = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.bridglabs.com/pt/</loc>
  </url>
  <url>
    <loc>https://www.bridglabs.com/en/</loc>
  </url>
</urlset>`;

function localeFromLanguageTag(value: string): Locale | null {
  const language = value.trim().toLowerCase().split("-")[0];

  if (language === "pt" || language === "en") return language;
  return null;
}

export function preferredLocale(request: Request): Locale {
  const cookieLocale = request.headers
    .get("Cookie")
    ?.match(/(?:^|;\s*)bridglabs_locale=(pt|en)(?:;|$)/)?.[1];

  if (cookieLocale === "pt" || cookieLocale === "en") return cookieLocale;

  const candidates = (request.headers.get("Accept-Language") ?? "")
    .split(",")
    .map((entry, index) => {
      const [languageTag, ...parameters] = entry.trim().split(";");
      const locale = localeFromLanguageTag(languageTag ?? "");
      const qualityParameter = parameters.find((parameter) =>
        parameter.trim().startsWith("q="),
      );
      const quality = qualityParameter
        ? Number.parseFloat(qualityParameter.trim().slice(2))
        : 1;

      return { locale, quality: Number.isFinite(quality) ? quality : 0, index };
    })
    .filter(
      (candidate): candidate is { locale: Locale; quality: number; index: number } =>
        candidate.locale !== null && candidate.quality > 0,
    )
    .sort((left, right) => right.quality - left.quality || left.index - right.index);

  return candidates[0]?.locale ?? "pt";
}

export function redirectTarget(request: Request):
  | { location: URL; status: RedirectStatus }
  | null {
  const url = new URL(request.url);

  if (url.hostname === "bridglabs.com") {
    url.hostname = "www.bridglabs.com";
    return { location: url, status: 301 };
  }

  if (url.pathname === "/") {
    url.pathname = `/${preferredLocale(request)}/`;
    return { location: url, status: 302 };
  }

  if (url.pathname === "/pt" || url.pathname === "/en") {
    url.pathname += "/";
    return { location: url, status: 308 };
  }

  return null;
}

function withResponseHeaders(response: Response, url: URL): Response {
  const headers = new Headers(response.headers);

  for (const [name, value] of Object.entries(securityHeaders)) {
    headers.set(name, value);
  }

  if (response.ok && url.pathname.startsWith("/assets/")) {
    headers.set("Cache-Control", "public, max-age=31536000, immutable");
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function specialResponse(url: URL): Response | null {
  if (url.pathname !== "/sitemap.xml") return null;

  return new Response(sitemapBody, {
    headers: {
      "Cache-Control": "public, max-age=3600, must-revalidate",
      "Content-Type": "application/xml; charset=UTF-8",
    },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const target = redirectTarget(request);

    if (target) {
      return Response.redirect(target.location.toString(), target.status);
    }

    const url = new URL(request.url);
    const special = specialResponse(url);
    if (special) return withResponseHeaders(special, url);

    const response = await env.ASSETS.fetch(request);
    return withResponseHeaders(response, url);
  },
};
