# コンテンツ取得方針 — プラットフォーム別

> 「GitHub の場合、独自でタグ付けや RSS 作成が必要か？」への回答と、
> 全プラットフォーム共通の決定フレームを記述する。
> 設計: [`03_design.md`](./03_design.md) / 要件: [`01_requirements.md`](./01_requirements.md)

## 1. 取得方式の決定フレーム（優先順位）

新しいプラットフォームを追加するときも、この順で判断する。

```
① 公式の構造化フィードがあるか？
   （RSS / Atom / JSON Feed / 公式API）
        └─ あり → それを使う（最優先・最も安定）

② なければ、自分が管理する場所に構造化データを「自前で」持たせられるか？
   （GitHubリポジトリの frontmatter / Topics / 自前 feed.json）
        └─ できる → 自分でソースを構造化し、ビルド時に読む

③ ①②が難しく、更新頻度が極端に低いか？
        └─ はい → repo 内 JSON で手動更新（許容）

④ 非公式API・スクレイピング
        └─ 原則 禁止（NFR-03）。動作が不安定なため採用しない。
```

**重要な原則**: GitHubリポジトリが存在するコンテンツは、可能な限り②を採用し自動取得に寄せる。
手動更新（③）は「GitHubリポジトリを持たない」かつ「更新頻度が極めて低い」場合のみ許容する。

## 2. プラットフォーム別 適用結果

| プラットフォーム | 取得方式 | カテゴリ/メタデータの源泉 | 更新 | MVP |
|---|---|---|---|---|
| **Zenn** | ②: GitHub frontmatter（`nekoneko02/zenn`） | `type`（tech/idea）/ `topics`（タグ）/ `emoji` | 自動 | ✅ |
| **note** | ①: 公式RSS | タイトル・日付（タグ無し → キーワードマッチ補完） | 自動 | ✅ |
| **Twitter/X** | 公式 embed（クライアント） | — | 自動 | ✅ |
| **Booth** | ③: `data/booth.json` 手動 | 手動付与 | 手動 | △ 手動枠 |
| **GitHub Pages（数学本）** | ②: Pages の `feed.json` → フォールバック: Topics | `feed.json` or Topics | 自動 | △ 後追い |
| **個人開発（プロダクト）** | ②→③: `neko-homepage` Topic → MVP期は手動 | Topics / 手動付与 | 自動（後追い） | △ 手動枠 |

## 3. Zenn の方針（GitHub frontmatter）

Zenn には公式 RSS（`https://zenn.dev/{username}/feed`）もあるが、
**カテゴリ自動化のために GitHub リポジトリの frontmatter を直接読むのが最良**（追加作業ゼロ）。

記事 md の先頭には次の構造化情報が必ず存在する:

```yaml
---
title: "記事タイトル"
emoji: "🐈"
type: "tech"            # tech → 領域=IT の直接判定
topics: ["typescript", "aws"]   # → カテゴリ自動付与に直接利用
published: true
---
```

- **取得**: GitHub Contents API（`GET /repos/nekoneko02/zenn/contents/articles`）でファイル一覧を取得、
  各ファイルを raw で取得して frontmatter をパース。
- **公開URL**: `https://zenn.dev/nekoneko02/articles/{slug}`（ファイル名＝slug）で構築。
- **カテゴリ**: `type: "tech"` → 領域=IT 確定。`topics` の値をキーワードマッチにかける（FR-08）。
- **追加作業なし**: 既存の `type`/`topics` をそのまま利用するだけ。
- **フォールバック**: Contents API 失敗 → 公式 RSS で最低限のタイトル/URLを取得。

## 4. note の方針

- **公式 RSS**（`https://note.com/{username}/rss`）を使用。タイトル・リンク・公開日・本文抜粋が取れる。
- **タグ情報は RSS に含まれない**。カテゴリは以下の優先順で自動判定（FR-08）:
  1. タイトルへのキーワードマッチ（ボルダリング、数学 等のキーワード）
  2. note の既定値（IT以外の生活系・趣味系が多い → 手動マッピング表は設けず、キーワード外は「その他」扱い）
- note のカテゴリ精度はZennより低くなるが許容。将来的に note 公式タグ取得手段が整備されれば改善する。

## 5. GitHub Pages（数学本）の方針 ← feed.json + フォールバック

ポイントは **「本の粒度」** で必要作業が変わる。

