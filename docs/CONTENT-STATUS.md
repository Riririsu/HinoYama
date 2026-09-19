# 掲載情報の確認状況（CONTENT STATUS）

デモ公開時点で **確認できている情報だけを断定的に掲載** しています。
未確認の項目は架空の値を入れず「要確認」チップ（`<span class="tbc">`）で表示しています。

## 確認済み（公開情報・店舗公式Instagram由来）

| 項目 | 内容 | 出典 |
| --- | --- | --- |
| 店名 | 鹿児島ラーメン 火の山 | 店舗公式Instagram |
| 住所 | 〒899-5213 鹿児島県姶良市加治木町朝日町64 | 公開情報 |
| 開店日 | 2026年9月15日 | 店舗公式Instagram |
| 一杯の特徴 | 豚骨と魚介の旨味を重ねた一杯 | 店舗公式Instagram |
| 駐車場 | あり（台数は未確認） | 公開情報 |
| Instagram | @kagoshima.ramen.hinoyama | 店舗公式Instagram |

## 要確認（店舗ヒアリング後に差し替え）

| 項目 | 現在の表示 | 差し替え場所（index.html） |
| --- | --- | --- |
| ラーメン価格（並・大・特大） | 価格 要確認 | `#menu` の `.menu-card__price` 内 `.tbc` |
| トッピング内容・価格 | 内容・価格 要確認 | `#menu` の4枚目のカード |
| メニュー写真（4枚） | 仮素材 | `assets/img/ph-dish.svg`（カードごとに差し替え） |
| お知らせ本文 | 「掲載例」2件のみ | `#news` の `.news__item--sample`（実データに差し替え、または削除） |
| 営業時間 | 営業時間 要確認 | `#info` Open 行 |
| 定休日 | 定休日 要確認 | `#info` Closed 行 |
| 電話番号 | 電話番号 要確認 | `#info` Tel 行 |
| 駐車台数・区画 | 台数・区画は要確認 | `#info` Parking 行 ／ `#access` の `.access__point` |
| 注文方法（各席タブレット等） | 注文方法 要確認 | `#first-visit` STEP 05 |
| 目印・公共交通機関 | 要確認 | `#access` の `.access__point` |
| 写真（ラーメン／外観／駐車場／店内／Instagram投稿） | 仮素材 | `assets/img/ph-*.svg` |
| ロゴ | 仮マーク | `assets/img/logo-hinoyama.svg` |

### メニュー構成についての注意

ご提供いただいたワイヤーフレームには「チャーシューメン」「餃子」が含まれていましたが、
公開情報で提供を確認できないため **掲載していません**。
確認が取れ次第、`#menu` にカードを追加するだけで対応できます。

```html
<article class="menu-card">
  <img class="brushed" src="assets/img/ph-dish.svg" width="1200" height="900" loading="lazy" alt="">
  <h3 class="menu-card__name">メニュー名</h3>
  <p class="menu-card__price">￥000</p>
</article>
```

### 注文方法についての注意

各席のタブレット注文は第三者投稿にのみ確認できる情報のため、**公式情報として断定していません**。
店舗確認が取れ次第、STEP 05 の本文を次のように差し替えます。

```html
<p class="step__text">店内では各席のタブレットから注文します。</p>
```

## 差し替えの手順（価格の例）

```html
<!-- Before -->
<p class="menu-card__price"><span class="tbc">価格 要確認</span></p>

<!-- After -->
<p class="menu-card__price">￥000</p>
```

`.tbc` を価格テキストへ置き換えるだけで、レイアウトはそのまま使えます。
営業時間・電話番号が確定したら、`<head>` の JSON-LD にも
`openingHoursSpecification` / `telephone` を追記してください（**未確認のまま登録しない**）。
