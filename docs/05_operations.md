# 運用手順書 — ねこエンジニア ホームページ

> 設計: [`03_design.md`](./03_design.md) / 取得方針: [`04_content-sources.md`](./04_content-sources.md)

## 1. 概要

本ホームページは **「できる限り更新しなくてよい」** 設計です。

| コンテンツ | 更新方法 | 頻度 |
|---|---|---|
| Zenn 記事 | 自動（毎日 21:00 JST 再ビルド） | 放置でOK |
| note 記事 | 自動（同上） | 放置でOK |
| Booth 同人誌 | 手動（JSON 1行追記） | 出版時のみ |
| 数学本（GitHub Pages） | 手動（JSON 1行追記） | 出版時のみ |
| 個人開発プロダクト | 手動（JSON 1行追記） | リリース時のみ |

---

## 2. 自動更新（Zenn / note）

### 仕組み

GitHub Actions が毎日 **21:00 JST**（UTC 12:00）に起動し、  
Zenn と note の最新コンテンツを取得して差分があれば Amplify 再ビルドを Webhook でトリガーします。

```
スケジューラ（GitHub Actions cron）
  → 差分チェック（scripts/check-content-diff.js）
  → 差分あり → Amplify Webhook → 再ビルド → 自動デプロイ
```

### やること（定常）

**何もしなくてよい。** Zenn や note に記事を投稿するだけで、翌日 21:00 JST 以降に自動反映されます。

### 手動で今すぐ反映したいとき

GitHub Actions の **workflow_dispatch** から手動実行します。

1. GitHub リポジトリ → **Actions** タブ
2. 左ペイン: **Scheduled Rebuild** を選択
3. **Run workflow** ボタン → **Run workflow** を実行

### GitHub Actions に必要な Secrets

Amplify Console の「Webhook」URLを取得し、GitHub Secrets に登録してください。

| Secret 名 | 値 | 取得場所 |
|---|---|---|
| `AMPLIFY_BUILD_WEBHOOK` | `https://webhooks.amplify.ap-northeast-1.amazonaws.com/prod/webhooks?id=...` | Amplify Console → App → Webhooks |

---

## 3. 手動コンテンツ追加

### 3.1 Booth 同人誌を追加する

`data/booth.json` に1オブジェクトを追記して `git push` するだけです。

```jsonc
// data/booth.json
[
  {
    "title": "ゼロから学ぶ〇〇",           // 必須: タイトル
    "url": "https://neko-engineer.booth.pm/items/xxxx",  // 必須: Booth の商品URL
    "publishedAt": "2025-01-01",           // 任意: YYYY-MM-DD（降順ソートに使用）
    "tags": ["数学", "本"],                // 任意: カテゴリ自動判定に使用
    "thumbnail": "https://...",            // 任意: サムネイル画像URL
    "excerpt": "〇〇についての入門書です。" // 任意: 説明文
  }
]
```

**手順:**
1. `data/booth.json` を開く
2. 配列の末尾に上記フォーマットでオブジェクトを追記
3. `git commit -m "add: Booth 同人誌「タイトル」を追加" && git push`
4. Amplify が自動デプロイ（push トリガー）

### 3.2 数学本（GitHub Pages）を追加する

`data/books.json` に同じフォーマットで追記します。

```jsonc
// data/books.json
[
  {
    "title": "ゼロから学ぶ線形代数",
    "url": "https://nekoneko02.github.io/linear-algebra/",
    "publishedAt": "2025-06-01",
    "tags": ["数学", "線形代数", "本"],
    "excerpt": "線形代数の入門書です。"
  }
]
```

> **将来的な自動化**: GitHub リポジトリに `neko-homepage` トピックを付けると自動取得に切り替わります（フェーズ3 対応予定）。

### 3.3 個人開発プロダクトを追加する

`data/products.json` に追記します。

```jsonc
// data/products.json
[
  {
    "title": "プロダクト名",
    "url": "https://your-product.example.com",
    "publishedAt": "2025-06-01",
    "tags": ["プロダクト"],
    "excerpt": "プロダクトの説明。"
  }
]
```

---

## 4. カテゴリ（領域）の自動判定ルール

コンテンツの「領域」は `content/category-rules.ts` のキーワードマッチで自動判定されます。

| 領域 | 代表キーワード |
|---|---|
| IT | typescript, python, aws, react, docker, プログラミング, 開発 ... |
| 数学 | 数学, math, 線形代数, 確率, 統計 ... |
| ボルダリング | ボルダリング, クライミング, boulder ... |
| プロダクト | プロダクト, サービス, リリース, startup ... |

キーワードを追加・修正したい場合は `content/category-rules.ts` を編集してください。

---

## 5. プロフィール情報の変更

`data/profile.ts` を編集して `git push` するだけです。

```ts
// data/profile.ts
export const profile = {
  name: "ねこエンジニア",
  handle: "@neko_engineer_",
  tagPill: "エンジニア × 数学 × ボルダリング",
  headline: "ITと数学と\nボルダリングが\n好きなエンジニア",
  bio: "Zenn・note・同人誌・個人プロダクトで情報発信中。...",
  links: {
    zenn: "https://zenn.dev/neko_student",
    note: "https://note.com/alg_geo",
    booth: "https://neko-engineer.booth.pm",
    github: "https://github.com/nekoneko02",
    twitter: "https://twitter.com/neko_engineer_",
  },
  twitterHandle: "neko_engineer_",
};
```

---

## 6. 環境変数の管理

### ローカル開発

`.env.local.example` をコピーして `.env.local` を作成します。

```bash
cp .env.local.example .env.local
```

`.env.local` は `.gitignore` に含まれているため、リポジトリにはコミットされません。

### Amplify Hosting（本番）

Amplify Console → App → **Environment variables** で設定します。

| 変数 | 設定値 | 必須 |
|---|---|---|
| `ZENN_GH_REPO` | `nekoneko02/zenn`（GitHub アカウント名/リポジトリ名） | ✅ |
| `ZENN_USERNAME` | `neko_student`（Zenn の公開URLで使うユーザー名） | ✅ |
| `NOTE_RSS_URL` | `https://note.com/alg_geo/rss` | ✅ |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | `G-XXXXXXXXXX` | ✅（本番） |
| `GITHUB_TOKEN` | GitHub PAT（read:public_repo） | 推奨 |

---

## 7. ローカルでビルドする

```bash
# 依存パッケージのインストール（初回・package.json 変更後）
npm install

# 開発サーバー起動（ホットリロード）
npm run dev
# → http://localhost:3000 で確認

# 本番ビルド（SSG）
npm run build
# → out/ に静的ファイルが生成される

# ビルド結果の確認
npx serve out
```

---

## 8. トラブルシューティング

### Zenn コンテンツが表示されない

- `ZENN_GH_REPO` が正しく設定されているか確認（例: `neko_student/zenn`）
- GitHub API のレート制限に引っかかっている可能性 → `GITHUB_TOKEN` を設定するとレート上限が 60→5000/時間に緩和
- `content-cache/zenn.json` に前回ビルドのスナップショットが残っていれば、それが表示される

### note コンテンツが表示されない

- `NOTE_RSS_URL` が正しいか確認（例: `https://note.com/alg_geo/rss`）
- note の RSS が 404 → ユーザー名を確認

### 再ビルドが起きない

- GitHub Secrets の `AMPLIFY_BUILD_WEBHOOK` が正しく設定されているか確認
- Amplify Console → Webhooks でURLを再取得して更新
