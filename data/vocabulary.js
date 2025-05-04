// 単語データ
// 英検1級の単語約3200語のサンプルデータ
// 本番環境では全3200語を入れる

export const vocabularyData = [
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
  {
    word: "abjure",
    meaning: "放棄する、撤回する",
    options: [
      "放棄する、撤回する",
      "誓う",
      "認める",
      "禁じる"
    ]
  },
  {
    word: "ablution",
    meaning: "身体を洗うこと",
    options: [
      "身体を洗うこと",
      "免除",
      "酩酊",
      "簡潔さ"
    ]
  },
  {
    word: "abnegate",
    meaning: "放棄する、否認する",
    options: [
      "放棄する、否認する",
      "悪化させる",
      "同化する",
      "助長する"
    ]
  },
  {
    word: "abominate",
    meaning: "忌み嫌う、憎む",
    options: [
      "忌み嫌う、憎む",
      "尊敬する",
      "許す",
      "称賛する"
    ]
  },
  {
    word: "aboriginal",
    meaning: "原住民の、土着の",
    options: [
      "原住民の、土着の",
      "異常な",
      "抽象的な",
      "絶対的な"
    ]
  }
  // 残りの単語は省略
];

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
