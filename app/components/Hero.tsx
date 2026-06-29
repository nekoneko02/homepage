import type { Profile } from "@/data/profile";

const domainBadges = [
  { label: "💻 IT", bg: "#dbeafe", color: "#1d4ed8" },
  { label: "📐 数学", bg: "#dcfce7", color: "#15803d" },
  { label: "🧗 ボルダリング", bg: "#ffedd5", color: "#c2410c" },
  { label: "🚀 プロダクト", bg: "#ede9fe", color: "#6d28d9" },
];

interface Props {
  profile: Profile;
}

export default function Hero({ profile }: Props) {
  return (
    <section
      style={{
        background: "linear-gradient(140deg, #d4f4ee 0%, #e8fffe 55%, #f4fffd 100%)",
        padding: "52px 40px 56px",
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          gap: 40,
        }}
      >
        {/* 左カラム */}
        <div style={{ flex: 1 }}>
          {/* Tag pill */}
          <div
            style={{
              display: "inline-block",
              background: "rgba(15,168,155,0.12)",
              color: "#0c8a80",
              padding: "5px 14px",
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 18,
            }}
          >
            🐾 {profile.tagPill}
          </div>

          {/* H1 */}
          <h1
            style={{
              fontFamily: "var(--font-rounded), sans-serif",
              fontWeight: 800,
              fontSize: 36,
              color: "#0d1f2d",
              lineHeight: 1.4,
              letterSpacing: "-0.01em",
              marginBottom: 14,
              whiteSpace: "pre-line",
            }}
          >
            {profile.headline}
          </h1>

          {/* Bio */}
          <p
            style={{
              fontSize: 14,
              color: "#4e6570",
              lineHeight: 1.8,
              maxWidth: 380,
              marginBottom: 22,
            }}
          >
            {profile.bio}
          </p>

          {/* Domain badges */}
          <div
            style={{
              display: "flex",
              gap: 7,
              flexWrap: "wrap",
              marginBottom: 24,
            }}
          >
            {domainBadges.map(({ label, bg, color }) => (
              <span
                key={label}
                style={{
                  padding: "4px 12px",
                  borderRadius: 14,
                  fontSize: 11,
                  fontWeight: 600,
                  backgroundColor: bg,
                  color,
                }}
              >
                {label}
              </span>
            ))}
          </div>

          {/* CTA buttons */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a
              href={profile.links.zenn}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "10px 22px",
                borderRadius: 24,
                fontSize: 13,
                fontWeight: 600,
                backgroundColor: "#0fa89b",
                color: "white",
                textDecoration: "none",
                transition: "background 0.15s",
              }}
            >
              📝 Zennを読む
            </a>
            <a
              href={profile.links.booth}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "10px 22px",
                borderRadius: 24,
                fontSize: 13,
                fontWeight: 600,
                backgroundColor: "rgba(255,255,255,0.85)",
                color: "#0d1f2d",
                border: "1.5px solid rgba(15,168,155,0.30)",
                textDecoration: "none",
              }}
            >
              🛒 同人誌を見る
            </a>
          </div>
        </div>

        {/* 右カラム（アバター） */}
        <div
          style={{
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 164,
              height: 164,
              borderRadius: "50%",
              backgroundColor: "#ffffff",
              border: "3px solid rgba(15,168,155,0.18)",
              boxShadow: "0 6px 32px rgba(15,168,155,0.20)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 72,
            }}
          >
            🐱
          </div>
          <p
            style={{
              fontFamily: "var(--font-rounded), sans-serif",
              fontWeight: 700,
              fontSize: 15,
              color: "#0d1f2d",
            }}
          >
            {profile.name}
          </p>
          <p style={{ fontSize: 12, color: "#6b8090" }}>{profile.handle}</p>
        </div>
      </div>
    </section>
  );
}
