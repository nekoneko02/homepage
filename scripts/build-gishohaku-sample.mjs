#!/usr/bin/env node
// /gishohaku ページに埋め込む「無料版本文」のHTMLを生成するスクリプト。
//
// 原本（Markdown・挿絵）は本リポジトリの外、別リポジトリ engineers-core-book の
// 各書籍ディレクトリ（book/manuscript, book/assets など）で管理されている。
// 収録範囲は各書籍の vivliostyle(.sample).config.js の entry と揃えてあるので、
// 収録章を変えたときはこのスクリプトの BOOKS[].entries も合わせて直すこと。
//
// あちら側で本文・挿絵が更新されたら、このスクリプトを再実行して
// content-cache/gishohaku-sample*.html と public/gishohaku/**/assets/ を
// 更新すること（自動連携・CIは組んでいない。手動運用）。
// 手順は docs/運用手順書.md の「技書博ページ（/gishohaku）無料版の更新」を参照。
//
// 実行方法:
//   npm run build:gishohaku-sample
//   node scripts/build-gishohaku-sample.mjs --src <キャリア本 book/ への絶対/相対パス>
//   node scripts/build-gishohaku-sample.mjs --src-zeromath <ゼロから小学校数学 books/zeromath への絶対/相対パス>
//   （省略時は、本リポジトリと同階層にある engineers-core-book 配下を既定値とする）
//
// 画像は原本の印刷用解像度（幅1200〜2100px）のままだと無駄に重いため、
// 表示上限（IMAGE_MAX_WIDTH）に合わせてリサイズしつつWebPに変換して同梱している。

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { stringify } from "@vivliostyle/vfm";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

function argValue(flag) {
  const i = process.argv.indexOf(flag);
  return i !== -1 ? process.argv[i + 1] : undefined;
}

// 表示側のCSS上限（app/globals.css `.gishohaku-sample-content img`）の2倍
// （Retina等の高DPI画面向け）を書き出し上限とする。
const IMAGE_MAX_WIDTH = 800;
const IMAGE_WEBP_QUALITY = 82;

const BOOKS = [
  {
    // 「勉強しているのに不安が消えないエンジニア〜自分の軸駆動個人開発〜」（Booth有料版＋無料サンプル）
    id: "career",
    bookDir:
      argValue("--src") ?? path.resolve(ROOT, "..", "engineers-core-book", "book"),
    // Booth配布中の無料版PDFと同じ収録範囲・順序。
    entries: [
      { file: "preface.md", type: "md" },
      { file: "introduction.md", type: "md" },
      { file: "part01.md", type: "md" },
      { file: "part02.md", type: "md" },
      { file: "sample_note_before_appendix.html", type: "html" },
      { file: "sample_appendix_teaser.md", type: "md" },
      { file: "sample_continue.html", type: "html" },
    ],
    outHtml: path.join(ROOT, "content-cache", "gishohaku-sample.html"),
    outAssetsDir: path.join(ROOT, "public", "gishohaku", "assets"),
    publicAssetsPrefix: "/gishohaku",
  },
  {
    // 「ゼロから小学校数学 ― ZFC公理からすべてを証明し直す」（現時点の全文。無料公開）
    id: "zeromath",
    bookDir:
      argValue("--src-zeromath") ??
      path.resolve(ROOT, "..", "engineers-core-book", "books", "zeromath"),
    entries: [
      { file: "preface.md", type: "md" },
      { file: "part01.md", type: "md" },
      { file: "part02.md", type: "md" },
    ],
    outHtml: path.join(ROOT, "content-cache", "gishohaku-sample-zeromath.html"),
    outAssetsDir: path.join(ROOT, "public", "gishohaku", "zeromath", "assets"),
    publicAssetsPrefix: "/gishohaku/zeromath",
    // 表紙（Boothに出品していないため外部CDNのサムネイルがなく、原本から書き出す）
    cover: {
      src: path.join("assets", "cover", "cover_export.png"),
      out: path.join(ROOT, "public", "gishohaku", "zeromath", "cover.webp"),
    },
  },
];

const COVER_MAX_WIDTH = 600;

function stripHeadTags(html) {
  // sample_*.html先頭の<title>・Google Fonts<link>を除去する
  // （/gishohakuはサイト共通フォント（M PLUS Rounded 1c / Noto Sans JP）を使うため不要）
  return html
    .replace(/<title>.*?<\/title>\s*/s, "")
    .replace(/<link[^>]*fonts\.googleapis\.com[^>]*>\s*/g, "");
}

function fillFigRefText(html) {
  // 印刷版はCSSのtarget-counter()で「図N」を自動採番しているが、
  // Web版はそのCSSを使わないため空リンクになってしまう。簡易的に「図」で埋める。
  return html.replace(
    /(<a href="#[^"]+" class="fig-ref">)<\/a>/g,
    "$1図</a>"
  );
}

