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
      className="site-footer"
      style={{
        backgroundColor: "#0c1e2a",
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon.png" alt="" style={{ width: 24, height: 24, borderRadius: "50%", objectFit: "cover", verticalAlign: "middle", marginRight: 6 }} />
          ねこエンジニア
        </p>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.38)" }}>
          © {new Date().getFullYear()} ねこエンジニア
        </p>
      </div>

      <nav style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
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
