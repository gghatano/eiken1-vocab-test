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

// 状態をBase64でエンコードする関数
export function encodeStatus(status) {
  // ビット配列をバイト配列に変換
  const byteArray = new Uint8Array(Math.ceil(status.length / 8));
  
  for (let i = 0; i < status.length; i++) {
    if (status[i]) {
      const byteIndex = Math.floor(i / 8);
      const bitPosition = i % 8;
      byteArray[byteIndex] |= (1 << bitPosition);
    }
  }
  
  // バイト配列を文字列に変換
  const binary = [];
  for (let i = 0; i < byteArray.length; i++) {
    binary.push(String.fromCharCode(byteArray[i]));
  }
  const binaryString = binary.join('');
  
  // Base64エンコード
  return btoa(binaryString);
}

// Base64からの状態デコード関数
export function decodeStatus(encoded, totalWords = 3200) {
  const status = Array(totalWords).fill(false);
  
  try {
    // Base64デコード
    const binaryString = atob(encoded);
    const byteArray = new Uint8Array(binaryString.length);
    
    for (let i = 0; i < binaryString.length; i++) {
      byteArray[i] = binaryString.charCodeAt(i);
    }
    
    // バイト配列からビット配列へ変換
    for (let i = 0; i < totalWords; i++) {
      const byteIndex = Math.floor(i / 8);
      const bitPosition = i % 8;
      
      if (byteIndex < byteArray.length) {
        status[i] = ((byteArray[byteIndex] & (1 << bitPosition)) !== 0);
      }
    }
  } catch (e) {
    console.error('Base64デコードエラー:', e);
    
    // エラー時、旧フォーマット（16進数）のデコードを試みる
    try {
      for (let i = 0; i < encoded.length; i += 4) {
        const chunk = parseInt(encoded.substring(i, i + 4), 16);
        for (let j = 0; j < 16; j++) {
          const index = i / 4 * 16 + j;
          if (index < totalWords) {
            status[index] = ((chunk & (1 << j)) !== 0);
          }
        }
      }
    } catch (innerError) {
      console.error('旧フォーマットデコードエラー:', innerError);
      // どちらのデコードも失敗した場合は初期状態を返す
    }
  }
  
  return status;
}
