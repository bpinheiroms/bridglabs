import type { ReactNode } from "react";
import Mark from "@/components/Mark";

const TOKEN = /\[\[(hl|ul|a|hand|icon):([^\]|]+)(?:\|([^\]]+))?\]\]/g;

/**
 * Turns the inline markup kept in the message files into elements:
 * `[[hl:text]]` highlights, `[[ul:text]]` underlines, `[[a:label|url]]` links out,
 * `[[hand:text]]` is written by hand and `[[icon:src|text]]` is a small icon beside handwriting.
 */
export function richText(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let last = 0;

  for (const match of text.matchAll(TOKEN)) {
    const [whole, kind, label, href] = match;
    if (match.index > last) parts.push(text.slice(last, match.index));

    if (kind === "hand") {
      parts.push(
        <span key={match.index} className="hand">
          {label}
        </span>,
      );
    } else if (kind === "icon") {
      parts.push(
        <span key={match.index} className="hand hand-icon">
          <img src={label} alt="" width={20} height={20} />
          {href}
        </span>,
      );
    } else if (kind === "a") {
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
