# alvavinci corporate-site

`alvavinci.com` 向けの静的コーポレートサイトです。
ビルド工程を持たない HTML / CSS / JavaScript 構成で、日本語・英語のトップページと各事業紹介ページを個別の HTML として管理しています。

## デザイン方針

コンセプトは **Kinetic Console**。
AIエージェントの稼働感を、明るい紙面とモジュール式のカード、コンソール表示で表現しています。

- ラベンダー（`#F3F0FF`）を背景に、白いカードと濃色のコンソール面を組み合わせる
- ブランドの紫（`#5B2E96`）とライム（`#C6FF3D`）をアクセントに使う
- 見出しは Zen Kaku Gothic New、英字は Outfit、ラベルと数値は Space Grotesk を使う
- セクション番号は `01 / ABOUT` の形式で統一する
- `prefers-reduced-motion: reduce` の環境では、スクロール演出とアニメーションを抑制する

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
| `assets/js/script.js` | モバイルドロワーとスクロールリビール |
| `assets/images/brand-mark.png` | ヘッダーとフッターで使用するブランドマーク |
| `assets/images/alvin-mascot.*` | AIエージェントキャラクター Alvin |
| `assets/images/sora-icon.*` | AI事業部リード ソラ |
| `assets/legacy/*` | 現行HTMLから参照されない旧デザイン案の退避先 |
| `robots.txt` / `sitemap.xml` | クロール設定と公開ページ一覧 |
| `og-image.jpg` | 新デザインに合わせた 1200 × 630 px のOGP共通画像 |

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
