# Handoff: ねこエンジニア ホームページ

## Overview

「ねこエンジニア」のパーソナルハブホームページのデザイン仕様書です。
Zenn・note・Booth・GitHub・Twitter に分散したコンテンツを横断的にたどれるハブページを、**Next.js (App Router) + AWS Amplify Hosting + SSG** で実装します。

## About the Design Files

`design_reference/ねこエンジニア Homepage.dc.html` はブラウザで直接開けるHTMLデザイン参照ファイルです。
キャンバス上に3バリエーションが並んでいますが、**採用するのは左端の「Variation A — ミント × ミニマル」のみ**です。
このファイルはデザインの見た目・間隔・色を確認するための参照用途であり、プロダクションコードとして流用するものではありません。
実装は既存の Next.js + Tailwind CSS の構成に沿って、このデザインを忠実に再現してください。

## Fidelity

**High-fidelity（ハイファイ）** — 色・タイポグラフィ・余白・コンポーネント構造を参照ファイル通りに実装してください。

---

## Screen / View

### トップページ（単一ページ構成）

URL: `/`  
単一スクロールページ。セクション順：Header → Hero → コンテンツ一覧（フィルター付き）→ Twitter埋め込み → Footer

---

## Design Tokens

### Colors

| Token | Hex | 用途 |
|---|---|---|
| `primary` | `#0fa89b` | アクセント全般、アクティブフィルター、プライマリボタン |
| `primary-dark` | `#0c8a80` | ホバー時など |
| `primary-light` | `#e5f7f5` | Zennバッジ背景、nav pill背景 |
| `hero-bg-start` | `#d4f4ee` | ヒーロー背景グラデーション開始 |
| `hero-bg-mid` | `#e8fffe` | ヒーロー背景グラデーション中間 |
| `hero-bg-end` | `#f4fffd` | ヒーロー背景グラデーション終端 |
| `section-alt` | `#f4f9f8` | コンテンツセクション背景 |
| `border-light` | `#e4efed` | ヘッダー下線、セクション区切り |
| `border-card` | `#d4e4e0` | カード枠線 |
| `border-filter` | `#cce0dc` | 非アクティブフィルターチップ枠線 |
| `text-primary` | `#0d1f2d` | 見出し、本文 |
| `text-secondary` | `#4e6570` | サブテキスト |
| `text-muted` | `#6b8090` | カード説明文 |
| `text-faint` | `#9aadb6` | 日付、補足情報 |
| `footer-bg` | `#0c1e2a` | フッター背景 |
| `white` | `#ffffff` | カード背景、ページ背景 |

#### カテゴリタグ色（全セクション共通）

| ドメイン | 背景色 | テキスト色 |
|---|---|---|
| IT | `#dbeafe` | `#1d4ed8` |
| 数学 | `#dcfce7` | `#15803d` |
| ボルダリング | `#ffedd5` | `#c2410c` |
| プロダクト | `#ede9fe` | `#6d28d9` |
| 本 | `#f3f4f6` | `#374151` |

#### プラットフォームバッジ色（カードサムネイル上）

| プラットフォーム | 背景色 | テキスト色 |
|---|---|---|
| Zenn | `#0fa89b` | `#ffffff` |
| note | `rgba(0,0,0,0.6)` | `#ffffff` |
| Booth | `#e05252` | `#ffffff` |
| GitHub | `#1e293b` | `#ffffff` |

### Typography

