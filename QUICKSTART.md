# 🚀 クイックスタートガイド

## 3ステップで起動

### Windows

1. **コマンドプロンプトを開く**
2. **プロジェクトフォルダに移動**
   ```bash
   cd morse-learning-system
   ```
3. **起動スクリプトを実行**
   ```bash
   start.bat
   ```

### Mac/Linux

1. **ターミナルを開く**
2. **プロジェクトフォルダに移動**
   ```bash
   cd morse-learning-system
   ```
3. **起動スクリプトを実行**
   ```bash
   chmod +x start.sh
   ./start.sh
   ```

## アクセス

- **アプリケーション**: http://localhost:5173
- **API ドキュメント**: http://localhost:8001/docs

## トラブルシューティング

### Python がインストールされていない

**Windows:**
1. [Python公式サイト](https://www.python.org/downloads/)からダウンロード
2. インストール時に「Add Python to PATH」にチェック

**Mac:**
```bash
brew install python3
```

**Linux:**
```bash
sudo apt update
sudo apt install python3 python3-pip
```

### Node.js がインストールされていない

**Windows/Mac/Linux:**
[Node.js公式サイト](https://nodejs.org/)からLTS版をダウンロードしてインストール

### ポートが使用中

**バックエンド（ポート8001）が使用中の場合:**
```bash
# Windows
netstat -ano | findstr :8001
taskkill /PID <PID番号> /F

# Mac/Linux
lsof -ti:8001 | xargs kill -9
```

**フロントエンド（ポート5173）が使用中の場合:**
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID番号> /F

# Mac/Linux
lsof -ti:5173 | xargs kill -9
```

### 依存関係のインストールエラー

**バックエンド:**
```bash
cd backend
pip install --upgrade pip
pip install -r requirements.txt
```

**フロントエンド:**
```bash
cd frontend
npm cache clean --force
npm install
```

## サーバーの停止方法

### Windows
起動時に開いたコマンドプロンプトウィンドウを閉じる

### Mac/Linux
ターミナルで `Ctrl+C` を押す、または:
```bash
# プロセスIDを確認して終了
ps aux | grep uvicorn
ps aux | grep vite
kill <PID番号>
```

## 次のステップ

1. **符号辞書を試す**: 検索やフィルタリング機能を使ってみる
2. **音声再生**: 🔊ボタンでモールス信号の音を聴く
3. **トレーニング**: 聴音練習または送信練習を開始
4. **お気に入り**: よく使う符号を❤️ボタンで登録
5. **分析**: トレーニング後、学習結果を確認

詳しい使い方は [README.md](README.md) を参照してください。
