"use client";

import Script from "next/script";

interface Props {
  handle: string;
}

export default function TwitterEmbed({ handle }: Props) {
  return (
    <section
      style={{
        backgroundColor: "#ffffff",
        borderTop: "1px solid #e4efed",
        padding: "36px 40px",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <h2
          style={{
            fontFamily: "var(--font-rounded), sans-serif",
            fontWeight: 700,
            fontSize: 20,
            color: "#0d1f2d",
            textAlign: "center",
            marginBottom: 6,
          }}
        >
          つぶやき
        </h2>
        <p
          style={{
            fontSize: 12,
            color: "#6b8090",
            textAlign: "center",
            marginBottom: 24,
          }}
        >
          @{handle}
        </p>

        <div
          style={{
            maxWidth: 460,
            margin: "0 auto",
            minHeight: 200,
            border: "1px solid #e4efed",
            borderRadius: 14,
            overflow: "hidden",
          }}
        >
          <a
            className="twitter-timeline"
            data-lang="ja"
            data-height="400"
            data-theme="light"
            href={`https://twitter.com/${handle}`}
          >
            Tweets by @{handle}
          </a>
        </div>
      </div>

      <Script
        src="https://platform.twitter.com/widgets.js"
        strategy="lazyOnload"
      />
    </section>
  );
}
