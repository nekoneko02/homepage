import fs from "fs";
import path from "path";
import type { ContentItem } from "./types";
import { fetchZenn } from "./sources/zenn";
import { fetchNote } from "./sources/note";
import { fetchBooth } from "./sources/booth";
import { fetchBooks } from "./sources/books";
import { fetchProducts } from "./sources/products";

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

function writeCache(name: string, items: ContentItem[]) {
  try {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
    fs.writeFileSync(
      path.join(CACHE_DIR, `${name}.json`),
      JSON.stringify(items, null, 2)
    );
  } catch {
    // non-fatal
  }
}

async function fetchWithFallback(
  name: string,
  fetcher: () => Promise<ContentItem[]>
): Promise<ContentItem[]> {
  try {
    const items = await fetcher();
    writeCache(name, items);
    return items;
  } catch (err) {
    console.warn(`[${name}] fetch failed, using snapshot:`, err);
    return readCache(name);
  }
}

export async function aggregate(): Promise<ContentItem[]> {
  const [zenn, note] = await Promise.all([
    fetchWithFallback("zenn", fetchZenn),
    fetchWithFallback("note", fetchNote),
  ]);

  const manual: ContentItem[] = [
    ...fetchBooth(),
    ...fetchBooks(),
    ...fetchProducts(),
  ];

  const all = [...zenn, ...note, ...manual];

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
