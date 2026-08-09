# alvavinci corporate-site

`alvavinci.com` 向けの静的コーポレートサイトです。
ビルド工程を持たない HTML / CSS / JavaScript 構成で、日本語・英語のトップページと各事業紹介ページを個別の HTML として管理しています。

## デザイン方針

コンセプトは **High Voltage Laboratory**。
19世紀末の電気実験室と特許図面のトーンを、現代のAIエージェント基盤の説明に接続しています。

- 漆黒（`#05070a`）の紙面に、放電のシアン（`#7fe3ff`）と計器の真鍮（`#d8b25a`）を差す
- 見出しはセリフ体（Cormorant Garamond / Noto Serif JP）、ラベルと数値は等幅（IBM Plex Mono）
- セクションには `§ I` 〜 の通し番号、図版には `Fig. 01` のキャプションを付ける
- ヒーローの放電アニメーションは Canvas 2D の自前実装。外部ライブラリ依存はゼロ
- `prefers-reduced-motion: reduce` の環境では、アニメーションを静止画として描画する

## ページ構成

| ファイル | 役割 |
| --- | --- |
| `index.html` | 日本語トップページ。設計思想、事業領域、グループ体制、メッセージ |
| `sora-intelligence.html` | AI事業部 / Sora Intelligence |
| `corporate-development.html` | 事業開発 / 事業承継 |
| `real-estate.html` | 不動産事業 |
| `en/*.html` | 上記4ページの英語版 |

## 主要ファイル

| パス | 内容 |
| --- | --- |
| `assets/css/style.css` | サイト全体の共通スタイル。トークン定義から各コンポーネントまで一括管理 |
| `assets/js/script.js` | ヘッダー、モバイルドロワー、スクロールリビール、放電Canvas |
| `assets/images/alvin-mascot.*` | AIエージェントキャラクター Alvin |
| `assets/images/sora-icon.*` | AI事業部リード ソラ |
| `assets/legacy/*` | 現行HTMLからは参照されていない旧デザイン案の退避先 |
| `robots.txt` / `sitemap.xml` | クロール設定と公開ページ一覧 |
| `og-image.jpg` | OGP 共通画像 |

## ローカル確認

ビルドは不要です。静的ファイルとして配信すれば確認できます。

```bash
python3 -m http.server 8000
```

ブラウザで `http://localhost:8000/` を開いてください。
Google Fonts と Google Analytics はネットワーク接続時のみ有効です。

## 更新方針

- 共通 UI の変更は、まず `assets/css/style.css` のトークン（`:root`）を確認してください。配色・余白・書体はすべてここに集約しています
- ヘッダー・フッター・ナビゲーションは全 HTML に重複しています。導線を変更するときは8ページすべてに反映してください
- 各ページの `head` にタイトル、description、canonical、OGP、構造化データがあります。文言変更時は本文と `head` を必ず揃えてください
- 日英ページは `hreflang` とヘッダーの言語切り替えリンクを相互に更新してください
- 画像差し替え時は、パスだけでなく `alt`、`width`、`height` の整合も保ってください
- `sitemap.xml` の `lastmod` は公開更新に合わせて見直してください

## メディア事業・小説事業の廃止について（2026-08-09）

両事業の廃止に伴い、以下を削除しました。

**ファイル**

- `media.html` / `en/media.html`
- `novel.html` / `en/novel.html`
- `assets/media/` 配下の画像一式（SIGNAL / SKINLAB / emomon）
- `assets/images/epoch-quill-cutout.png` / `.webp`

**参照の除去**

- 全ページのナビゲーション、モバイルドロワー、フッターからのリンク
- 構造化データ（JSON-LD）の `department` の Epoch、`sameAs` の各Xブランド
- トップページの事業領域カード（通し番号を I〜V に振り直し）
- `sitemap.xml` の該当URL、各ページ `keywords` の関連語
- AIチーム体制図の「メディアAIチーム」ノード

### 旧URLのリダイレクト設定（未適用・要対応）

削除した4URLは検索エンジンにインデックスされている可能性があります。
公開サーバー側で 301 リダイレクトを設定してください。設定例は以下のとおりです。

**Netlify（`_redirects`）**

```
/media.html      /       301
/en/media.html   /en/    301
/novel.html      /       301
/en/novel.html   /en/    301
```

**Vercel（`vercel.json`）**

```json
{
  "redirects": [
    { "source": "/media.html", "destination": "/", "permanent": true },
    { "source": "/en/media.html", "destination": "/en/", "permanent": true },
    { "source": "/novel.html", "destination": "/", "permanent": true },
    { "source": "/en/novel.html", "destination": "/en/", "permanent": true }
  ]
}
```

**Apache（`.htaccess`）**

```apache
Redirect 301 /media.html /
Redirect 301 /en/media.html /en/
Redirect 301 /novel.html /
Redirect 301 /en/novel.html /en/
```

**Nginx**

```nginx
location = /media.html    { return 301 /; }
location = /en/media.html { return 301 /en/; }
location = /novel.html    { return 301 /; }
location = /en/novel.html { return 301 /en/; }
```

リダイレクトを設定できない環境の場合は、Google Search Console の削除ツールで該当URLの削除を申請してください。
