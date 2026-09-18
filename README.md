# 鹿児島ラーメン 火の山｜提案用デモサイト

RIKKUN WEB STUDIO が **鹿児島ラーメン 火の山** 様へ営業提案するために制作したデモサイトです。
店舗の公式サイトではありません（ページ最上部・フッターに `PROPOSAL DEMO` を明記しています）。

## このサイトの役割

Instagram / Google検索 / Googleマップで火の山を知った人が、

> どんなラーメン？ → いくら？ → 今日営業してる？ → 駐車場ある？ → どこ？ → 行こう

まで迷わず進めるようにするための「Web上の店舗案内所」です。
サイト自体が目的ではなく、**来店（Googleマップへの送客）** がゴールです。

- PRIMARY CTA … 「Googleマップで経路を見る」（Hero / アクセス / 最終CTA / スマホ固定バー）
- SECONDARY CTA … 「メニューを見る」「Instagramで最新情報を見る」
- 予約機能・問い合わせフォームは意図的に実装していません。

## 構成

```
index.html                  1ページ完結（Hero → 一杯 → メニュー → はじめて → 店舗情報 → アクセス → Instagram → 最終CTA）
assets/css/style.css        スタイル（白・黒・赤／山のロゴを根拠にしたデザイン）
assets/js/main.js           スクロール表示・ステップの赤いライン・スマホ固定CTA
assets/img/*.svg            仮素材（写真プレースホルダー・ロゴ仮マーク）
docs/CONTENT-STATUS.md      掲載情報の確認状況／差し替え手順
```

ビルド不要の静的サイトです。ローカル確認：

```bash
python3 -m http.server 8000   # → http://localhost:8000
```

## 掲載情報の扱い

価格・営業時間・定休日・電話番号・駐車台数などは、公開情報から確定できないため
**架空の値を入れず「要確認」と表示**しています。店舗確認後の差し替え箇所は
[docs/CONTENT-STATUS.md](docs/CONTENT-STATUS.md) にまとめています。

## 実案件化するときの作業

1. `index.html` の `<meta name="robots" content="noindex, nofollow">` を削除（デモ中は検索避け）
2. 最上部の `.demo-bar` とフッターの `.foot__demo` を削除
3. 写真プレースホルダーを店舗撮影データへ差し替え（WebP/AVIF 推奨、`width`/`height` は維持してCLSを防ぐ）
4. ロゴ仮マーク `assets/img/logo-hinoyama.svg` を正式ロゴデータへ差し替え
5. 「要確認」項目を確定情報へ差し替え、構造化データ（JSON-LD）に営業時間・電話番号を追記
