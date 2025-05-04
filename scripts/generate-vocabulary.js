// スクリプト: 英検1級単語データ生成
// 実際に全3200語のデータを生成するためのスクリプト

const fs = require('fs');
const path = require('path');

// サンプル単語データ（実際のデータはもっと多くなります）
const sampleVocabulary = [
  {
    word: "abate",
    meaning: "弱まる、減少する",
    options: [
      "弱まる、減少する",
      "無効にする",
      "放棄する",
      "中止する"
    ]
  },
  {
    word: "abdicate",
    meaning: "放棄する、退位する",
    options: [
      "放棄する、退位する",
      "誘拐する",
      "無効にする",
      "吸収する"
    ]
  },
  {
    word: "aberrant",
    meaning: "異常な、逸脱した",
    options: [
      "異常な、逸脱した",
      "明白な",
      "混乱した",
      "荒廃した"
    ]
  },
  // ...前のデータ
  {
    word: "abeyance",
    meaning: "一時停止、中断",
    options: [
      "一時停止、中断",
      "従順",
      "軽蔑",
      "堪え忍ぶこと"
    ]
  },
  {
    word: "abject",
    meaning: "惨めな、卑屈な",
    options: [
      "惨めな、卑屈な",
      "優れた",
      "圧倒的な",
      "激しい"
    ]
  },
  // ...追加の単語
  {
    word: "accolade",
    meaning: "称賛、栄誉",
    options: [
      "称賛、栄誉",
      "受け入れる",
      "協力",
      "同席する"
    ]
  },
  {
    word: "acerbic",
    meaning: "酸っぱい、辛辣な",
    options: [
      "酸っぱい、辛辣な",
      "協力的な",
      "信用できる",
      "厳粛な"
    ]
  },
  {
    word: "acquiesce",
    meaning: "黙認する、黙って従う",
    options: [
      "黙認する、黙って従う",
      "手に入れる",
      "質問する",
      "和らげる"
    ]
  },
  {
    word: "acrimonious",
    meaning: "辛辣な、苦々しい",
    options: [
      "辛辣な、苦々しい",
      "素早い",
      "正確な",
      "狡猾な"
    ]
  },
  {
    word: "admonish",
    meaning: "忠告する、叱る",
    options: [
      "忠告する、叱る",
      "賞賛する",
      "認める",
      "崇拝する"
    ]
  },
  {
    word: "adroit",
    meaning: "器用な、巧みな",
    options: [
      "器用な、巧みな",
      "勇敢な",
      "頑固な",
      "柔軟な"
    ]
  },
  {
    word: "adulation",
    meaning: "過度の称賛、おべっか",
    options: [
      "過度の称賛、おべっか",
      "成人",
      "混合",
      "変化"
    ]
  },
  {
    word: "affluent",
    meaning: "豊かな、裕福な",
    options: [
      "豊かな、裕福な",
      "影響力のある",
      "流暢な",
      "慈悲深い"
    ]
  },
  {
    word: "aggrandize",
    meaning: "誇張する、大きく見せる",
    options: [
      "誇張する、大きく見せる",
      "悪化させる",
      "怒らせる",
      "集める"
    ]
  },
  {
    word: "alacrity",
    meaning: "快活さ、機敏さ",
    options: [
      "快活さ、機敏さ",
      "警戒",
      "恐怖",
      "無気力"
    ]
  },
  {
    word: "altruism",
    meaning: "利他主義、献身",
    options: [
      "利他主義、献身",
      "高度、高さ",
      "謙虚さ",
      "利己主義"
    ]
  },
  {
    word: "ameliorate",
    meaning: "改善する、向上させる",
    options: [
      "改善する、向上させる",
      "悪化させる",
      "分析する",
      "拡大する"
    ]
  },
  {
    word: "amiable",
    meaning: "愛想のよい、親切な",
    options: [
      "愛想のよい、親切な",
      "熱意のある",
      "変わりやすい",
      "思慮深い"
    ]
  },
  {
    word: "amorphous",
    meaning: "不定形の、形のない",
    options: [
      "不定形の、形のない",
      "活発な",
      "眠気を催す",
      "愛情深い"
    ]
  },
  {
    word: "anachronism",
    meaning: "時代錯誤、時代遅れ",
    options: [
      "時代錯誤、時代遅れ",
      "権威",
      "君主制",
      "簡潔さ"
    ]
  },
  {
    word: "analogous",
    meaning: "類似した、相似の",
    options: [
      "類似した、相似の",
      "理性的な",
      "分析的な",
      "古代の"
    ]
  }
];

// より多くの単語を生成するための関数（実際の実装ではCSVや外部ソースからデータを読み込むなど）
function generateFullVocabulary() {
  // この関数では実際の3200語を生成します
  // ここでは簡単のためサンプルデータを返します
  
  console.log('生成した単語数:', sampleVocabulary.length);
  return sampleVocabulary;
}

// データファイルを生成
function writeVocabularyFile() {
  const vocabulary = generateFullVocabulary();
  
  const outputContent = `// 英検1級単語データ
// 単語数: ${vocabulary.length}

export const vocabularyData = ${JSON.stringify(vocabulary, null, 2)};

// 全単語の正解/不正解の状態を初期化する関数
export function initializeVocabularyStatus(totalWords = 3200) {
  return Array(totalWords).fill(false);
}

// 単語リストをシャッフルする関数
export function shuffleVocabulary(vocabulary) {
  const shuffled = [...vocabulary];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// 状態をエンコードする関数
export function encodeStatus(status) {
  // 各ビットを16ビットの整数に変換し、それを16進数で表現
  let encoded = '';
  for (let i = 0; i < status.length; i += 16) {
    let chunk = 0;
    for (let j = 0; j < 16 && i + j < status.length; j++) {
      if (status[i + j]) {
        chunk |= (1 << j);
      }
    }
    encoded += chunk.toString(16).padStart(4, '0');
  }
  return encoded;
}

// 状態をデコードする関数
export function decodeStatus(encoded, totalWords = 3200) {
  const status = Array(totalWords).fill(false);
  for (let i = 0; i < encoded.length; i += 4) {
    const chunk = parseInt(encoded.substring(i, i + 4), 16);
    for (let j = 0; j < 16; j++) {
      const index = i * 4 + j;
      if (index < totalWords) {
        status[index] = ((chunk & (1 << j)) !== 0);
      }
    }
  }
  return status;
}
`;

  const outputPath = path.join(__dirname, '..', 'data', 'vocabulary.js');
  fs.writeFileSync(outputPath, outputContent, 'utf8');
  
  console.log(`単語データファイルを生成しました: ${outputPath}`);
  console.log(`合計: ${vocabulary.length} 単語`);
}

// スクリプト実行
writeVocabularyFile();
