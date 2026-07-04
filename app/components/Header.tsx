import type { Profile } from "@/data/profile";

const navLinks = [
  {
    key: "zenn" as const,
    label: "Zenn",
    bg: "#e5f7f5",
    color: "#0fa89b",
  },
  { key: "note" as const, label: "note", bg: "#f2f2f2", color: "#444444" },
  {
    key: "booth" as const,
    label: "Booth",
    bg: "#fde8e8",
    color: "#e05252",
  },
  {
    key: "github" as const,
    label: "GitHub",
    bg: "#f0f0f0",
    color: "#555555",
  },
  {
    key: "twitter" as const,
    label: "Twitter",
    bg: "#e8f4ff",
    color: "#1a8cdf",
  },
];

interface Props {
  links: Profile["links"];
}

export default function Header({ links }: Props) {
  return (
    <header
      className="site-header"
      style={{
        height: 62,
        backgroundColor: "#ffffff",
        borderBottom: "1.5px solid #e4efed",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100,
        gap: 12,
      }}
    >
      <a
        href="/"
        style={{
          fontFamily: "var(--font-rounded), sans-serif",
          fontWeight: 800,
          fontSize: 18,
          color: "#0fa89b",
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          gap: 6,
          flexShrink: 0,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icon.png" alt="" style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover" }} />
        ねこエンジニア
      </a>

      <nav
        className="header-nav"
        style={{ display: "flex", gap: 6, overflowX: "auto", scrollbarWidth: "none" }}
      >
        {navLinks.map(({ key, label, bg, color }) => (
          <a
            key={key}
            href={links[key]}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "5px 10px",
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 600,
              backgroundColor: bg,
              color,
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            {label}
          </a>
        ))}
      </nav>

    </header>
  );
}
