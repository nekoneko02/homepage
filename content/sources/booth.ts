import fs from "fs";
import path from "path";
import { categorize } from "../categorize";
import type { ContentItem } from "../types";

interface BoothEntry {
  title: string;
  url: string;
  publishedAt?: string;
  tags?: string[];
  thumbnail?: string;
  excerpt?: string;
}

export function fetchBooth(): ContentItem[] {
  const filePath = path.join(process.cwd(), "data", "booth.json");
  const raw: BoothEntry[] = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  return raw.map((entry, i) => {
    const slug = entry.url.split("/").pop() ?? String(i);
    const base: Omit<ContentItem, "category"> = {
      id: `booth-${slug}`,
      platform: "booth",
      title: entry.title,
      url: entry.url,
      publishedAt: entry.publishedAt,
      excerpt: entry.excerpt,
      thumbnail: entry.thumbnail,
      tags: entry.tags ?? [],
      source: "manual",
    };
    return categorize(base);
  });
}
