import React, { useState, useEffect } from 'react';
import { vocabularyData, encodeStatus, decodeStatus, shuffleVocabulary } from './data/vocabulary';
import Statistics from './components/Statistics';
import WordCard from './components/WordCard';
import PasswordManager from './components/PasswordManager';
import ResultDisplay from './components/ResultDisplay';

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
  const handlePasswordChange = (newPassword) => {
    setPassword(newPassword);
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
      return true;
    } catch (error) {
      return false;
    }
  };

  // リセット機能
  const resetProgress = () => {
    const newStatus = Array(TOTAL_WORDS).fill(false);
    setWordStatus(newStatus);
    setCorrectCount(0);
    setWrongCount(0);
    const newPassword = encodeStatus(newStatus);
    setPassword(newPassword);
    localStorage.setItem('vocabPassword', newPassword);
    startNewSession();
    return true;
  };

  // セッションの正解数を計算
  const sessionCorrect = currentSessionWords.filter((word) => {
    const wordIndex = vocabularyData.findIndex(item => item.word === word.word);
    return wordStatus[wordIndex];
  }).length;

  return (
    <div className="container">
      <header className="app-header">
        <h1 className="app-title">英検1級単語テスト</h1>
      </header>
      
      <Statistics 
        correctCount={correctCount} 
        totalWords={TOTAL_WORDS} 
        wrongCount={wrongCount} 
      />
      
      {!showResults ? (
        <>
          <WordCard 
            word={currentWord.word}
            options={shuffledOptions}
            selectedOption={selectedOption}
            isAnswered={isAnswered}
            correctMeaning={currentWord.meaning}
            onOptionClick={handleOptionClick}
            onNextClick={handleNextWord}
            isLastWord={currentWordIndex === currentSessionWords.length - 1}
          />
          
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentWordIndex + 1) / ITEMS_PER_SESSION) * 100}%` }}
            ></div>
          </div>
        </>
      ) : (
        <ResultDisplay 
          sessionCorrect={sessionCorrect}
          sessionTotal={ITEMS_PER_SESSION}
          totalCorrect={correctCount}
          totalWords={TOTAL_WORDS}
          onStartNewSession={startNewSession}
        />
      )}
      
      <PasswordManager 
        password={password}
        onPasswordChange={handlePasswordChange}
        onApplyPassword={applyPassword}
        onResetProgress={resetProgress}
      />

      <footer className="app-footer">
        <p>© 2025 英検1級単語テスト - <a href="https://github.com/gghatano/eiken1-vocab-test" target="_blank" rel="noopener noreferrer">GitHub</a></p>
      </footer>
    </div>
  );
}

export default App;