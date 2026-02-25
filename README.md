# Morse Learning System

[![GitHub](https://img.shields.io/badge/GitHub-hiroshi131206%2Fmorse--learning--system-blue?logo=github)](https://github.com/hiroshi131206/morse-learning-system)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.11+-blue?logo=python)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109+-green?logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18+-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?logo=typescript)](https://www.typescriptlang.org/)

**モールス信号学習支援・分析システム**

モールス信号の習得を支援する、学習進捗管理および技能分析ツールです。

🔗 **Repository**: https://github.com/hiroshi131206/morse-learning-system

## 📋 目次

- [概要](#概要)
- [主要機能](#主要機能)
- [技術スタック](#技術スタック)
- [セットアップ](#セットアップ)
- [使い方](#使い方)
- [データベース設計](#データベース設計)
- [開発](#開発)
- [ライセンス](#ライセンス)

---

## 概要

本アプリは、モールス信号の習得を目指すユーザーを対象とした、学習進捗管理および技能分析ツールです。単なる符号の変換機能にとどまらず、**練習結果をデータベース化**して自身の苦手傾向を論理的に分析できる仕組みを提供します。

### 解決する課題

モールス信号のような特殊な技能習得において、上達の妨げとなるのは以下の点です：

- ❌ どの符号が苦手か客観視しにくい
- ❌ どの速度域でミスが増えるか把握できない
- ❌ 漠然と練習するため効率が悪い

本アプリは、**日々の練習結果を詳細に記録・集計**することで、効率的な反復学習を実現します。

---

## 主要機能

### 1. 符号辞書・検索機能

和文・欧文のモールス符号および略符号をSQLiteで管理し、**文字と符号の双方向検索**を可能にします。

- 和文符号（イロハ48文字）
- 欧文符号（A-Z, 0-9）
- 略符号（SOS, CQ, TNX等）

### 2. トレーニング・ログ機能

練習の実施日時、正解率、および符号ごとの**応答速度をミリ秒単位**でSQLiteに保存します。

- セッション管理
- 設定速度（WPM）記録
- 正解/不正解判定
- 応答時間計測

### 3. 苦手符号の自動抽出

過去の練習ログをSQLで集計し、**正解率が低い符号**や、**応答に時間がかかっている符号**をランキング形式で表示します。

- 苦手符号TOP10
- 速度別の正解率グラフ
- 進捗トレンド分析

---

## 技術スタック

### Backend
- **FastAPI 0.109+**: 高速なPythonフレームワーク
- **SQLite3**: 軽量データベース（オフライン動作）
- **SQLAlchemy 2.0**: ORM
- **Pydantic**: バリデーション
- **pytest**: テストフレームワーク

### Frontend
- **React 18**: UIフレームワーク
- **TypeScript 5**: 型安全
- **Material-UI (MUI) v5**: コンポーネントライブラリ
- **React Query (TanStack Query)**: データフェッチング
- **Chart.js / Recharts**: データ可視化
- **Vite**: ビルドツール

### Infrastructure
- **Docker + Docker Compose**: コンテナ化
- **Nginx**: リバースプロキシ（本番環境）

---

## セットアップ

### 前提条件

- Docker & Docker Compose
- Node.js 18+ (ローカル開発時)
- Python 3.11+ (ローカル開発時)

### クイックスタート

```bash
# リポジトリをクローン
git clone https://github.com/YOUR_USERNAME/morse-learning-system.git
cd morse-learning-system

# Dockerで起動
docker-compose up -d

# ブラウザで開く
open http://localhost:3000  # Frontend
open http://localhost:8000/docs  # API Docs
```

---

## 使い方

### 符号検索

1. トップページから「符号辞書」を選択
2. 文字または符号パターンで検索
3. 結果から詳細を確認

### トレーニング

1. 「トレーニング」を選択
2. 速度（WPM）を設定
3. 練習開始
4. 符号を聞いて文字を入力
5. 結果を記録

### 分析

1. 「分析」を選択
2. 苦手符号ランキングを確認
3. 進捗グラフで成長を実感

---

## データベース設計

### 符号マスタテーブル (morse_codes)

| カラム | 型 | 説明 |
|---|---|---|
| id | INTEGER (PK) | 符号ID |
| character | TEXT (UNIQUE) | 文字 (例: 'A', 'イ') |
| code_pattern | TEXT | 符号パターン (例: '・ー') |
| category | TEXT | カテゴリ (和文/欧文/略符号) |
| created_at | TIMESTAMP | 作成日時 |

### 学習ログテーブル (training_logs)

| カラム | 型 | 説明 |
|---|---|---|
| id | INTEGER (PK) | ログID |
| code_id | INTEGER (FK) | 符号ID |
| session_id | TEXT | セッションID |
| is_correct | BOOLEAN | 正解/不正解 |
| response_time_ms | INTEGER | 応答時間（ミリ秒） |
| speed_wpm | INTEGER | 設定速度（WPM） |
| practiced_at | TIMESTAMP | 実施日時 |

### データベース正規化

- **1NF**: すべてのカラムが原子値
- **2NF**: 部分関数従属性の排除
- **3NF**: 推移的関数従属性の排除

---

## 開発

### ローカル開発（Backend）

```bash
cd backend

# 仮想環境作成
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 依存関係インストール
pip install -r requirements.txt

# 開発サーバー起動
uvicorn app.main:app --reload

# テスト実行
pytest

# リント
ruff check .

# 型チェック
mypy app
```

### ローカル開発（Frontend）

```bash
cd frontend

# 依存関係インストール
npm install

# 開発サーバー起動
npm run dev

# テスト実行
npm test

# リント
npm run lint

# ビルド
npm run build
```

---

## 独自性と差別化

### 定量的な技能分析

単なる○×の記録ではなく、**応答速度（反応時間）を保持**することで、無意識に反応できるレベルまで習熟しているかを数値で判定します。

### 弱点克服メニューの自動生成

SQLの集計結果に基づき、**苦手な符号のみを重点的に出題**する動的な問題作成機能を備えます。

### 軽量・オフライン動作

SQLiteを採用することで、外部サーバーを必要とせず、**端末内ですべての分析処理が完結**する高速な動作環境を実現します。

---

## ライセンス

MIT License

---

## クレジット

このプロジェクトは **Claude Universal Config** を使用して開発されています。

- [Claude Universal Config](https://github.com/hiroshi131206/claude-universal-config)