| 用途 | フォント | サイズ | 太さ | その他 |
|---|---|---|---|---|
| ロゴ・見出し全般 | M PLUS Rounded 1c | — | 700 / 800 | Google Fonts |
| 本文全般 | Noto Sans JP | — | 400 / 500 / 600 | Google Fonts |
| ロゴテキスト | M PLUS Rounded 1c | 18px | 800 | color: `#0fa89b` |
| H1（ヒーロー） | M PLUS Rounded 1c | 36px | 800 | line-height: 1.4, letter-spacing: -0.01em |
| H2（セクション見出し） | M PLUS Rounded 1c | 20px | 700 | |
| ヒーロー本文 | Noto Sans JP | 14px | 400 | line-height: 1.8 |
| navリンク | Noto Sans JP | 11px | 600 | |
| ドメインバッジ（ヒーロー） | Noto Sans JP | 11px | 600 | |
| フィルターチップ | Noto Sans JP | 12px (領域) / 11px (プラットフォーム) | 600 (active) / 400 (inactive) | |
| カードタイトル | Noto Sans JP | 13px | 600 | line-height: 1.5 |
| カード説明文 | Noto Sans JP | 11px | 400 | line-height: 1.5 |
| 日付 | Noto Sans JP | 11px | 400 | |
| フッターリンク | Noto Sans JP | 12px | 400 | |

### Spacing

| 箇所 | 値 |
|---|---|
| ヘッダー高さ | 62px |
| ヘッダー水平パディング | 40px |
| ヒーローパディング | 52px (上) / 40px (左右) / 56px (下) |
| ヒーロー左右コンテンツ gap | 40px |
| コンテンツセクションパディング | 36px (上) / 40px (左右) / 44px (下) |
| Twitterセクションパディング | 36px (上下) / 40px (左右) |
| フッターパディング | 26px (上下) / 40px (左右) |
| カードグリッド gap | 14px |
| カード内パディング | 12px (上下) / 14px (左右) |

### Border Radius

| 要素 | 値 |
|---|---|
| ページコンテナ全体 | 4px（Amplify/ブラウザ上では不要） |
| カード | 10px |
| フィルターチップ | 20px |
| カテゴリタグ（小） | 5px |
| プラットフォームバッジ（カード上） | 8px |
| ドメインバッジ（ヒーロー） | 14px |
| ヒーロー tag pill | 20px |
| CTAボタン | 24px |
| アバター | 50% |
| Twitterウィジェット枠 | 14px |

### Shadows

| 要素 | Shadow |
|---|---|
| アバター | `0 6px 32px rgba(15,168,155,0.20)` |

---

## Components

### 1. Header

```
[🐱 ねこエンジニア]                    [Zenn] [note] [Booth] [GitHub] [Twitter]
```

- **高さ**: 62px
- **レイアウト**: `display:flex; justify-content:space-between; align-items:center`
- **背景**: `#ffffff`
- **下線**: `1.5px solid #e4efed`
- **水平パディング**: 40px
- **スクロール追従**: MVP では固定なしでも可（任意）

**ロゴ**
- 🐱 emoji (21px) + テキスト "ねこエンジニア"
- フォント: M PLUS Rounded 1c 800, 18px, color `#0fa89b`
- クリック → ページトップへ（`#top` or `href="/"`)

**ナビゲーション（各プラットフォームへの外部リンク）**

| テキスト | 背景 | テキスト色 | リンク先 |
|---|---|---|---|
| Zenn | `#e5f7f5` | `#0fa89b` | https://zenn.dev/nekoneko02 |
| note | `#f2f2f2` | `#444444` | https://note.com/nekoneko02 |
| Booth | `#fde8e8` | `#e05252` | https://nekoneko02.booth.pm |
| GitHub | `#f0f0f0` | `#555555` | https://github.com/nekoneko02 |
| Twitter | `#e8f4ff` | `#1a8cdf` | https://twitter.com/neko_engineer_ |

- Pill スタイル: `padding: 5px 12px; border-radius: 20px; font-size: 11px; font-weight: 600`
- 全リンク: `target="_blank" rel="noopener noreferrer"`

---

### 2. Hero Section

```
[🐾 エンジニア × 数学 × ボルダリング  ← pill tag]

ITと数学と                               [🐱]
ボルダリングが                         ねこエンジニア
好きなエンジニア                       @neko_engineer_

Zenn・note・同人誌・個人プロダクトで…

[💻 IT] [📐 数学] [🧗 ボルダリング] [🚀 プロダクト]

[📝 Zennを読む]  [🛒 同人誌を見る]
```

