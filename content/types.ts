export type Platform = "zenn" | "note" | "booth" | "github" | "site";
export type Domain = "IT" | "数学" | "ボルダリング" | "プロダクト" | "ブログ" | "本" | "その他";

export interface Category {
  domain: Domain[];
  series?: string;
}

export type VisibilityTarget = "content" | "news";

export interface ContentItem {
  id: string;
  platform: Platform;
  title: string;
  url: string;
  publishedAt?: string;
  excerpt?: string;
  thumbnail?: string;
  newsText?: string;
  visibility?: VisibilityTarget[];
  tags: string[];
  category: Category;
  source: "auto" | "manual";
}
