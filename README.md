# alvavinci corporate-site

`alvavinci.com` 向けの静的コーポレートサイトです。  
ビルド工程を持たない HTML / CSS / JavaScript 構成で、トップページと各事業紹介ページを個別の HTML として管理しています。

## 概要

- ルートの `index.html` がトップページです
- 下層ページとして `real-estate.html`、`corporate-development.html`、`media.html`、`sora-intelligence.html` を持ちます
- 共通スタイルは `assets/css/style.css`、共通挙動は `assets/js/script.js` に集約されています
- 各ページに SEO 用メタタグ、OGP、構造化データ、Google Analytics を直接埋め込んでいます
- 画像やアイコンは `assets/` とルート直下の favicon / OGP 画像で管理しています

## ページ構成

| ファイル | 役割 |
| --- | --- |
| `index.html` | 日本語トップページ。AIエージェントを中心とした業務設計、事業一覧、グループ体制、メッセージを掲載 |
| `real-estate.html` | 不動産投資ページ |
| `corporate-development.html` | 事業開発 / 事業承継ページ |
| `media.html` | メディア事業ページ。X ブランド紹介を掲載 |
| `sora-intelligence.html` | AI事業部ページ |

## 主要ファイル

| パス | 内容 |
| --- | --- |
| `assets/css/style.css` | サイト全体の共通スタイル。トップページと下層ページの両方を含む |
| `assets/js/script.js` | ヘッダースクロール、モバイルメニュー、スムーススクロール、フェードイン、トップの canvas アニメーションを担当 |
| `assets/images/alvin-mascot.png` | AIエージェントキャラクター Alvin の画像 |
| `assets/media/*` | メディア事業ページ用画像 |
| `assets/legacy/*` | 参照されていない旧トップ案のCSS / JS、旧画像 |
| `robots.txt` | クロール許可と sitemap の案内 |
| `sitemap.xml` | 公開ページ一覧 |
| `og-image.jpg` | OGP 共通画像 |

## ローカル確認

ビルドは不要です。静的ファイルとして配信すれば確認できます。

例:

```bash
python3 -m http.server 8000
```

ブラウザで `http://localhost:8000/` を開いて確認してください。

補足:

- Google Fonts と Google Analytics はネットワーク接続時のみ有効です

## 更新方針

- 共通 UI 変更はまず `assets/css/style.css` と `assets/js/script.js` への影響を確認してください
- 各ページの `head` にはタイトル、description、canonical、OGP、構造化データがあるため、ページ追加や文言変更時は本文だけでなく `head` も合わせて更新してください
- ナビゲーションとフッターのリンクは各 HTML に重複しているため、導線変更時は関連ページを横断して反映が必要です
- 画像差し替え時は、パスだけでなく `alt`、`width`、`height` の整合も保ってください
- `sitemap.xml` の `lastmod` は公開更新に合わせて見直してください

## 既知の構成メモ

- `assets/legacy/index.css` と `assets/legacy/index.js` は、現行の主要 HTML からは参照されていません
- 旧デザイン案または未使用ファイルの退避先です。削除や再利用の前に運用実態を確認してください

## 運用上の注意

- このリポジトリにはパッケージ管理ファイルやビルド設定は含まれていません
- そのため、変更の中心は HTML の文言更新、画像差し替え、共通 CSS / JS の調整です
- 大きな改修を行う場合でも、まずは個別ページの差分を小さく保つ方が保守しやすい構成です
