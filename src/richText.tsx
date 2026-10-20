import type { ReactNode } from "react";
import Mark from "@/components/Mark";

const TOKEN = /\[\[(hl|ul|a):([^\]|]+)(?:\|([^\]]+))?\]\]/g;

/**
 * Turns the inline markup kept in the message files into elements:
 * `[[hl:text]]` highlights, `[[ul:text]]` underlines, `[[a:label|url]]` links out.
 */
export function richText(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let last = 0;

  for (const match of text.matchAll(TOKEN)) {
    const [whole, kind, label, href] = match;
    if (match.index > last) parts.push(text.slice(last, match.index));

    if (kind === "a") {
      parts.push(
        <a key={match.index} href={href} target="_blank" rel="noopener noreferrer">
          {label}
        </a>,
      );
    } else {
      parts.push(
        <Mark key={match.index} kind={kind === "hl" ? "highlight" : "underline"}>
          {label}
        </Mark>,
      );
    }
    last = match.index + whole.length;
  }

  if (last < text.length) parts.push(text.slice(last));
  return parts;
}
