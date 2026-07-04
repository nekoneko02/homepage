"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import type { ContentItem, Platform } from "@/content";

const platformLabel: Record<Platform, string> = {
  zenn: "Zenn",
  note: "note",
  booth: "Booth",
  github: "GitHub",
  site: "サイト",
};

const platformBadge: Record<Platform, { bg: string; color: string }> = {
  zenn: { bg: "#0fa89b", color: "#ffffff" },
  note: { bg: "rgba(0,0,0,0.6)", color: "#ffffff" },
  booth: { bg: "#e05252", color: "#ffffff" },
  github: { bg: "#1e293b", color: "#ffffff" },
  site: { bg: "#6d28d9", color: "#ffffff" },
};

const platformEmoji: Record<Platform, string> = {
  zenn: "📝",
  note: "✏️",
  booth: "🛒",
  github: "📚",
  site: "🚀",
};

function formatDate(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

interface Props {
  items: ContentItem[];
}

export default function NewsSection({ items }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 1);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    updateScrollState();
  }, [items, updateScrollState]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "right" ? 230 : -230, behavior: "smooth" });
  };

  const newsItems = items.filter((item) => item.visibility?.includes("news"));
  if (newsItems.length === 0) return null;

  return (
    <section
      style={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e4efed",
        padding: "24px 0 20px",
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
        }}
        className="news-section-inner"
      >
        <h2
          style={{
            fontFamily: "var(--font-rounded), sans-serif",
            fontWeight: 700,
            fontSize: 14,
            color: "#0fa89b",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: 14,
          }}
        >
          NEWS
        </h2>

        <div style={{ position: "relative" }}>
          {/* Left arrow */}
          <button
            onClick={() => scroll("left")}
            aria-label="前へ"
            style={{
              position: "absolute",
              left: -16,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: "1px solid #c8e0db",
              backgroundColor: "#ffffff",
              boxShadow: "0 2px 6px rgba(0,0,0,0.10)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: canScrollLeft ? 1 : 0,
              pointerEvents: canScrollLeft ? "auto" : "none",
              transition: "opacity 0.2s",
              padding: 0,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M7.5 2L3.5 6L7.5 10" stroke="#0fa89b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Right arrow */}
          <button
            onClick={() => scroll("right")}
            aria-label="次へ"
            style={{
              position: "absolute",
              right: -16,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: "1px solid #c8e0db",
              backgroundColor: "#ffffff",
              boxShadow: "0 2px 6px rgba(0,0,0,0.10)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: canScrollRight ? 1 : 0,
              pointerEvents: canScrollRight ? "auto" : "none",
              transition: "opacity 0.2s",
              padding: 0,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M4.5 2L8.5 6L4.5 10" stroke="#0fa89b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div
            ref={scrollRef}
            onScroll={updateScrollState}
            style={{
              display: "flex",
              gap: 12,
              overflowX: "auto",
              paddingBottom: 8,
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            className="news-scroll"
          >
            {newsItems.map((item) => {
              const badge = platformBadge[item.platform];
              return (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="news-card"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    flexShrink: 0,
                    width: 210,
                    backgroundColor: "white",
                    border: "1px solid #d4e4e0",
                    borderRadius: 10,
                    overflow: "hidden",
                    textDecoration: "none",
                    color: "inherit",
                    transition: "box-shadow 0.15s, border-color 0.15s",
                  }}
                >
                  {/* Thumbnail */}
                  <div
                    style={{
                      height: 90,
                      position: "relative",
                      overflow: "hidden",
                      background: item.thumbnail
                        ? undefined
                        : "linear-gradient(135deg, #b2f0ea, #6fcfc7)",
                      flexShrink: 0,
                    }}
                  >
                    {item.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 28,
                        }}
                      >
                        {platformEmoji[item.platform]}
                      </div>
                    )}
                    <span
                      style={{
                        position: "absolute",
                        top: 7,
                        left: 7,
                        padding: "2px 7px",
                        borderRadius: 7,
                        fontSize: 9,
                        fontWeight: 700,
                        backgroundColor: badge.bg,
                        color: badge.color,
                      }}
                    >
                      {platformLabel[item.platform]}
                    </span>
                  </div>

                  {/* Content */}
                  <div style={{ padding: "10px 12px" }}>
                    <p
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#0d1f2d",
                        lineHeight: 1.5,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {item.title}
                    </p>
                    {item.newsText && (
                      <p
                        style={{
                          fontSize: 11,
                          color: "#4e6570",
                          lineHeight: 1.5,
                          marginTop: 5,
                          whiteSpace: "pre-line",
                        }}
                      >
                        {item.newsText}
                      </p>
                    )}
                    {item.publishedAt && (
                      <p
                        style={{
                          fontSize: 10,
                          color: "#9aadb6",
                          marginTop: 6,
                        }}
                      >
                        {formatDate(item.publishedAt)}
                      </p>
                    )}
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
