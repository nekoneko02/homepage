import type { ContentItem, Domain, ContentType, Platform } from "./types";
import {
  domainKeywords,
  domainDefaultByPlatform,
  seriesPatterns,
  typeRules,
} from "./category-rules";

function detectDomain(
  tags: string[],
  title: string,
  platform: Platform,
  zennType?: string
): Domain {
  if (platform === "zenn" && zennType === "tech") return "IT";

  const tagStr = tags.join(" ");
  for (const { pattern, domain } of domainKeywords) {
    if (pattern.test(tagStr)) return domain;
  }

  for (const { pattern, domain } of domainKeywords) {
    if (pattern.test(title)) return domain;
  }

  return domainDefaultByPlatform[platform];
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
  opts?: { zennType?: string }
): ContentItem {
  const domain = detectDomain(
    item.tags,
    item.title,
    item.platform,
    opts?.zennType
  );
  const series = detectSeries(item.title);
  const type = detectType(item.platform, item.tags, item.title);

  return { ...item, category: { domain, series, type } };
}
