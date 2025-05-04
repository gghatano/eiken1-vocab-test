import React, { useRef, useState } from 'react';

const PasswordManager = ({ password, onPasswordChange, onApplyPassword, onResetProgress }) => {
  const [copySuccess, setCopySuccess] = useState('');
  const passwordRef = useRef(null);
  
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

  const handlePasswordApply = () => {
    onApplyPassword();
    setCopySuccess('進捗状況を復元しました！');
    setTimeout(() => setCopySuccess(''), 3000);
  };

  return (
    <div className="password-section">
      <h3>進捗管理（パスワード）</h3>
      <p>下記のパスワードをコピーして保存すると、後でこのパスワードを使って進捗状況を復元できます。</p>
      
      <div className="password-container">
        <input 
          type="text" 
          ref={passwordRef}
          value={password}
          onChange={(e) => {
            onPasswordChange(e.target.value);
            setCopySuccess('');
          }}
          placeholder="パスワードを入力または保存してください"
        />
        <button className="btn btn-copy" onClick={copyToClipboard}>
          コピー
        </button>
      </div>
      
      {copySuccess && <div className="copy-message">{copySuccess}</div>}
      
      <div className="password-buttons">
        <button className="btn" onClick={handlePasswordApply}>パスワードを適用</button>
        <button 
          className="btn btn-danger" 
          onClick={() => {
            if (window.confirm('本当に進捗をリセットしますか？この操作は元に戻せません。')) {
              onResetProgress();
              setCopySuccess('進捗状況をリセットしました');
              setTimeout(() => setCopySuccess(''), 3000);
            }
          }}
        >
          進捗リセット
        </button>
      </div>
    </div>
  );
};

export default PasswordManager;