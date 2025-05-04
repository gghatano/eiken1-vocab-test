import React, { useState, useEffect, useRef } from 'react';
import { vocabularyData, encodeStatus, decodeStatus, shuffleVocabulary } from '../data/vocabulary';

const TOTAL_WORDS = vocabularyData.length; // 本番では3200になる予定
const ITEMS_PER_SESSION = 10; // 1回のセッションで出題する単語数

function App() {
  // 状態を管理するステート
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [currentSessionWords, setCurrentSessionWords] = useState([]);
  const [wordStatus, setWordStatus] = useState(Array(TOTAL_WORDS).fill(false));
  const [password, setPassword] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');
  const passwordRef = useRef(null);

  // 初期化時にセッションの単語を選択
  useEffect(() => {
    startNewSession();
  }, []);

  // ローカルストレージから状態を復元する
  useEffect(() => {
    const savedPassword = localStorage.getItem('vocabPassword');
    if (savedPassword) {
      setPassword(savedPassword);
      const decodedStatus = decodeStatus(savedPassword, TOTAL_WORDS);
      setWordStatus(decodedStatus);
      
      // 正解数と不正解数を計算
      const correct = decodedStatus.filter(status => status).length;
      setCorrectCount(correct);
      setWrongCount(TOTAL_WORDS - correct);
    }
  }, []);

  // 新しいセッションを開始する
  const startNewSession = () => {
    const shuffled = shuffleVocabulary(vocabularyData);
    
    // まだ正解していない単語を優先的に選ぶ
    const notCorrectWords = shuffled.filter((_, index) => !wordStatus[index]);
    
    // もし未正解の単語が足りない場合は、すべての単語からランダムに選ぶ
    let sessionWords;
    if (notCorrectWords.length >= ITEMS_PER_SESSION) {
      sessionWords = notCorrectWords.slice(0, ITEMS_PER_SESSION);
    } else {
      sessionWords = [
        ...notCorrectWords,
        ...shuffled.filter((_, index) => wordStatus[index]).slice(0, ITEMS_PER_SESSION - notCorrectWords.length)
      ];
    }
    
    setCurrentSessionWords(sessionWords);
    setCurrentWordIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setSessionCompleted(false);
    setShowResults(false);
  };

  // 現在の単語情報を取得
  const currentWord = currentSessionWords[currentWordIndex] || vocabularyData[0];
  
  // 選択肢をシャッフル
  const shuffledOptions = [...currentWord.options].sort(() => Math.random() - 0.5);

  // 選択肢がクリックされたときの処理
  const handleOptionClick = (option) => {
    if (isAnswered) return;
    
    setSelectedOption(option);
    setIsAnswered(true);
    
    const isCorrect = option === currentWord.meaning;
    const wordIndex = vocabularyData.findIndex(item => item.word === currentWord.word);
    
    // 正解の場合のみステータスを更新
    if (isCorrect && !wordStatus[wordIndex]) {
      const newStatus = [...wordStatus];
      newStatus[wordIndex] = true;
      setWordStatus(newStatus);
      setCorrectCount(prev => prev + 1);
      
      // パスワードを更新して保存
      const newPassword = encodeStatus(newStatus);
      setPassword(newPassword);
      localStorage.setItem('vocabPassword', newPassword);
    } else if (!isCorrect) {
      setWrongCount(prev => prev + 1);
    }
  };

  // 次の単語に進む
  const handleNextWord = () => {
    if (currentWordIndex < currentSessionWords.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setSessionCompleted(true);
      setShowResults(true);
    }
  };

  // パスワードが変更されたときの処理
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    // クリップボードコピーの成功メッセージをクリア
    setCopySuccess('');
  };

  // パスワードをクリップボードにコピーする
  const copyToClipboard = () => {
    if (passwordRef.current) {
      passwordRef.current.select();
      try {
        document.execCommand('copy');
        setCopySuccess('コピーしました！');
        // 数秒後にメッセージを消す
        setTimeout(() => setCopySuccess(''), 3000);
      } catch (err) {
        setCopySuccess('コピーに失敗しました。');
      }
      // 選択状態を解除
      window.getSelection().removeAllRanges();
    }
  };

  // パスワードを適用する
  const applyPassword = () => {
    try {
      const decodedStatus = decodeStatus(password, TOTAL_WORDS);
      setWordStatus(decodedStatus);
      
      // 正解数と不正解数を計算
      const correct = decodedStatus.filter(status => status).length;
      setCorrectCount(correct);
      setWrongCount(TOTAL_WORDS - correct);
      
      localStorage.setItem('vocabPassword', password);
      setCopySuccess('進捗状況を復元しました！');
      setTimeout(() => setCopySuccess(''), 3000);
    } catch (error) {
      setCopySuccess('無効なパスワードです。正しいパスワードを入力してください。');
      setTimeout(() => setCopySuccess(''), 3000);
    }
  };

  // リセット機能
  const resetProgress = () => {
    if (window.confirm('本当に進捗をリセットしますか？この操作は元に戻せません。')) {
      const newStatus = Array(TOTAL_WORDS).fill(false);
      setWordStatus(newStatus);
      setCorrectCount(0);
      setWrongCount(0);
      const newPassword = encodeStatus(newStatus);
      setPassword(newPassword);
      localStorage.setItem('vocabPassword', newPassword);
      startNewSession();
    }
  };

  // 結果画面の表示
  const renderResults = () => {
    const sessionCorrect = currentSessionWords.filter((word, index) => {
      const wordIndex = vocabularyData.findIndex(item => item.word === word.word);
      return wordStatus[wordIndex];
    }).length;
    
    return (
      <div className="result-display">
        <h2>セッション結果</h2>
        <p>今回のセッションで {sessionCorrect} / {ITEMS_PER_SESSION} 問正解しました！</p>
        <p>全体の進捗状況: {correctCount} / {TOTAL_WORDS} 問正解 ({Math.round((correctCount / TOTAL_WORDS) * 100)}%)</p>
        
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(correctCount / TOTAL_WORDS) * 100}%` }}
          ></div>
        </div>
        
        <button className="btn" onClick={startNewSession}>新しいセッション開始</button>
      </div>
    );
  };

  return (
    <div className="container">
      <h1>英検1級単語テスト</h1>
      
      <div className="stats">
        <div>正解: {correctCount}</div>
        <div>不正解: {wrongCount}</div>
        <div>進捗: {Math.round((correctCount / TOTAL_WORDS) * 100)}%</div>
      </div>
      
      {!showResults ? (
        <>
          <div className="word-card">
            <div className="word">{currentWord.word}</div>
            
            <div className="options">
              {shuffledOptions.map((option, index) => (
                <div 
                  key={index}
                  className={`option ${selectedOption === option ? 'selected' : ''} ${
                    isAnswered && option === currentWord.meaning ? 'correct' : 
                    isAnswered && selectedOption === option ? 'incorrect' : ''
                  }`}
                  onClick={() => handleOptionClick(option)}
                >
                  {option}
                </div>
              ))}
            </div>
            
            <div className="buttons">
              {isAnswered ? (
                <button className="btn btn-next" onClick={handleNextWord}>
                  {currentWordIndex < currentSessionWords.length - 1 ? '次の単語' : '結果を見る'}
                </button>
              ) : (
                <button className="btn" disabled>
                  回答を選択してください
                </button>
              )}
            </div>
          </div>
          
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentWordIndex + 1) / ITEMS_PER_SESSION) * 100}%` }}
            ></div>
          </div>
        </>
      ) : (
        renderResults()
      )}
      
      <div className="password-section">
        <h3>進捗管理（パスワード）</h3>
        <p>下記のパスワードをコピーして保存すると、後でこのパスワードを使って進捗状況を復元できます。</p>
        
        <div className="password-container">
          <input 
            type="text" 
            ref={passwordRef}
            value={password}
            onChange={handlePasswordChange}
            placeholder="パスワードを入力または保存してください"
          />
          <button className="btn btn-copy" onClick={copyToClipboard}>
            コピー
          </button>
        </div>
        
        {copySuccess && <div className="copy-message">{copySuccess}</div>}
        
        <div className="password-buttons">
          <button className="btn" onClick={applyPassword}>パスワードを適用</button>
          <button className="btn btn-danger" onClick={resetProgress}>
            進捗リセット
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