- **背景**: `linear-gradient(140deg, #d4f4ee 0%, #e8fffe 55%, #f4fffd 100%)`
- **パディング**: 52px top / 40px LR / 56px bottom
- **レイアウト**: `display:flex; align-items:center; gap:40px`

**左カラム (flex: 1)**

1. **Tag Pill**
   - `🐾 エンジニア × 数学 × ボルダリング`
   - 背景: `rgba(15,168,155,0.12)`, テキスト: `#0c8a80`
   - padding: 5px 14px, border-radius: 20px, font-size: 12px, font-weight: 600
   - margin-bottom: 18px

2. **H1** — "ITと数学と\nボルダリングが\n好きなエンジニア"
   - M PLUS Rounded 1c 800, 36px, color `#0d1f2d`, line-height 1.4, letter-spacing -0.01em
   - margin-bottom: 14px

3. **サブテキスト**
   - "Zenn・note・同人誌・個人プロダクトで情報発信中。技術から趣味まで気になることを書いています。"
   - Noto Sans JP 400, 14px, color `#4e6570`, line-height 1.8
   - max-width: 380px, margin-bottom: 22px

4. **ドメインバッジ** (flex row, gap: 7px, margin-bottom: 24px)
   - `💻 IT` / `📐 数学` / `🧗 ボルダリング` / `🚀 プロダクト`
   - padding: 4px 12px, border-radius: 14px, font-size: 11px, font-weight: 600
   - 色は上述の「カテゴリタグ色」と同一

5. **CTAボタン** (flex row, gap: 12px)
   - Primary: "📝 Zennを読む" — bg `#0fa89b`, color white, padding 10px 22px, border-radius 24px, font 13px 600
   - Secondary: "🛒 同人誌を見る" — bg `rgba(255,255,255,0.85)`, color `#0d1f2d`, border `1.5px solid rgba(15,168,155,0.30)`, 同padding

**右カラム (flex-shrink: 0)**

- **アバター円**: 164×164px, border-radius 50%, bg `#ffffff`
- 中央に 🐱 emoji (72px)
- border: `3px solid rgba(15,168,155,0.18)`
- box-shadow: `0 6px 32px rgba(15,168,155,0.20)`
- 下に名前 "ねこエンジニア"（M PLUS Rounded 1c 700, 15px, `#0d1f2d`）
- ハンドル "@neko_engineer_"（Noto Sans JP 400, 12px, `#6b8090`）
- アバター画像は `data/profile` 設定から取得。未設定時は 🐱 emoji をプレースホルダーとする

---

### 3. コンテンツ一覧セクション

- **背景**: `#f4f9f8`
- **パディング**: 36px top / 40px LR / 44px bottom

#### セクションヘッダー
- "コンテンツ一覧" (H2: M PLUS Rounded 1c 700, 20px, `#0d1f2d`) と 件数 ("全 N 件", 12px, `#7a909a`) を flex で左右配置

#### フィルターバー（2行）

**行1 — 領域フィルター**

ラベル "領域"（11px, `#7a8e98`, font-weight 500） + チップ群（flex row, gap 7px）

- チップ: "すべて" / "IT" / "数学" / "ボルダリング" / "プロダクト"
- **アクティブ**: bg `#0fa89b`, color `white`, font-weight 600, padding 5px 14px, border-radius 20px, font-size 12px
- **非アクティブ**: bg `white`, color `#5a6a7a`, border `1px solid #cce0dc`, 同 padding / radius

**行2 — プラットフォームフィルター**（margin-bottom: 28px）

ラベル "プラットフォーム"（11px, `#7a8e98`, font-weight 500） + チップ群

