import type { Platform, Domain } from "./types";

export const domainKeywords: { pattern: RegExp; domain: Domain }[] = [
  {
    pattern:
      /typescript|javascript|python|aws|gcp|react|nextjs|next\.js|docker|linux|プログラミング|エンジニア|開発|api|golang|rust|sql|database|web|フロント|バック|クラウド|terraform|kubernetes|k8s/i,
    domain: "IT",
  },
  {
    pattern: /数学|math|線形代数|微積分|確率|統計|代数|幾何|解析|数式|行列|ベクトル|虚数/i,
    domain: "数学",
  },
  {
    pattern: /ボルダリング|クライミング|boulder|climb|岩|ジム|課題|グレード/i,
    domain: "ボルダリング",
  },
  {
    pattern: /プロダクト|サービス|リリース|startup|スタートアップ|個人開発|saas/i,
    domain: "プロダクト",
  },
];

// Always added regardless of content
export const fixedDomainsByPlatform: Partial<Record<Platform, Domain[]>> = {
  zenn: ["IT", "ブログ"],
  note: ["ブログ"],
  booth: ["本"],
  site: ["プロダクト"],
};

// Used only when fixed + extracted + manual all produce nothing
export const defaultDomainByPlatform: Partial<Record<Platform, Domain>> = {
  github: "その他",
  site: "プロダクト",
};

export const seriesPatterns: { match: RegExp; series: string }[] = [
  { match: /ゼロから/, series: "ゼロから" },
];

export const typeRules = {
  bookPlatforms: ["booth"] as Platform[],
  bookTagPattern: /^本$|^book$/i,
  studyPattern: /資格|試験|勉強|検定/,
};