### ケースA: 本＝リポジトリ単位（最も軽い）
1冊＝1リポジトリの場合、**GitHub Topics のみで完結**（RSS/feed.json 不要）。

- 各リポジトリに規約 Topics を付ける（例: `neko-homepage`, `math`, `book`）
- 各リポジトリの `homepage` フィールドに Pages URL を設定
- 取得: `GET /users/nekoneko02/repos` で Topics フィルタ

### ケースB: 1リポジトリ内に複数の本/章がある
Topics はリポジトリ単位なので個別コンテンツを表現できない。
この場合はそのPages サイト内に **`feed.json`（JSON Feed）を自前生成**して設置する。

```jsonc
// https://{pages-domain}/feed.json（Pages ビルド時に自動生成する）
{
  "version": "https://jsonfeed.org/version/1.1",
  "title": "ねこエンジニア 数学書",
  "items": [
    { "id": "...", "title": "ゼロから学ぶ線形代数", "url": "...", "date_published": "2025-01-01",
      "tags": ["数学", "線形代数", "本"] }
  ]
}
```

- ホームページはそのURLをビルド時に取得する。
- **feed.json がない場合のフォールバック**: Topics のみで取得（ケースAと同じ）。
  章単位の詳細は取れないがリポジトリ単位の情報で表示する。
- この「feed.json あれば詳細、なければ Topics のみ」を**プラットフォーム全体のフォールバック設計の基本形**とする。

```
必要作業（ケースB）: Pages のビルドに feed.json 生成を1つ追加（自前サイトなので完全制御可能）
```

### MVP での扱い
MVP では数学本は `data/books.json` 手動枠で開始。
リポジトリが整備され次第、Topics（ケースA）または feed.json（ケースB）へ移行する。

## 6. GitHub リポジトリ全自動取得 長期方針（`neko-homepage` Topic）

**将来の目標**: 対象リポジトリに **`neko-homepage` Topic** を付与するだけで、
ホームページへの掲載が自動化される。

```
GET /users/nekoneko02/repos?per_page=100
→ topics に "neko-homepage" を持つリポジトリを抽出
→ description / homepage / topics / language / pushed_at を取得
→ feed.json があればアイテム詳細を取得、なければリポジトリ単位で1件
```

- **追加コスト**: リポジトリに Topic を1つ付けるだけ（GitHub UI から30秒）。
- **カテゴリ**: Topics の値をキーワードマッチにかけて自動判定（FR-08 と同一フレーム）。
  例: topics に `math` があれば 領域=数学、`book` があれば 種別=本。
- **公式API・認証**: パブリックリポジトリなら未認証でも動作。
  GitHub Actions では自動 `GITHUB_TOKEN` を使うとレート制限が 5,000回/時間に緩和される（設定不要）。

> **GITHUB_TOKEN についての補足**
> GitHubが GitHub Actions のジョブごとに自動発行するアクセストークン。
> `${{ secrets.GITHUB_TOKEN }}` で参照するだけで使える（PAT等の手動発行は不要）。
> パブリックリポジトリへのアクセスには必須ではないが、未認証だとレート制限が 60回/時間と厳しいため、
> GitHub Actions から叩く際は常にこれを使う運用を推奨する。

**MVPのスコープ**: 方針確定のみ。MVP 後の段階導入。

## 7. Booth の方針

- 公式の安定フィードが無く、更新頻度も低い → **repo 内 `data/booth.json` で手動更新（③）**。
- **手順は1行追記するだけ**（NFR-02）。

```jsonc
// data/booth.json（手動管理・最小構成）
[
  {
    "title": "ゼロから学ぶ〇〇",
    "url": "https://nekoneko02.booth.pm/items/xxxx",
    "publishedAt": "2025-01-01",
    "tags": ["数学", "本"],
    "thumbnail": "https://..."
  }
]
```

## 8. 個人開発（プロダクト）の方針

- **長期**: `neko-homepage` Topic で自動取得（§6）。
- **MVP**: `data/products.json` 手動枠で開始。データ構造は §6 と共通なので切替コストは小さい。

## 9. 障害耐性（共通）

- 外部取得（Zenn/note/GitHub）はビルド時に失敗しうる。
- **ソース単位でフォールバック**: 失敗したソースのみ直近スナップショット（`content-cache/*.json`）から読む。
  他ソースは正常に取得された値を使用し、ビルドを止めない（FR-09 / NFR-05）。
- スナップショットは取得成功のたびに上書き更新し、repo にコミットしておく（初回は空）。
