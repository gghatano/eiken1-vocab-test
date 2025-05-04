# 英検1級単語データ追加ガイド

このアプリケーションは、英検1級の約3200語の単語テストを実施するためのものです。以下に、単語データを追加・カスタマイズする方法を説明します。

## 単語データ形式

単語データは `data/vocabulary.js` ファイルに JSON 形式で保存されています。各単語は以下の形式で定義されています：

```javascript
{
  word: "英単語",
  meaning: "日本語の意味（正解）",
  options: [
    "日本語の意味（正解）",
    "不正解の選択肢1",
    "不正解の選択肢2",
    "不正解の選択肢3"
  ]
}
```

## 単語データの追加方法

### 方法1: vocabularyData 配列に直接追加

`data/vocabulary.js` ファイルを開き、`vocabularyData` 配列に直接単語オブジェクトを追加します。

### 方法2: データ生成スクリプトを使用

1. CSVなどの形式で単語データを準備します。
2. `scripts/generate-vocabulary.js` スクリプトを修正して、CSVからデータを読み込み、正しい形式に変換します。
3. `npm run generate-vocab` コマンドを実行してデータファイルを生成します。

## CSV形式のサンプル

以下のようなCSV形式でデータを準備すると便利です：

```
word,meaning,option1,option2,option3
abate,弱まる、減少する,無効にする,放棄する,中止する
abdicate,放棄する、退位する,誘拐する,無効にする,吸収する
aberrant,異常な、逸脱した,明白な,混乱した,荒廃した
```

これを読み込むスクリプトのサンプル：

```javascript
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// CSVファイルを読み込む関数
function readVocabularyFromCSV(csvFilePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (data) => {
        // CSVの各行を適切な形式に変換
        const vocabularyItem = {
          word: data.word,
          meaning: data.meaning,
          options: [
            data.meaning,  // 正解の選択肢
            data.option1,
            data.option2,
            data.option3
          ]
        };
        results.push(vocabularyItem);
      })
      .on('end', () => {
        resolve(results);
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}

// 使用例
async function generateVocabularyFile() {
  try {
    const vocabulary = await readVocabularyFromCSV('./data/vocabulary.csv');
    console.log(`読み込んだ単語数: ${vocabulary.length}`);
    
    // 出力ファイルに書き込み
    // ...
  } catch (error) {
    console.error('エラー:', error);
  }
}
```

## 大量のデータを効率的に扱う方法

3200語という大量のデータを扱うため、以下のような最適化を検討できます：

1. **分割読み込み**: すべての単語を最初に読み込むのではなく、必要に応じて分割して読み込む
2. **インデックス化**: 単語をアルファベット順や難易度順にインデックス化して素早くアクセスできるようにする
3. **ローカルストレージの最適化**: 進捗状況の保存方法を工夫する（現在のパスワード方式を使用）

## 独自の単語リストを作成する際の注意点

1. 正解の選択肢は必ず `options` 配列の最初の要素に配置する
2. 4つの選択肢はなるべく紛らわしいものを選ぶと良い学習効果が得られます
3. 単語数が多い場合は、意味が似ている単語をグループ化すると学習効果が高まります

## 参考：英検1級の単語リソース

英検1級の単語リストを作成する際に参考になるリソース：

- 英検公式サイトの単語リスト
- 市販の英検1級対策参考書
- オンライン英語学習サイトの単語リスト

適切な著作権に配慮しながら、これらのリソースを参考にしてください。
