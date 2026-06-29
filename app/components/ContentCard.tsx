import type { ContentItem, Domain, Platform } from "@/content";

const platformLabel: Record<Platform, string> = {
  zenn: "Zenn",
  note: "note",
  booth: "Booth",
  github: "GitHub",
  product: "Product",
};

const platformBadge: Record<Platform, { bg: string; color: string }> = {
  zenn: { bg: "#0fa89b", color: "#ffffff" },
  note: { bg: "rgba(0,0,0,0.6)", color: "#ffffff" },
  booth: { bg: "#e05252", color: "#ffffff" },
  github: { bg: "#1e293b", color: "#ffffff" },
  product: { bg: "#6d28d9", color: "#ffffff" },
};

const domainTag: Record<Domain, { bg: string; color: string }> = {
  IT: { bg: "#dbeafe", color: "#1d4ed8" },
  数学: { bg: "#dcfce7", color: "#15803d" },
  ボルダリング: { bg: "#ffedd5", color: "#c2410c" },
  プロダクト: { bg: "#ede9fe", color: "#6d28d9" },
  ブログ: { bg: "#fce7f3", color: "#9d174d" },
  本: { bg: "#fef9c3", color: "#854d0e" },
};

const thumbnailGradient = (platform: Platform, domains: Domain[]): string => {
  if (platform === "booth") return "linear-gradient(135deg, #ffd6d6, #ffa0a0)";
  if (platform === "github") return "linear-gradient(135deg, #dce8ff, #aec4f0)";
  if (platform === "product") return "linear-gradient(135deg, #ede9fe, #c0b0f0)";
  if (domains.includes("ボルダリング")) return "linear-gradient(135deg, #ffe0c4, #ffbc8a)";
  if (domains.includes("数学")) return "linear-gradient(135deg, #e4deff, #c0b0f0)";
  return "linear-gradient(135deg, #b2f0ea, #6fcfc7)";
};

const platformEmoji: Record<Platform, string> = {
  zenn: "📝",
  note: "✏️",
  booth: "🛒",
  github: "📚",
  product: "🚀",
};

function formatDate(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

interface Props {
  item: ContentItem;
}

export default function ContentCard({ item }: Props) {
  const badge = platformBadge[item.platform];
  const gradient = thumbnailGradient(item.platform, item.category.domain);

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "block",
        backgroundColor: "white",
        border: "1px solid #d4e4e0",
        borderRadius: 10,
        overflow: "hidden",
        textDecoration: "none",
        color: "inherit",
        transition: "box-shadow 0.15s, border-color 0.15s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.borderColor =
          "rgba(15,168,155,0.5)";
        (e.currentTarget as HTMLAnchorElement).style.boxShadow =
          "0 4px 16px rgba(15,168,155,0.12)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.borderColor = "#d4e4e0";
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
      }}
    >
      {/* Thumbnail */}
      <div
        style={{
          height: 124,
          background: item.thumbnail ? undefined : gradient,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {item.thumbnail ? (
          <img
            src={item.thumbnail}
            alt={item.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
            }}
          >
            {platformEmoji[item.platform]}
          </div>
        )}

        {/* Platform badge */}
        <span
          style={{
            position: "absolute",
            top: 9,
            left: 9,
            padding: "2px 8px",
            borderRadius: 8,
            fontSize: 10,
            fontWeight: 700,
            backgroundColor: badge.bg,
            color: badge.color,
          }}
        >
          {platformLabel[item.platform]}
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: "12px 14px" }}>
        {/* Category tags */}
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {item.category.domain.map((d) => {
            const tag = domainTag[d];
            return (
              <span
                key={d}
                style={{
                  padding: "2px 7px",
                  borderRadius: 5,
                  fontSize: 10,
                  fontWeight: 600,
                  backgroundColor: tag.bg,
                  color: tag.color,
                }}
              >
                {d}
              </span>
            );
          })}
        </div>

        {/* Title */}
        <p
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#0d1f2d",
            lineHeight: 1.5,
            marginTop: 7,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {item.title}
        </p>

        {/* Excerpt */}
        {item.excerpt && (
          <p
            style={{
              fontSize: 11,
              color: "#6b8090",
              lineHeight: 1.5,
              marginTop: 4,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {item.excerpt}
          </p>
        )}

        {/* Date */}
        {item.publishedAt && (
          <p style={{ fontSize: 11, color: "#9aadb6", marginTop: 6 }}>
            {formatDate(item.publishedAt)}
          </p>
        )}
      </div>
    </a>
  );
}
