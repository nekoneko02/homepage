import { describe, it, expect } from "vitest";
import { categorize } from "./categorize.mjs";

function base(platform, overrides = {}) {
  return { id: "test", platform, title: "", url: "https://example.com", tags: [], source: "auto", ...overrides };
}

function domains(result) {
  return result.category.domain;
}

describe("zenn", () => {
  it("固定で IT と ブログ が付く", () => {
    expect(domains(categorize(base("zenn", { title: "雑記" })))).toEqual(expect.arrayContaining(["IT", "ブログ"]));
  });

  it("タグに数学キーワードがあれば 数学 も付く", () => {
    const result = categorize(base("zenn", { tags: ["線形代数", "行列"] }));
    expect(domains(result)).toContain("数学");
    expect(domains(result)).toContain("IT");
  });
});

describe("note", () => {
  it("固定で ブログ が付く", () => {
    expect(domains(categorize(base("note", { title: "日記" })))).toContain("ブログ");
  });

  it("タイトルに数学キーワードがあれば 数学 も付く", () => {
    expect(domains(categorize(base("note", { title: "虚数とは何か" })))).toContain("数学");
  });

  it("タイトルにボルダリングキーワードがあれば ボルダリング が付く", () => {
    expect(domains(categorize(base("note", { title: "ボルダリング初心者が課題を登った話" })))).toContain("ボルダリング");
  });
});

describe("booth", () => {
  it("固定で 本 が付く", () => {
    expect(domains(categorize(base("booth", { title: "エンジニア向け同人誌" })))).toContain("本");
  });

  it("manualDomains を指定できる", () => {
    const result = categorize(base("booth"), { manualDomains: ["IT"] });
    expect(domains(result)).toContain("本");
    expect(domains(result)).toContain("IT");
  });
});

describe("github", () => {
  it("何も検出されなければ その他 になる", () => {
    expect(domains(categorize(base("github", { title: "無題" })))).toEqual(["その他"]);
  });

  it("タグに 数学 があれば 数学 が付く", () => {
    const result = categorize(base("github", { tags: ["数学", "本"] }));
    expect(domains(result)).toContain("数学");
    expect(domains(result)).not.toContain("その他");
  });

  it("タグに 本 があれば 本 が domain に付く", () => {
    const result = categorize(base("github", { tags: ["数学", "ZFC公理", "本"] }));
    expect(domains(result)).toContain("数学");
    expect(domains(result)).toContain("本");
  });

  it("本 は部分一致しない（基本 などにヒットしない）", () => {
    const result = categorize(base("github", { title: "基本的なアルゴリズム" }));
    expect(domains(result)).not.toContain("本");
  });
});

describe("series", () => {
  it("タイトルに ゼロから を含む場合 series が付く", () => {
    const result = categorize(base("github", { tags: ["数学"], title: "ゼロから学ぶ線形代数" }));
    expect(result.category.series).toBe("ゼロから");
  });

  it("ゼロから を含まない場合 series は付かない", () => {
    const result = categorize(base("zenn", { title: "TypeScriptの基礎" }));
    expect(result.category.series).toBeUndefined();
  });
});
