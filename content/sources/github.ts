import { categorize } from "../categorize";
import type { ContentItem, Platform } from "../types";

const GITHUB_USER = process.env.GITHUB_USER ?? "nekoneko02";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const NEKO_TOPIC = "neko-homepage";
const PLATFORM_TOPICS: Partial<Record<string, Platform>> = {
  site: "site",
};

interface GitHubRepo {
  name: string;
  description: string | null;
  homepage: string | null;
  topics: string[];
  pushed_at: string;
}

interface FeedItem {
  id: string;
  title: string;
  url: string;
  date_published?: string;
  summary?: string;
  tags?: string[];
}

interface FeedJson {
  title?: string;
  platform?: string;
  items: FeedItem[];
}

function buildHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
  };
  if (GITHUB_TOKEN) headers["Authorization"] = `Bearer ${GITHUB_TOKEN}`;
  return headers;
}

async function tryFetchFeed(repo: GitHubRepo): Promise<FeedJson | null> {
  const url = `https://raw.githubusercontent.com/${GITHUB_USER}/${repo.name}/HEAD/feed.json`;
  try {
    const res = await fetch(url, { headers: buildHeaders() });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function platformFromTopics(topics: string[]): Platform {
  for (const t of topics) {
    const p = PLATFORM_TOPICS[t];
    if (p) return p;
  }
  return "github";
}

function repoToItem(repo: GitHubRepo): ContentItem {
  const platform = platformFromTopics(repo.topics);
  const raw: Omit<ContentItem, "category"> = {
    id: `github-${repo.name}`,
    platform,
    title: repo.description ?? repo.name,
    url: repo.homepage ?? `https://github.com/${GITHUB_USER}/${repo.name}`,
    publishedAt: repo.pushed_at,
    tags: repo.topics.filter((t) => t !== NEKO_TOPIC),
    source: "auto",
  };
  return categorize(raw);
}

function feedToItems(repo: GitHubRepo, feed: FeedJson): ContentItem[] {
  const platform = (feed.platform as Platform | undefined) ?? "github";
  return feed.items.map((item) => {
    const raw: Omit<ContentItem, "category"> = {
      id: `github-${repo.name}-${item.id}`,
      platform,
      title: item.title,
      url: item.url,
      publishedAt: item.date_published,
      excerpt: item.summary,
      tags: item.tags ?? repo.topics.filter((t) => t !== NEKO_TOPIC),
      source: "auto",
    };
    return categorize(raw);
  });
}

export async function fetchGitHub(): Promise<ContentItem[]> {
  const res = await fetch(
    `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100`,
    { headers: buildHeaders() }
  );
  if (!res.ok) throw new Error(`GitHub API ${res.status}`);

  const repos: GitHubRepo[] = await res.json();
  const targets = repos.filter((r) => r.topics.includes(NEKO_TOPIC));

  const results = await Promise.allSettled(
    targets.map(async (repo) => {
      const feed = await tryFetchFeed(repo);
      return feed ? feedToItems(repo, feed) : [repoToItem(repo)];
    })
  );

  return results
    .filter(
      (r): r is PromiseFulfilledResult<ContentItem[]> => r.status === "fulfilled"
    )
    .flatMap((r) => r.value);
}
