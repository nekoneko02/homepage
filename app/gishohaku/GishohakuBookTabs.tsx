"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    MathJax?: {
      typesetPromise?: (elements?: HTMLElement[]) => Promise<void>;
      startup?: { promise?: Promise<void> };
    };
  }
}

const MATHJAX_SRC =
  "https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.2/es5/tex-svg.min.js";
let mathJaxLoadPromise: Promise<void> | null = null;

// 本文中の数式は @vivliostyle/vfm が MathJax のTeXデリミタ（\( \) / $$ $$）で
// 出力している（scripts/build-gishohaku-sample.mjs）。印刷用PDFはVivliostyle経由で
// MathJaxが描画するが、Web版は素のHTMLとして埋め込むだけなので、ここで
// MathJaxを読み込んでクライアント側でタイプセットする。
function loadMathJax(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.MathJax?.typesetPromise) return Promise.resolve();
  if (mathJaxLoadPromise) return mathJaxLoadPromise;

  (window as unknown as { MathJax: Record<string, unknown> }).MathJax = {
    tex: {
      inlineMath: [["\\(", "\\)"]],
      displayMath: [["$$", "$$"]],
    },
    svg: { fontCache: "global" },
  };

  mathJaxLoadPromise = new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = MATHJAX_SRC;
    script.async = true;
    script.onload = () => {
      window.MathJax?.startup?.promise?.then(resolve) ?? resolve();
    };
    document.head.appendChild(script);
  });
  return mathJaxLoadPromise;
}

export interface GishohakuBookTab {
  id: string;
  /** タブボタンに表示するラベル */
  label: string;
  /** タブ選択時に見出しの下に表示する説明文 */
  note: React.ReactNode;
  /**
   * 本文HTML（build-gishohaku-sample.mjs 生成）を埋め込む場合に指定。
   * 省略時は外部リンク導線（例: Zenn）のみのタブになる。
   */
  sampleHtml?: string;
  /** 本文の代わり、または前後に表示する追加コンテンツ（外部リンクボタンなど） */
  extra?: React.ReactNode;
}

interface Props {
  tabs: GishohakuBookTab[];
}

export default function GishohakuBookTabs({ tabs }: Props) {
  const [activeId, setActiveId] = useState(tabs[0]?.id);
  const active = tabs.find((t) => t.id === activeId) ?? tabs[0];
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active?.sampleHtml?.includes("data-math-typeset")) return;
    let cancelled = false;
    loadMathJax().then(() => {
      if (!cancelled && contentRef.current) {
        window.MathJax?.typesetPromise?.([contentRef.current]);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [active]);

  return (
    <>
      <div
        className="gishohaku-tab-bar"
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          marginBottom: 24,
        }}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === active?.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveId(tab.id)}
              style={{
                padding: "8px 18px",
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                border: isActive ? "1px solid #0fa89b" : "1px solid #cce0dc",
                backgroundColor: isActive ? "#0fa89b" : "white",
                color: isActive ? "white" : "#5a6a7a",
                transition: "background 0.1s",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {active && (
        <div className="gishohaku-tab-panel">
          <p className="gishohaku-sample-note">{active.note}</p>
          {active.extra}
          {active.sampleHtml && (
            <div
              ref={contentRef}
              className="gishohaku-sample-content"
              dangerouslySetInnerHTML={{ __html: active.sampleHtml }}
            />
          )}
        </div>
      )}
    </>
  );
}
