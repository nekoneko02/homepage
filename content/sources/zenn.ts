import matter from "gray-matter";
import { categorize } from "../categorize";
import type { ContentItem } from "../types";

// GitHub リポジトリ（nekoneko02/zenn）と Zenn 公開URL のユーザー名（neko_student）は別
const REPO = process.env.ZENN_GH_REPO ?? "nekoneko02/zenn";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const ZENN_USERNAME = process.env.ZENN_USERNAME ?? "neko_student";

interface GitHubFile {
  name: string;
  download_url: string | null;
  type: string;
}

interface ZennFrontmatter {
  title?: string;
  emoji?: string;
  topics?: string[];
  published?: boolean;
  published_at?: string;
}

function buildHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
  };
  if (GITHUB_TOKEN) headers["Authorization"] = `Bearer ${GITHUB_TOKEN}`;
  return headers;
}

async function fetchFromGitHub(): Promise<ContentItem[]> {
  const listRes = await fetch(
    `https://api.github.com/repos/${REPO}/contents/articles`,
    { headers: buildHeaders() }
  );
  if (!listRes.ok) throw new Error(`GitHub API ${listRes.status}`);

  const files: GitHubFile[] = await listRes.json();
  const mdFiles = files.filter(
    (f) => f.type === "file" && f.name.endsWith(".md") && f.download_url
  );

  const results = await Promise.allSettled(
    mdFiles.map(async (file) => {
      const res = await fetch(file.download_url!);
      if (!res.ok) throw new Error(`download ${res.status}`);
      const text = await res.text();
      const { data } = matter(text) as { data: ZennFrontmatter };

      if (data.published === false) return null;

      const slug = file.name.replace(/\.md$/, "");
      const raw: Omit<ContentItem, "category"> = {
        id: `zenn-${slug}`,
        platform: "zenn",
        title: data.title ?? slug,
        url: `https://zenn.dev/${ZENN_USERNAME}/articles/${slug}`,
        publishedAt: data.published_at
          ? new Date(data.published_at).toISOString()
          : undefined,
        tags: data.topics ?? [],
        source: "auto",
      };

      return categorize(raw);
    })
  );

  return results
    .filter(
      (r): r is PromiseFulfilledResult<ContentItem> =>
        r.status === "fulfilled" && r.value !== null
    )
    .map((r) => r.value);
}

async function fetchFromRSS(): Promise<ContentItem[]> {
  const RSSParser = (await import("rss-parser")).default;
  const parser = new RSSParser();
  const feed = await parser.parseURL(`https://zenn.dev/${ZENN_USERNAME}/feed?all=1`);

  return (feed.items ?? []).map((item, i) => {
    const slug = item.link?.split("/").pop() ?? String(i);
    const raw: Omit<ContentItem, "category"> = {
      id: `zenn-${slug}`,
      platform: "zenn",
      title: item.title ?? "",
      url: item.link ?? "",
      publishedAt: item.pubDate
        ? new Date(item.pubDate).toISOString()
        : undefined,
      excerpt: item.contentSnippet?.slice(0, 120),
      tags: [],
      source: "auto",
    };
    return categorize(raw);
  });
}

export async function fetchZenn(): Promise<ContentItem[]> {
  try {
    return await fetchFromGitHub();
  } catch (err) {
    console.warn("[zenn] GitHub API failed, falling back to RSS:", err);
    return await fetchFromRSS();
  }
}
