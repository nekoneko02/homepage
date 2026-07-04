import fs from "fs";
import path from "path";
import type { ContentItem } from "./types";

const CACHE_DIR = path.join(process.cwd(), "content-cache");

function readCache(name: string): ContentItem[] {
  try {
    return JSON.parse(
      fs.readFileSync(path.join(CACHE_DIR, `${name}.json`), "utf-8")
    );
  } catch {
    return [];
  }
}

export async function aggregate(): Promise<ContentItem[]> {
  const note = readCache("note");
  const github = readCache("github");
  const booth = readCache("booth");

  const all = [...note, ...github, ...booth];

  const seen = new Set<string>();
  const deduped = all.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });

  return deduped.sort((a, b) => {
    if (!a.publishedAt && !b.publishedAt) return 0;
    if (!a.publishedAt) return 1;
    if (!b.publishedAt) return -1;
    return b.publishedAt.localeCompare(a.publishedAt);
  });
}