- チップ: "Zenn" / "note" / "Booth" / "GitHub"
- **アクティブ**: bg `#0fa89b`, color `white`, font-weight 600, padding 4px 12px, border-radius 20px, font-size 11px
- **非アクティブ**: bg `white`, color `#5a6a7a`, border `1px solid #cce0dc`, 同 padding / radius

**フィルター挙動**
- 各軸内は単一選択（選択済みをクリックで "すべて" に戻す）
- 軸間は AND 条件
- URL クエリ反映: `?domain=IT&platform=zenn`（ページリロードでも状態を保持）
- 0件の場合: "該当するコンテンツがありません" を中央表示
- クライアントサイドで全件 JSON を保持してフィルタリング（追加フェッチ不要）

#### カードグリッド

- `display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px`
- レスポンシブ: モバイル 1列 / タブレット 2列 / デスクトップ 3列
- 新しい順（`publishedAt` 降順）。日付不明は末尾

#### コンテンツカード

```
┌────────────────────────┐
│ [サムネイル 124px]      │  ← グラデーション背景 + emoji + プラットフォームバッジ
├────────────────────────┤
│ [カテゴリタグ]          │
│ カードタイトルテキスト   │
│ 説明文（1〜2行）         │
│ 2024.01.15             │
└────────────────────────┘
```

- bg: `white`, border: `1px solid #d4e4e0`, border-radius: 10px, overflow: hidden
- クリック → 元プラットフォームへ別タブで遷移（`target="_blank" rel="noopener noreferrer"`）

**サムネイル領域** (height: 124px)
- 各プラットフォーム／ドメインに対応したグラデーション背景
- 中央に代表emoji (40px)
- 左上にプラットフォームバッジ (top: 9px, left: 9px, padding: 2px 8px, border-radius: 8px, font-size: 10px, font-weight: 700)
- サムネイル画像がある場合は `next/image` で表示。ない場合は上記プレースホルダー

サムネイル背景グラデーション（暫定プレースホルダー）：

| コンテキスト | グラデーション |
|---|---|
| Zenn / IT | `linear-gradient(135deg, #b2f0ea, #6fcfc7)` |
| note / ボルダリング | `linear-gradient(135deg, #ffe0c4, #ffbc8a)` |
| note / 数学 | `linear-gradient(135deg, #e4deff, #c0b0f0)` |
| Booth | `linear-gradient(135deg, #ffd6d6, #ffa0a0)` |
| GitHub | `linear-gradient(135deg, #dce8ff, #aec4f0)` |

**コンテンツ領域** (padding: 12px 14px)
- カテゴリタグ（色は Design Tokens 参照）
- タイトル: 13px, font-weight 600, color `#0d1f2d`, line-height 1.5, margin-top 7px
- 抜粋: 11px, color `#6b8090`, line-height 1.5（取得できた場合のみ表示）
- 日付: 11px, color `#9aadb6`

---

### 4. Twitter埋め込みセクション

- **背景**: `#ffffff`
- **上ボーダー**: `1px solid #e4efed`
- **パディング**: 36px top/bottom, 40px LR

**レイアウト**
- H2 "つぶやき"（center）+ "@neko_engineer_"（12px, `#6b8090`, center）
- 埋め込みウィジェット: `max-width: 460px; margin: 0 auto`
- 公式 `widgets.js` を `next/script strategy="lazyOnload"` で読み込み
- 読み込み失敗時はフォールバック高さ（min-height: 200px）を確保してレイアウト崩れを防ぐ

**Twitter埋め込みコード（参考）**
```html
<a
  class="twitter-timeline"
  data-lang="ja"
  data-height="400"
  data-theme="light"
  href="https://twitter.com/neko_engineer_"
>
  Tweets by @neko_engineer_
</a>
```

---

### 5. Footer

- **背景**: `#0c1e2a`
- **パディング**: 26px top/bottom, 40px LR
- **レイアウト**: `display:flex; justify-content:space-between; align-items:center`

