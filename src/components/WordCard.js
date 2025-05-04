import React from 'react';

const WordCard = ({ 
  word, 
  options, 
  selectedOption, 
  isAnswered, 
  correctMeaning, 
  onOptionClick, 
  onNextClick,
  isLastWord
}) => {
  return (
    <div className="word-card">
      <div className="word">{word}</div>
      
      <div className="options">
        {options.map((option, index) => (
          <div 
            key={index}
            className={`option ${selectedOption === option ? 'selected' : ''} ${
              isAnswered && option === correctMeaning ? 'correct' : 
              isAnswered && selectedOption === option ? 'incorrect' : ''
            }`}
            onClick={() => onOptionClick(option)}
          >
            {option}
          </div>
        ))}
      </div>
      
      <div className="answer-result">
        {isAnswered && selectedOption === correctMeaning && (
          <div className="correct-message">正解！</div>
        )}
        {isAnswered && selectedOption !== correctMeaning && (
          <div className="incorrect-message">
            <p>不正解</p>
            <p>正解: {correctMeaning}</p>
          </div>
        )}
      </div>
      
      <div className="buttons">
        {isAnswered ? (
          <button className="btn btn-next" onClick={onNextClick}>
            {isLastWord ? '結果を見る' : '次の単語'}
          </button>
        ) : (
          <button className="btn" disabled>
            回答を選択してください
          </button>
        )}
      </div>
    </div>
  );
};

export default WordCard;