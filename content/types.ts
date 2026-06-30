export type Platform = "zenn" | "note" | "booth" | "github" | "site";
export type Domain = "IT" | "数学" | "ボルダリング" | "プロダクト" | "ブログ" | "本" | "その他";
export type ContentType = "資格・勉強" | "単発" | "本";

export interface Category {
  domain: Domain[];
  series?: string;
  type: ContentType;
}

export interface ContentItem {
  id: string;
  platform: Platform;
  title: string;
  url: string;
  publishedAt?: string;
  excerpt?: string;
  thumbnail?: string;
  tags: string[];
  category: Category;
  source: "auto" | "manual";
}
