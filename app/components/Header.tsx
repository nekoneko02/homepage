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
      style={{
        height: 62,
        backgroundColor: "#ffffff",
        borderBottom: "1.5px solid #e4efed",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 40px",
        position: "sticky",
        top: 0,
        zIndex: 100,
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
        }}
      >
        🐱 ねこエンジニア
      </a>

      <nav style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {navLinks.map(({ key, label, bg, color }) => (
          <a
            key={key}
            href={links[key]}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "5px 12px",
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 600,
              backgroundColor: bg,
              color,
              textDecoration: "none",
            }}
          >
            {label}
          </a>
        ))}
      </nav>
    </header>
  );
}
