#!/usr/bin/env node
// Fetches Note and GitHub content, updates content-cache/ if changed.
// Outputs has_diff=true to GitHub Actions when cache was updated.

import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import RSSParser from "rss-parser";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CACHE_DIR = path.join(__dirname, "..", "content-cache");

// --- Category rules (mirrors content/category-rules.ts) ---
const domainKeywords = [
  { pattern: /typescript|javascript|python|aws|gcp|react|nextjs|next\.js|docker|linux|プログラミング|エンジニア|開発|api|golang|rust|sql|database|web|フロント|バック|クラウド|terraform|kubernetes|k8s/i, domain: "IT" },
  { pattern: /数学|math|線形代数|微積分|確率|統計|代数|幾何|解析|数式|行列|ベクトル|虚数/i, domain: "数学" },
  { pattern: /ボルダリング|クライミング|boulder|climb|岩|ジム|課題|グレード/i, domain: "ボルダリング" },
  { pattern: /プロダクト|サービス|リリース|startup|スタートアップ|個人開発|saas/i, domain: "プロダクト" },
];

const fixedDomainsByPlatform = {
  zenn: ["IT", "ブログ"],
  note: ["ブログ"],
  booth: ["本"],
  site: ["プロダクト"],
};

const defaultDomainByPlatform = {
  github: "その他",
  site: "プロダクト",
};

const seriesPatterns = [
  { match: /ゼロから/, series: "ゼロから" },
];

const typeRules = {
  bookPlatforms: ["booth"],
  bookTagPattern: /^本$|^book$/i,
  studyPattern: /資格|試験|勉強|検定/,
};

function categorize(item) {
  const { platform, tags, title } = item;

  const result = new Set(fixedDomainsByPlatform[platform] ?? []);
  const searchText = `${tags.join(" ")} ${title}`;
  for (const { pattern, domain } of domainKeywords) {
    if (pattern.test(searchText)) result.add(domain);
  }
  if (result.size === 0) result.add(defaultDomainByPlatform[platform] ?? "その他");
  const domain = Array.from(result);

  let series;
  for (const { match, series: s } of seriesPatterns) {
    if (match.test(title)) { series = s; break; }
  }

  let type = "単発";
  if (typeRules.bookPlatforms.includes(platform) || tags.some(t => typeRules.bookTagPattern.test(t))) {
    type = "本";
  } else if (typeRules.studyPattern.test(title) || tags.some(t => typeRules.studyPattern.test(t))) {
    type = "資格・勉強";
  }

  return { ...item, category: { domain, ...(series ? { series } : {}), type } };
}

// --- Utilities ---
function hash(obj) {
  return crypto.createHash("sha256").update(JSON.stringify(obj)).digest("hex");
}

function readCache(name) {
  try {
    return JSON.parse(fs.readFileSync(path.join(CACHE_DIR, `${name}.json`), "utf-8"));
  } catch {
    return [];
  }
}

function writeCache(name, items) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  fs.writeFileSync(path.join(CACHE_DIR, `${name}.json`), JSON.stringify(items, null, 2));
}

// --- Note RSS ---
const NOTE_RSS_URL = process.env.NOTE_RSS_URL ?? "https://note.com/alg_geo/rss";

async function fetchNote() {
  const parser = new RSSParser();
  const feed = await parser.parseURL(NOTE_RSS_URL);
  return (feed.items ?? []).map((item, i) => {
    const url = item.link ?? "";
    const slug = url.split("/").pop() ?? String(i);
    return categorize({
      id: `note-${slug}`,
      platform: "note",
      title: item.title ?? "",
      url,
      publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : undefined,
      excerpt: item.contentSnippet?.slice(0, 120),
      tags: [],
      source: "auto",
    });
  });
}

// --- GitHub ---
const GITHUB_USER = process.env.GITHUB_USER ?? "nekoneko02";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const NEKO_TOPIC = "neko-homepage";
const PLATFORM_TOPICS = { site: "site" };

function buildHeaders() {
  const headers = { Accept: "application/vnd.github.v3+json" };
  if (GITHUB_TOKEN) headers["Authorization"] = `Bearer ${GITHUB_TOKEN}`;
  return headers;
}

function platformFromTopics(topics) {
  for (const t of topics) {
    if (PLATFORM_TOPICS[t]) return PLATFORM_TOPICS[t];
  }
  return "github";
}

async function tryFetchFeed(repo) {
  const url = `https://raw.githubusercontent.com/${GITHUB_USER}/${repo.name}/HEAD/feed.json`;
  try {
    const res = await fetch(url, { headers: buildHeaders() });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function repoToItem(repo) {
  return categorize({
    id: `github-${repo.name}`,
    platform: platformFromTopics(repo.topics),
    title: repo.description ?? repo.name,
    url: repo.homepage ?? `https://github.com/${GITHUB_USER}/${repo.name}`,
    publishedAt: repo.pushed_at,
    tags: repo.topics.filter(t => t !== NEKO_TOPIC),
    source: "auto",
  });
}

function feedToItems(repo, feed) {
  const platform = feed.platform ?? "github";
  return feed.items.map(item => categorize({
    id: `github-${repo.name}-${item.id}`,
    platform,
    title: item.title,
    url: item.url,
    publishedAt: item.date_published,
    excerpt: item.summary,
    tags: item.tags ?? repo.topics.filter(t => t !== NEKO_TOPIC),
    source: "auto",
  }));
}

async function fetchGitHub() {
  const res = await fetch(
    `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100`,
    { headers: buildHeaders() }
  );
  if (!res.ok) throw new Error(`GitHub API ${res.status}`);
  const repos = await res.json();
  const targets = repos.filter(r => r.topics?.includes(NEKO_TOPIC));

  const results = await Promise.allSettled(
    targets.map(async repo => {
      const feed = await tryFetchFeed(repo);
      return feed ? feedToItems(repo, feed) : [repoToItem(repo)];
    })
  );

  return results
    .filter(r => r.status === "fulfilled")
    .flatMap(r => r.value);
}

// --- Main ---
async function main() {
  const [noteItems, githubItems] = await Promise.all([
    fetchNote().catch(err => { console.warn("Note fetch failed:", err.message); return null; }),
    fetchGitHub().catch(err => { console.warn("GitHub fetch failed:", err.message); return null; }),
  ]);

  let hasDiff = false;

  if (noteItems !== null) {
    const cached = readCache("note");
    if (hash(noteItems) !== hash(cached)) {
      console.log("note: diff detected, updating cache");
      writeCache("note", noteItems);
      hasDiff = true;
    } else {
      console.log("note: no diff");
    }
  }

  if (githubItems !== null) {
    const cached = readCache("github");
    if (hash(githubItems) !== hash(cached)) {
      console.log("github: diff detected, updating cache");
      writeCache("github", githubItems);
      hasDiff = true;
    } else {
      console.log("github: no diff");
    }
  }

  console.log(`has_diff=${hasDiff}`);
  const outputFile = process.env.GITHUB_OUTPUT;
  if (outputFile) {
    fs.appendFileSync(outputFile, `has_diff=${hasDiff}\n`);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
