export const domainKeywords = [
  { pattern: /typescript|javascript|python|aws|gcp|react|nextjs|next\.js|docker|linux|プログラミング|エンジニア|開発|api|golang|rust|sql|database|web|フロント|バック|クラウド|terraform|kubernetes|k8s/i, domain: "IT" },
  { pattern: /数学|math|線形代数|微積分|確率|統計|代数|幾何|解析|数式|行列|ベクトル|虚数/i, domain: "数学" },
  { pattern: /ボルダリング|クライミング|boulder|climb|岩|ジム|課題|グレード/i, domain: "ボルダリング" },
  { pattern: /プロダクト|サービス|リリース|startup|スタートアップ|個人開発|saas/i, domain: "プロダクト" },
  { pattern: /(^|\s)(?:本|book)(\s|$)/i, domain: "本" },
];

export const fixedDomainsByPlatform = {
  zenn: ["IT", "ブログ"],
  note: ["ブログ"],
  booth: ["本"],
  site: ["プロダクト"],
};

export const defaultDomainByPlatform = {
  github: "その他",
  site: "プロダクト",
};

export const seriesPatterns = [
  { match: /ゼロから/, series: "ゼロから" },
];

/**
 * @param {{ platform: string, title: string, tags: string[], [key: string]: any }} item
 * @param {{ manualDomains?: string[] }} [opts]
 */
export function categorize(item, opts = {}) {
  const { platform, tags, title } = item;
  const { manualDomains = [] } = opts;

  const result = new Set([...(fixedDomainsByPlatform[platform] ?? []), ...manualDomains]);
  const searchText = `${tags.join(" ")} ${title}`;
  for (const { pattern, domain } of domainKeywords) {
    if (pattern.test(searchText)) result.add(domain);
  }
  if (result.size === 0) result.add(defaultDomainByPlatform[platform] ?? "その他");
  const domain = Array.from(result);

  let series;
  for (const { match, series: s } of seriesPatterns) {
    if (match.test(title)) { series = s; break; }
  }

  return { ...item, category: { domain, ...(series ? { series } : {}) } };
}
