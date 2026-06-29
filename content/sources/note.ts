import { categorize } from "../categorize";
import type { ContentItem } from "../types";

const NOTE_RSS_URL =
  process.env.NOTE_RSS_URL ?? "https://note.com/alg_geo/rss";

export async function fetchNote(): Promise<ContentItem[]> {
  const RSSParser = (await import("rss-parser")).default;
  const parser = new RSSParser();
  const feed = await parser.parseURL(NOTE_RSS_URL);

  return (feed.items ?? []).map((item, i) => {
    const url = item.link ?? "";
    const slug = url.split("/").pop() ?? String(i);
    const raw: Omit<ContentItem, "category"> = {
      id: `note-${slug}`,
      platform: "note",
      title: item.title ?? "",
      url,
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
