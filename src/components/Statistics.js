import React from 'react';

const Statistics = ({ correctCount, totalWords, wrongCount }) => {
  const progressPercentage = Math.round((correctCount / totalWords) * 100);
  
  return (
    <div className="statistics">
      <h3>学習進捗状況</h3>
      
      <div className="stats-container">
        <div className="stat-item">
          <div className="stat-value">{correctCount}</div>
          <div className="stat-label">正解</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-value">{wrongCount}</div>
          <div className="stat-label">不正解</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-value">{progressPercentage}%</div>
          <div className="stat-label">進捗</div>
        </div>
      </div>
      
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      
      <div className="stats-details">
        <div className="detail-item">
          <span className="detail-label">残りの単語:</span> 
          <span className="detail-value">{totalWords - correctCount}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">完了済み:</span> 
          <span className="detail-value">{correctCount} / {totalWords}</span>
        </div>
      </div>
    </div>
  );
};

export default Statistics;