// 原稿の $$...$$ 内で複数行にわたる数式（\\ で改行、\vdots など）は、
// 環境（\begin{gathered}等）で囲まれていないとTeX的に無効なため、
// MathJax（v2/v3どちらでも）は \\ を無視して1行にまとめて表示してしまう。
// 原稿側の記法（bare $$ ... \\ ... $$）は変えずに、Web版の埋め込みHTML側だけ
// \begin{gathered}...\end{gathered} で自動的に囲んで改行を復元する。
function wrapMultilineDisplayMath(html) {
  return html.replace(
    /(<span class="math display" data-math-typeset="true">)\$\$([\s\S]*?)\$\$(<\/span>)/g,
    (full, open, body, close) => {
      if (!body.includes("\\\\") || body.trim().startsWith("\\begin{")) {
        return full;
      }
      return `${open}$$\\begin{gathered}${body}\\end{gathered}$$${close}`;
    }
  );
}

function convertEntry(manuscriptDir, entry) {
  const filePath = path.join(manuscriptDir, entry.file);
  const raw = fs.readFileSync(filePath, "utf-8");
  const html =
    entry.type === "md"
      ? stringify(raw, { partial: true, hardLineBreaks: true })
      : stripHeadTags(raw);
  return wrapMultilineDisplayMath(fillFigRefText(html));
}

// 本文中の画像参照（例: "../assets/part00/xxx.png"）を集める。
function collectImageRefs(html) {
  const refs = new Set();
  for (const m of html.matchAll(/src="(\.\.\/assets\/[^"]+)"/g)) {
    refs.add(m[1]);
  }
  return refs;
}

// 画像をリサイズ・WebP化してpublic/gishohaku/配下に書き出し、
// 元の相対パス -> Web公開パスのマップを返す。
async function processImages(refs, manuscriptDir, outAssetsBaseDir, publicAssetsPrefix) {
  const map = new Map();
  for (const relSrc of refs) {
    // 例: "../assets/part00/xxx.png" -> "assets/part00/xxx.png"
    const relFromBook = relSrc.replace(/^\.\.\//, "");
    const srcPath = path.join(manuscriptDir, "..", relFromBook);
    const destRel = relFromBook.replace(/\.(png|jpe?g)$/i, ".webp");
    const destPath = path.join(outAssetsBaseDir, "..", destRel);

    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    await sharp(srcPath)
      .resize({ width: IMAGE_MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: IMAGE_WEBP_QUALITY })
      .toFile(destPath);

    map.set(relSrc, `${publicAssetsPrefix}/${destRel.split(path.sep).join("/")}`);
  }
  return map;
}

function rewriteImagePaths(html, map) {
  return html.replace(
    /src="(\.\.\/assets\/[^"]+)"/g,
    (full, relSrc) => `src="${map.get(relSrc) ?? relSrc}"`
  );
}

async function buildBook(book) {
  const manuscriptDir = path.join(book.bookDir, "manuscript");
  if (!fs.existsSync(manuscriptDir)) {
    console.error(`原稿ディレクトリが見つかりません: ${manuscriptDir}`);
    console.error(
      "engineers-core-book をクローンしたうえで --src / --src-zeromath で指定してください。"
    );
    process.exit(1);
  }

  fs.rmSync(book.outAssetsDir, { recursive: true, force: true });

  const sections = book.entries.map((entry) => convertEntry(manuscriptDir, entry));
  const allRefs = new Set(sections.flatMap((html) => [...collectImageRefs(html)]));
  const imageMap = await processImages(
    allRefs,
    manuscriptDir,
    book.outAssetsDir,
    book.publicAssetsPrefix
  );
  const combined = sections
    .map((html) => rewriteImagePaths(html, imageMap))
    .join("\n\n");

  fs.mkdirSync(path.dirname(book.outHtml), { recursive: true });
  fs.writeFileSync(book.outHtml, combined);

  console.log(`[${book.id}] 書き出し: ${path.relative(ROOT, book.outHtml)}`);
  console.log(
    `[${book.id}] アセット: ${path.relative(ROOT, book.outAssetsDir)}（${imageMap.size}枚, WebP変換済み）`
  );

  if (book.cover) {
    const coverSrc = path.join(book.bookDir, book.cover.src);
    fs.mkdirSync(path.dirname(book.cover.out), { recursive: true });
    await sharp(coverSrc)
      .resize({ width: COVER_MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: IMAGE_WEBP_QUALITY })
      .toFile(book.cover.out);
    console.log(`[${book.id}] 表紙: ${path.relative(ROOT, book.cover.out)}`);
  }
}

async function main() {
  for (const book of BOOKS) {
    await buildBook(book);
  }
}

main();
