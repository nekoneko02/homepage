import type { Profile } from "@/data/profile";

const footerLinks = [
  { key: "zenn" as const, label: "Zenn" },
  { key: "note" as const, label: "note" },
  { key: "booth" as const, label: "Booth" },
  { key: "github" as const, label: "GitHub" },
  { key: "twitter" as const, label: "Twitter" },
];

interface Props {
  links: Profile["links"];
}

export default function Footer({ links }: Props) {
  return (
    <footer
      style={{
        backgroundColor: "#0c1e2a",
        padding: "26px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 12,
      }}
    >
      <div>
        <p
          style={{
            fontFamily: "var(--font-rounded), sans-serif",
            fontWeight: 700,
            fontSize: 15,
            color: "white",
            marginBottom: 4,
          }}
        >
          🐱 ねこエンジニア
        </p>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.38)" }}>
          © {new Date().getFullYear()} ねこエンジニア
        </p>
      </div>

      <nav style={{ display: "flex", gap: 16 }}>
        {footerLinks.map(({ key, label }) => (
          <a
            key={key}
            href={links[key]}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.55)",
              textDecoration: "none",
            }}
          >
            {label}
          </a>
        ))}
      </nav>
    </footer>
  );
}
