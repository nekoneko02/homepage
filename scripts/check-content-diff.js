#!/usr/bin/env node
// Fetches latest content and compares with content-cache snapshots.
// Outputs has_diff=true to GitHub Actions if content has changed.

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { execSync } = require("child_process");

const CACHE_DIR = path.join(__dirname, "..", "content-cache");

function hash(obj) {
  return crypto.createHash("sha256").update(JSON.stringify(obj)).digest("hex");
}

function readCache(name) {
  try {
    return JSON.parse(
      fs.readFileSync(path.join(CACHE_DIR, `${name}.json`), "utf-8")
    );
  } catch {
    return [];
  }
}

async function fetchZennRSS() {
  const repo = process.env.ZENN_GH_REPO ?? "nekoneko02/zenn";
  const username = repo.split("/")[0];
  const res = await fetch(`https://zenn.dev/${username}/feed`);
  if (!res.ok) return null;
  const text = await res.text();
  // Extract item titles from RSS as simple diff signal
  const titles = [...text.matchAll(/<title><!\[CDATA\[([^\]]+)\]\]><\/title>/g)].map(
    (m) => m[1]
  );
  return titles;
}

async function fetchNoteRSS() {
  const url = process.env.NOTE_RSS_URL ?? "https://note.com/nekoneko02/rss";
  const res = await fetch(url);
  if (!res.ok) return null;
  const text = await res.text();
  const titles = [...text.matchAll(/<title>([^<]+)<\/title>/g)]
    .map((m) => m[1])
    .slice(1); // skip channel title
  return titles;
}

async function main() {
  const [zennTitles, noteTitles] = await Promise.all([
    fetchZennRSS().catch(() => null),
    fetchNoteRSS().catch(() => null),
  ]);

  const cachedZenn = readCache("zenn");
  const cachedNote = readCache("note");

  const cachedZennTitles = cachedZenn.map((i) => i.title);
  const cachedNoteTitles = cachedNote.map((i) => i.title);

  const zennDiff =
    zennTitles !== null && hash(zennTitles) !== hash(cachedZennTitles);
  const noteDiff =
    noteTitles !== null && hash(noteTitles) !== hash(cachedNoteTitles);

  const hasDiff = zennDiff || noteDiff;

  console.log(`Zenn diff: ${zennDiff}, Note diff: ${noteDiff}`);
  console.log(`has_diff=${hasDiff}`);

  // GitHub Actions output
  const outputFile = process.env.GITHUB_OUTPUT;
  if (outputFile) {
    fs.appendFileSync(outputFile, `has_diff=${hasDiff}\n`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
