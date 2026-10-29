const icons = {
  github:
    "M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 0-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2 0-.3-.5-1.5.2-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.5.4.9 1.1.9 2.2v3.3c0 .3.1.7.8.6A12 12 0 0 0 12 .3",
  linkedin:
    "M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.8 0 0 .77 0 1.73v20.54C0 23.23.8 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z",
  x: "M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.4l-5.8-7.58-6.64 7.58H.47l8.6-9.83L0 1.15h7.6l5.24 6.93ZM17.6 20.64h2.04L6.49 3.24H4.3Z",
  mail: "M2 4h20v16H2zM2 5l10 8 10-8",
} as const;

const links = [
  { icon: "github", label: "bpinheiroms", href: "https://github.com/bpinheiroms" },
  { icon: "linkedin", label: "bpinheiroms", href: "https://www.linkedin.com/in/bpinheiroms/" },
  { icon: "x", label: "brunopinheiroms", href: "https://x.com/brunopinheiroms" },
] as const;

/** Profile links as paper stickers, each stuck on at its own slight angle. */
export default function Stickers({ email, label }: { email?: string; label: string }) {
  return (
    <nav className="stickers" aria-label={label}>
      {links.map((link) => (
        <a key={link.icon} className="sticker" href={link.href} target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 24 24" aria-hidden="true" data-icon={link.icon}>
            <path d={icons[link.icon]} />
          </svg>
          @{link.label}
        </a>
      ))}
      {email && (
        <a className="sticker" href={`mailto:${email}`}>
          <svg viewBox="0 0 24 24" aria-hidden="true" data-icon="mail">
            <path d={icons.mail} />
          </svg>
          {email}
        </a>
      )}
    </nav>
  );
}
