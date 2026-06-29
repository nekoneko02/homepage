"use client";

import { useState, useEffect } from "react";
import ContentCard from "./ContentCard";
import type { ContentItem, Domain, Platform } from "@/content";

type DomainFilter = Domain | "すべて";
type PlatformFilter = Platform | "すべて";

const domainOptions: DomainFilter[] = [
  "すべて",
  "IT",
  "数学",
  "ボルダリング",
  "プロダクト",
  "ブログ",
  "本",
];
const platformOptions: { value: PlatformFilter; label: string }[] = [
  { value: "すべて", label: "すべて" },
  { value: "zenn", label: "Zenn" },
  { value: "note", label: "note" },
  { value: "booth", label: "Booth" },
  { value: "github", label: "GitHub" },
];

interface Props {
  items: ContentItem[];
}

export default function ContentSection({ items }: Props) {
  const [domain, setDomain] = useState<DomainFilter>("すべて");
  const [platform, setPlatform] = useState<PlatformFilter>("すべて");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const d = params.get("domain") as DomainFilter;
    const p = params.get("platform") as PlatformFilter;
    if (d && (domainOptions as string[]).includes(d)) setDomain(d);
    if (p && platformOptions.some((o) => o.value === p)) setPlatform(p);
  }, []);

  const filtered = items.filter((item) => {
    const domainMatch = domain === "すべて" || item.category.domain.includes(domain);
    const platformMatch = platform === "すべて" || item.platform === platform;
    return domainMatch && platformMatch;
  });

  function setFilter(key: "domain" | "platform", value: string) {
    if (key === "domain") setDomain(value as DomainFilter);
    if (key === "platform") setPlatform(value as PlatformFilter);
    const params = new URLSearchParams(window.location.search);
    if (value === "すべて") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    const qs = params.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }

  const chipBase: React.CSSProperties = {
    padding: "5px 14px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 400,
    backgroundColor: "white",
    color: "#5a6a7a",
    border: "1px solid #cce0dc",
    cursor: "pointer",
    transition: "background 0.1s",
  };

  const chipActive: React.CSSProperties = {
    ...chipBase,
    backgroundColor: "#0fa89b",
    color: "white",
    fontWeight: 600,
    border: "1px solid #0fa89b",
  };

  const chipSmallBase: React.CSSProperties = {
    ...chipBase,
    padding: "4px 12px",
    fontSize: 11,
  };

  const chipSmallActive: React.CSSProperties = {
    ...chipActive,
    padding: "4px 12px",
    fontSize: 11,
  };

  return (
    <section style={{ backgroundColor: "#f4f9f8", padding: "36px 40px 44px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {/* Section header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-rounded), sans-serif",
              fontWeight: 700,
              fontSize: 20,
              color: "#0d1f2d",
            }}
          >
            コンテンツ一覧
          </h2>
          <span style={{ fontSize: 12, color: "#7a909a" }}>
            全 {filtered.length} 件
          </span>
        </div>

        {/* Filter bar */}
        <div style={{ marginBottom: 28 }}>
          {/* Domain filter */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              marginBottom: 10,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{ fontSize: 11, color: "#7a8e98", fontWeight: 500, minWidth: 32 }}
            >
              領域
            </span>
            {domainOptions.map((d) => (
              <button
                key={d}
                onClick={() => setFilter("domain", d)}
                style={domain === d ? chipActive : chipBase}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Platform filter */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{ fontSize: 11, color: "#7a8e98", fontWeight: 500, minWidth: 32 }}
            >
              PF
            </span>
            {platformOptions.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setFilter("platform", value)}
                style={platform === value ? chipSmallActive : chipSmallBase}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Card grid */}
        {filtered.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 0",
              color: "#9aadb6",
              fontSize: 14,
            }}
          >
            該当するコンテンツがありません
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 14,
            }}
            className="content-grid"
          >
            {filtered.map((item) => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 1023px) {
          .content-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 639px) {
          .content-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
