import type { ContentItem, Domain, ContentType, Platform } from "./types";
import {
  domainKeywords,
  fixedDomainsByPlatform,
  defaultDomainByPlatform,
  seriesPatterns,
  typeRules,
} from "./category-rules";

function detectDomain(
  tags: string[],
  title: string,
  platform: Platform,
  manualDomains?: Domain[]
): Domain[] {
  const result = new Set<Domain>();

  // Step 1: Fixed categories for this platform (always added)
  for (const d of fixedDomainsByPlatform[platform] ?? []) result.add(d);

  // Step 2: Manually specified domains (from data files)
  for (const d of manualDomains ?? []) result.add(d);

  // Step 3: Keyword extraction from tags + title (all platforms)
  const searchText = `${tags.join(" ")} ${title}`;
  for (const { pattern, domain } of domainKeywords) {
    if (pattern.test(searchText)) result.add(domain);
  }

  // Step 4: Platform default if nothing detected
  if (result.size === 0) {
    result.add(defaultDomainByPlatform[platform] ?? "その他");
  }

  return Array.from(result);
}

function detectSeries(title: string): string | undefined {
  for (const { match, series } of seriesPatterns) {
    if (match.test(title)) return series;
  }
  return undefined;
}

function detectType(
  platform: Platform,
  tags: string[],
  title: string
): ContentType {
  if (
    typeRules.bookPlatforms.includes(platform) ||
    tags.some((t) => typeRules.bookTagPattern.test(t))
  ) {
    return "本";
  }
  if (
    typeRules.studyPattern.test(title) ||
    tags.some((t) => typeRules.studyPattern.test(t))
  ) {
    return "資格・勉強";
  }
  return "単発";
}

export function categorize(
  item: Omit<ContentItem, "category">,
  opts?: { manualDomains?: Domain[] }
): ContentItem {
  const domain = detectDomain(
    item.tags,
    item.title,
    item.platform,
    opts?.manualDomains
  );
  const series = detectSeries(item.title);
  const type = detectType(item.platform, item.tags, item.title);

  return { ...item, category: { domain, series, type } };
}
