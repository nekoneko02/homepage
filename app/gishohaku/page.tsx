import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import booth from "@/data/booth.json";
import { profile } from "@/data/profile";

interface BoothEntry {
  title: string;
  url: string;
  excerpt?: string;
  thumbnail?: string;
  price?: string;
  newsText?: string;
}

const book = (booth as BoothEntry[])[0];
const FREE_SAMPLE_URL = "https://neko-engineer.booth.pm/items/8729314";

// 技書博で初めて本書に出会う人向けの新刊訴求文。Booth商品ページの本文から抜粋。
// data/booth.jsonのnewsText（ホームNEWS欄向け、既存読者への「改訂」告知）とは
// 意図的に分けている。
const gishohakuBadgeText =
  "🎉 技書博 新刊\n" +
  "「このままで良いのだろうか…？」——当時、筆者が感じていた不安です。" +
  "自分の軸を見つけ、個人開発という実験場でそれを磨いていく「自分の軸駆動個人開発」を、" +
  "半年間の実践記録（付録・約19,000字）とともに一冊にまとめました。";

// 無料版本文（サンプル）のHTML。生成元は scripts/build-gishohaku-sample.mjs を参照。
const sampleHtml = fs.readFileSync(
  path.join(process.cwd(), "content-cache", "gishohaku-sample.html"),
  "utf-8"
);

export const metadata: Metadata = {
  title: "技書博限定ページ | ねこエンジニア",
  description: `技書博で「${profile.name}」のパンフレットを手に取ってくれた方へ。同人誌「${book.title}」の紹介とBooth購入リンクです。`,
  openGraph: {
    title: "技書博限定ページ | ねこエンジニア",
    description: `同人誌「${book.title}」のご紹介`,
    images: book.thumbnail ? [book.thumbnail] : undefined,
  },
};

export default function GishohakuPage() {
  return (
    <main className="gishohaku-page">
      <section
        className="gishohaku-hero"
        style={{
          background:
            "linear-gradient(140deg, #d4f4ee 0%, #e8fffe 55%, #f4fffd 100%)",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          className="gishohaku-inner"
          style={{
            maxWidth: 760,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            gap: 40,
            width: "100%",
          }}
        >
          {/* 表紙 */}
          <div
            className="gishohaku-cover"
            style={{
              flexShrink: 0,
              width: 220,
              borderRadius: 10,
              overflow: "hidden",
              boxShadow: "0 10px 40px rgba(15,168,155,0.25)",
              border: "1px solid rgba(15,168,155,0.20)",
            }}
          >
            {book.thumbnail ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={book.thumbnail}
                alt={book.title}
                style={{ width: "100%", display: "block" }}
              />
            ) : null}
          </div>

          {/* 本文情報 */}
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "inline-block",
                background: "rgba(15,168,155,0.12)",
                color: "#0c8a80",
                padding: "5px 14px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
                marginBottom: 16,
              }}
            >
              🎪 技書博にお越しの方へ
            </div>

            <h1
              className="gishohaku-title"
              style={{
                fontFamily: "var(--font-rounded), sans-serif",
                fontWeight: 800,
                color: "#0d1f2d",
                lineHeight: 1.5,
                marginBottom: 14,
              }}
            >
              {book.title}
            </h1>

            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#c2410c",
                backgroundColor: "#ffedd5",
                borderRadius: 8,
                padding: "8px 12px",
                marginBottom: 16,
                whiteSpace: "pre-line",
                lineHeight: 1.6,
              }}
            >
              {gishohakuBadgeText}
            </div>

            {book.excerpt && (
              <p
                style={{
                  fontSize: 14,
                  color: "#4e6570",
                  lineHeight: 1.8,
                  marginBottom: 22,
                }}
              >
                {book.excerpt}
              </p>
            )}

            <div
              className="gishohaku-cta"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              {book.price && (
                <span
                  style={{
                    fontFamily: "var(--font-rounded), sans-serif",
                    fontWeight: 800,
                    fontSize: 22,
                    color: "#0d1f2d",
                  }}
                >
                  {book.price}
                </span>
              )}
              <a
                href={book.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: "12px 28px",
                  borderRadius: 24,
                  fontSize: 14,
                  fontWeight: 700,
                  backgroundColor: "#0fa89b",
                  color: "white",
                  textDecoration: "none",
                }}
              >
                🛒 Boothで購入する
              </a>
            </div>

            <p style={{ fontSize: 12, color: "#7a909a", marginTop: 24 }}>
              🐾 {profile.tagPill} の{profile.name}が書きました
            </p>
          </div>
        </div>
      </section>

      <section id="sample" className="gishohaku-sample">
        <div className="gishohaku-sample-inner">
          <h2 className="gishohaku-sample-heading">無料版を今すぐ読む</h2>
          <p className="gishohaku-sample-note">
            立ち読み感覚でどうぞ。序章〜2章＋付録の一部を掲載しています。
            <br />
            <a
              href={FREE_SAMPLE_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#0fa89b", fontWeight: 600, textDecoration: "underline" }}
            >
              Boothから無料版PDFのダウンロードも可能です
            </a>
          </p>
          <div
            className="gishohaku-sample-content"
            dangerouslySetInnerHTML={{ __html: sampleHtml }}
          />
        </div>
      </section>

      <section
        className="gishohaku-back"
        style={{
          textAlign: "center",
          padding: "28px 16px 40px",
        }}
      >
        <p style={{ fontSize: 13, color: "#6b8090", marginBottom: 10 }}>
          ねこエンジニアの他のコンテンツも見る
        </p>
        <a
          href="/"
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#0fa89b",
            textDecoration: "none",
          }}
        >
          ホームへ →
        </a>
      </section>
    </main>
  );
}
