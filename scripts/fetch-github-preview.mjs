#!/usr/bin/env node
// GitHub自動取得のプレビュー確認用スクリプト
// 使い方: node scripts/fetch-github-preview.mjs

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// .env.local を手動で読み込む
function loadEnv() {
  const envPath = path.join(__dirname, "..", ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) process.env[match[1].trim()] = match[2].trim();
  }
}
loadEnv();

const GITHUB_USER = process.env.GITHUB_USER ?? "nekoneko02";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const NEKO_TOPIC = "neko-homepage";

function headers() {
  const h = { Accept: "application/vnd.github.v3+json" };
  if (GITHUB_TOKEN) h["Authorization"] = `Bearer ${GITHUB_TOKEN}`;
  return h;
}

async function run() {
  console.log(`\n取得対象ユーザー: ${GITHUB_USER}`);
  console.log(`GITHUB_TOKEN: ${GITHUB_TOKEN ? "あり（レート制限緩和済み）" : "なし（60回/時間の制限あり）"}\n`);

  const res = await fetch(
    `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100`,
    { headers: headers() }
  );
  if (!res.ok) {
    console.error(`GitHub API エラー: ${res.status} ${res.statusText}`);
    process.exit(1);
  }

  const repos = await res.json();
  const targets = repos.filter((r) => r.topics?.includes(NEKO_TOPIC));

  console.log(`全リポジトリ数: ${repos.length}`);
  console.log(`"${NEKO_TOPIC}" topic 付きリポジトリ: ${targets.length} 件\n`);

  if (targets.length === 0) {
    console.log("対象リポジトリがありません。");
    console.log(`GitHub でリポジトリを開き、Settings > Topics に "${NEKO_TOPIC}" を追加してください。`);
    return;
  }

  for (const repo of targets) {
    console.log(`── ${repo.name} ──`);
    console.log(`  description : ${repo.description ?? "(なし)"}`);
    console.log(`  homepage    : ${repo.homepage ?? "(なし)"}`);
    console.log(`  topics      : ${repo.topics.join(", ")}`);

    // feed.json を試みる
    const feedUrl = `https://raw.githubusercontent.com/${GITHUB_USER}/${repo.name}/HEAD/feed.json`;
    const feedRes = await fetch(feedUrl, { headers: headers() });
    if (feedRes.ok) {
      const feed = await feedRes.json();
      console.log(`  feed.json   : あり（${feed.items?.length ?? 0} アイテム）`);
      for (const item of feed.items ?? []) {
        console.log(`    - [${item.date_published ?? "日付なし"}] ${item.title}`);
        console.log(`      ${item.url}`);
      }
    } else {
      console.log(`  feed.json   : なし → リポジトリ単位で1件表示`);
      console.log(`    - タイトル: ${repo.description ?? repo.name}`);
      console.log(`      URL: ${repo.homepage ?? `https://github.com/${GITHUB_USER}/${repo.name}`}`);
    }
    console.log();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
