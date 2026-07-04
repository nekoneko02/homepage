import { describe, it, expect } from "vitest";
import { categorize } from "./categorize";
import type { Domain } from "./types";

function base(platform: Parameters<typeof categorize>[0]["platform"], overrides: Partial<Parameters<typeof categorize>[0]> = {}) {
  return {
    id: "test",
    platform,
    title: "",
    url: "https://example.com",
    tags: [] as string[],
    source: "auto" as const,
    ...overrides,
  };
}

function domains(result: ReturnType<typeof categorize>): Domain[] {
  return result.category.domain;
}

describe("zenn", () => {
  it("固定で IT と ブログ が付く", () => {
    const result = categorize(base("zenn", { title: "雑記" }));
    expect(domains(result)).toContain("IT");
    expect(domains(result)).toContain("ブログ");
  });

  it("frontmatter topics に数学キーワードがあれば 数学 も付く", () => {
    const result = categorize(base("zenn", { tags: ["線形代数", "行列"] }));
    expect(domains(result)).toContain("IT");
    expect(domains(result)).toContain("数学");
  });

  it("frontmatter topics が IT 系のみなら IT+ブログ のまま", () => {
    const result = categorize(base("zenn", { tags: ["typescript", "react"] }));
    expect(domains(result)).toEqual(expect.arrayContaining(["IT", "ブログ"]));
    expect(domains(result)).not.toContain("数学");
  });
});

describe("note", () => {
  it("固定で ブログ が付く", () => {
    const result = categorize(base("note", { title: "日記" }));
    expect(domains(result)).toContain("ブログ");
  });

  it("タイトルに数学キーワードがあれば 数学 も付く", () => {
    const result = categorize(base("note", {
      title: "数学の分野一覧　詳細編～中学・高校数学から大学数学へ。こんな応用があります",
    }));
    expect(domains(result)).toContain("ブログ");
    expect(domains(result)).toContain("数学");
  });

  it("タイトルに 虚数 があれば 数学 が付く", () => {
    const result = categorize(base("note", { title: "虚数とは何か" }));
    expect(domains(result)).toContain("数学");
  });

  it("タイトルにボルダリングキーワードがあれば ボルダリング も付く", () => {
    const result = categorize(base("note", { title: "ボルダリング初心者が課題を登った話" }));
    expect(domains(result)).toContain("ブログ");
    expect(domains(result)).toContain("ボルダリング");
  });
});

describe("booth", () => {
  it("固定で 本 が付く", () => {
    const result = categorize(base("booth", { title: "エンジニア向け同人誌" }));
    expect(domains(result)).toContain("本");
  });

  it("manualDomains を指定できる", () => {
    const result = categorize(base("booth"), { manualDomains: ["IT"] });
    expect(domains(result)).toContain("本");
    expect(domains(result)).toContain("IT");
  });
});

describe("github (books)", () => {
  it("何も検出されなければ その他 になる", () => {
    const result = categorize(base("github", { title: "無題" }));
    expect(domains(result)).toEqual(["その他"]);
  });

  it("タグに 数学 キーワードがあれば 数学 が付く", () => {
    const result = categorize(base("github", { tags: ["数学", "本"] }));
    expect(domains(result)).toContain("数学");
    expect(domains(result)).not.toContain("その他");
  });

  it("タグに 本 があれば 本 が domain に付く", () => {
    const result = categorize(base("github", { tags: ["数学", "ZFC公理", "本"] }));
    expect(domains(result)).toContain("数学");
    expect(domains(result)).toContain("本");
  });

  it("manualDomains で明示指定できる", () => {
    const result = categorize(base("github"), { manualDomains: ["数学"] });
    expect(domains(result)).toContain("数学");
  });
});

describe("site", () => {
  it("固定で プロダクト が付く", () => {
    const result = categorize(base("site", { title: "新サービスのリリース" }));
    expect(domains(result)).toContain("プロダクト");
  });
});
