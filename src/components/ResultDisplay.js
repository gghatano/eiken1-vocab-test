import React from 'react';

const ResultDisplay = ({ 
  sessionCorrect, 
  sessionTotal, 
  totalCorrect, 
  totalWords, 
  onStartNewSession 
}) => {
  const sessionPercentage = Math.round((sessionCorrect / sessionTotal) * 100);
  const totalPercentage = Math.round((totalCorrect / totalWords) * 100);
  
  // 成績に応じたメッセージ
  let message = '';
  if (sessionPercentage === 100) {
    message = '素晴らしい！完璧です！';
  } else if (sessionPercentage >= 80) {
    message = '素晴らしい成績です！';
  } else if (sessionPercentage >= 60) {
    message = '良い成績です！';
  } else if (sessionPercentage >= 40) {
    message = 'もう少し頑張りましょう！';
  } else {
    message = '復習が必要です。次回も頑張りましょう！';
  }
  
  return (
    <div className="result-display">
      <h2>セッション結果</h2>
      
      <div className="result-message">{message}</div>
      
      <div className="result-stats">
        <div className="result-stat-box">
          <div className="result-stat-value">{sessionCorrect} / {sessionTotal}</div>
          <div className="result-stat-label">今回のセッションの正解</div>
          <div className="mini-progress-bar">
            <div 
              className="mini-progress-fill" 
              style={{ width: `${sessionPercentage}%` }}
            ></div>
          </div>
          <div className="result-stat-percentage">{sessionPercentage}%</div>
        </div>
        
        <div className="result-stat-box">
          <div className="result-stat-value">{totalCorrect} / {totalWords}</div>
          <div className="result-stat-label">全体の進捗状況</div>
          <div className="mini-progress-bar">
            <div 
              className="mini-progress-fill" 
              style={{ width: `${totalPercentage}%` }}
            ></div>
          </div>
          <div className="result-stat-percentage">{totalPercentage}%</div>
        </div>
      </div>
      
      {totalPercentage === 100 ? (
        <div className="completion-message">
          <h3>おめでとうございます！</h3>
          <p>英検1級の単語をすべてマスターしました！</p>
        </div>
      ) : (
        <p className="remaining-words">
          あと {totalWords - totalCorrect} 単語をマスターすれば完了です！
        </p>
      )}
      
      <button className="btn btn-large" onClick={onStartNewSession}>
        新しいセッション開始
      </button>
    </div>
  );
};

export default ResultDisplay;