#!/usr/bin/env node
// /gishohaku ページに埋め込む「無料版本文」のHTMLを生成するスクリプト。
//
// 原本（Markdown・挿絵）は本リポジトリの外、別リポジトリ
// engineers-core-book（book/manuscript, book/assets）で管理されている。
// 無料版の収録範囲は book/vivliostyle.sample.config.js の entry と揃えてあるので、
// 収録章を変えたときはこのスクリプトの ENTRIES も合わせて直すこと。
//
// あちら側で本文・挿絵が更新されたら、このスクリプトを再実行して
// content-cache/gishohaku-sample.html と public/gishohaku/assets/ を
// 更新すること（自動連携・CIは組んでいない。手動運用）。
// 手順は docs/運用手順書.md の「技書博ページ（/gishohaku）無料版の更新」を参照。
//
// 実行方法:
//   npm run build:gishohaku-sample
//   node scripts/build-gishohaku-sample.mjs --src <engineers-core-book/book への絶対/相対パス>
//   （--src省略時は、本リポジトリと同階層にある ../engineers-core-book/book を既定値とする）
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

const srcArgIndex = process.argv.indexOf("--src");
const BOOK_DIR =
  srcArgIndex !== -1
    ? path.resolve(process.argv[srcArgIndex + 1])
    : path.resolve(ROOT, "..", "engineers-core-book", "book");

const MANUSCRIPT_DIR = path.join(BOOK_DIR, "manuscript");
const OUT_HTML = path.join(ROOT, "content-cache", "gishohaku-sample.html");
const OUT_ASSETS_DIR = path.join(ROOT, "public", "gishohaku", "assets");

// 表示側のCSS上限（app/globals.css `.gishohaku-sample-content img`）の2倍
// （Retina等の高DPI画面向け）を書き出し上限とする。
const IMAGE_MAX_WIDTH = 800;
const IMAGE_WEBP_QUALITY = 82;

// Booth配布中の無料版PDFと同じ収録範囲・順序。
const ENTRIES = [
  { file: "preface.md", type: "md" },
  { file: "introduction.md", type: "md" },
  { file: "part01.md", type: "md" },
  { file: "part02.md", type: "md" },
  { file: "sample_note_before_appendix.html", type: "html" },
  { file: "sample_appendix_teaser.md", type: "md" },
  { file: "sample_continue.html", type: "html" },
];

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

function convertEntry(entry) {
  const filePath = path.join(MANUSCRIPT_DIR, entry.file);
  const raw = fs.readFileSync(filePath, "utf-8");
  const html =
    entry.type === "md"
      ? stringify(raw, { partial: true, hardLineBreaks: true })
      : stripHeadTags(raw);
  return fillFigRefText(html);
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
async function processImages(refs) {
  const map = new Map();
  for (const relSrc of refs) {
    // 例: "../assets/part00/xxx.png" -> "assets/part00/xxx.png"
    const relFromBook = relSrc.replace(/^\.\.\//, "");
    const srcPath = path.join(MANUSCRIPT_DIR, "..", relFromBook);
    const destRel = relFromBook.replace(/\.(png|jpe?g)$/i, ".webp");
    const destPath = path.join(ROOT, "public", "gishohaku", destRel);

    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    await sharp(srcPath)
      .resize({ width: IMAGE_MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: IMAGE_WEBP_QUALITY })
      .toFile(destPath);

    map.set(relSrc, `/gishohaku/${destRel.split(path.sep).join("/")}`);
  }
  return map;
}

function rewriteImagePaths(html, map) {
  return html.replace(
    /src="(\.\.\/assets\/[^"]+)"/g,
    (full, relSrc) => `src="${map.get(relSrc) ?? relSrc}"`
  );
}

async function main() {
  if (!fs.existsSync(MANUSCRIPT_DIR)) {
    console.error(`原稿ディレクトリが見つかりません: ${MANUSCRIPT_DIR}`);
    console.error(
      "engineers-core-book をクローンしたうえで --src <path> で指定してください。"
    );
    process.exit(1);
  }

  fs.rmSync(OUT_ASSETS_DIR, { recursive: true, force: true });

  const sections = ENTRIES.map(convertEntry);
  const allRefs = new Set(sections.flatMap((html) => [...collectImageRefs(html)]));
  const imageMap = await processImages(allRefs);
  const combined = sections
    .map((html) => rewriteImagePaths(html, imageMap))
    .join("\n\n");

  fs.mkdirSync(path.dirname(OUT_HTML), { recursive: true });
  fs.writeFileSync(OUT_HTML, combined);

  console.log(`書き出し: ${path.relative(ROOT, OUT_HTML)}`);
  console.log(`アセット: ${path.relative(ROOT, OUT_ASSETS_DIR)}（${imageMap.size}枚, WebP変換済み）`);
}

main();