**左: ロゴ + コピーライト**
- `🐱 ねこエンジニア`（M PLUS Rounded 1c 700, 15px, `white`）
- `© 2024 ねこエンジニア`（11px, `rgba(255,255,255,0.38)`）

**右: プラットフォームリンク**
- Zenn / note / Booth / GitHub / Twitter
- 12px, `rgba(255,255,255,0.55)`, text-decoration: none
- gap: 16px

---

## Interactions & Behavior

| インタラクション | 仕様 |
|---|---|
| カードホバー | box-shadow or border-color を subtle に変化（例: border `#0fa89b` with opacity 0.5）|
| CTAボタンホバー | Primary: `#0c8a80` に暗く / Secondary: bg を少し濃くする |
| フィルターチップホバー | 非アクティブ: bg を `#f0f8f7` に |
| カードクリック | 別タブで元URL を開く |
| フィルター変更 | URL query param を更新し、カードリストをクライアントサイドでフィルタリング |
| ページ読み込み | URL の `?domain=` / `?platform=` を読んで初期フィルター状態を復元 |

---

## Responsive Breakpoints

| ブレークポイント | カードグリッド |
|---|---|
| `< 640px` (mobile) | 1列 |
| `640px – 1023px` (tablet) | 2列 |
| `≥ 1024px` (desktop) | 3列 |

---

## State Management

- `selectedDomain`: `"すべて" | "IT" | "数学" | "ボルダリング" | "プロダクト"`
- `selectedPlatform`: `"すべて" | "zenn" | "note" | "booth" | "github"`
- `contentItems`: `ContentItem[]`（ビルド時に全件取得し props で渡す）
- フィルタリングはクライアントサイドのみ（追加フェッチ不要）

---

## Data Sources & ContentItem 型

```ts
// content/types.ts
export type Platform = "zenn" | "note" | "booth" | "github" | "product";
export type Domain = "IT" | "数学" | "ボルダリング" | "プロダクト";
export type ContentType = "資格・勉強" | "単発" | "本";

export interface ContentItem {
  id: string;           // platform + slug のハッシュ
  platform: Platform;
  title: string;
  url: string;          // 元プラットフォームの公開URL
  publishedAt?: string; // ISO8601
  excerpt?: string;
  thumbnail?: string;   // サムネイルURL（なければ null）
  tags: string[];       // 元の topics/タグ（生データ）
  category: {
    domain: Domain;
    series?: string;    // 例: "ゼロから"
    type: ContentType;
  };
  source: "auto" | "manual";
}
```

取得元の詳細は要件定義書 `01_requirements.md`〜`04_content-sources.md` を参照。

---

## Assets

| アセット | 詳細 |
|---|---|
| ロゴ絵文字 | 🐱（システム絵文字、画像不要） |
| プロフィール画像 | `public/avatar.png` に配置（未設定時は 🐱 emoji） |
| ヒーロー背景 | CSSグラデーションのみ（画像不要） |
| フォント | Google Fonts CDN から読み込み。`M PLUS Rounded 1c`（wght: 500,700,800）+ `Noto Sans JP`（wght: 400,500,600） |

---

## Files in This Package

```
design_handoff_neko_homepage/
├── README.md                        ← この仕様書
└── design_reference/
    └── ねこエンジニア Homepage.dc.html  ← デザイン参照ファイル（Variation A が左端）
```

## 実装上の注意

1. `M PLUS Rounded 1c` は Next.js の `next/font/google` で読み込むか、`<link>` タグで読み込む。
2. Twitter ウィジェットはクライアントサイドのみ（`'use client'` コンポーネント内）で読み込む。
3. フィルタ状態は URL クエリパラメータで管理する（ `useSearchParams` + `useRouter`）。
4. カード一覧は `page.tsx` の `generateStaticParams` ではなく、ビルド時に `getAllContent()` で全件取得し props 経由で渡す（SSG）。
5. GA4 スクリプトは `NEXT_PUBLIC_GA_MEASUREMENT_ID` 環境変数が設定されている場合のみ挿入する。
