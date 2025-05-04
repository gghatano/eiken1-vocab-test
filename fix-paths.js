const fs = require('fs');
const path = require('path');

// distディレクトリ内のindex.htmlファイルへのパス
const indexPath = path.join(__dirname, 'dist', 'index.html');

// ファイルを読み込む
fs.readFile(indexPath, 'utf8', (err, data) => {
  if (err) {
    console.error('ファイルの読み込みに失敗しました:', err);
    return;
  }

  // 絶対パスを相対パスに置換
  const result = data.replace(/src="\/([^\/][^"]+)"/g, 'src="./$1"')
                    .replace(/href="\/([^\/][^"]+)"/g, 'href="./$1"');

  // 修正したファイルを書き込む
  fs.writeFile(indexPath, result, 'utf8', (err) => {
    if (err) {
      console.error('ファイルの書き込みに失敗しました:', err);
      return;
    }
    console.log('パスが修正されました！');
  });
});