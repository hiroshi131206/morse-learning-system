# Morse Learning System - Claude Code Project Guide

## Communication Language
- **Always respond in Japanese (日本語で回答すること)**
- Code comments: Japanese for business logic, English for technical details
- Git commit messages: English

## Project Overview
**Morse Learning System** は、モールス信号の習得を支援する学習進捗管理および技能分析システムです。

### 主要機能
1. **符号辞書・検索**: 和文・欧文モールス符号および略符号の双方向検索
2. **トレーニング・ログ**: 練習結果の詳細記録（正解率、応答速度）
3. **苦手符号の自動抽出**: データ分析による弱点の可視化

### 独自性
- 応答速度（ミリ秒単位）の記録による定量的分析
- SQLiteによる軽量・オフライン動作
- 苦手符号の重点的出題機能

## Tech Stack

### Backend
- **Framework**: FastAPI 0.109+
- **Database**: SQLite3
- **ORM**: SQLAlchemy 2.0
- **Testing**: pytest
- **Linter**: ruff, mypy

### Frontend
- **Framework**: React 18 + TypeScript
- **UI Library**: Material-UI (MUI) v5
- **State Management**: React Query (TanStack Query)
- **Charts**: Chart.js / Recharts
- **Build**: Vite

### Infrastructure
- **Container**: Docker + Docker Compose
- **Development**: Hot reload (FastAPI uvicorn / Vite)

## Project Structure

```
morse-learning-system/
├── backend/                   # FastAPI Backend
│   ├── app/
│   │   ├── main.py           # FastAPI app
│   │   ├── models/           # SQLAlchemy models
│   │   │   ├── code.py       # 符号マスタ
│   │   │   └── training.py   # 学習ログ
│   │   ├── schemas/          # Pydantic schemas
│   │   ├── routers/          # API routers
│   │   │   ├── codes.py      # 符号API
│   │   │   ├── training.py   # トレーニングAPI
│   │   │   └── analysis.py   # 分析API
│   │   ├── services/         # Business logic
│   │   └── database.py       # DB connection
│   ├── tests/                # pytest tests
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/                  # React Frontend
│   ├── src/
│   │   ├── components/       # UI components
│   │   │   ├── CodeSearch/   # 符号検索
│   │   │   ├── Training/     # トレーニング画面
│   │   │   └── Analysis/     # 分析ダッシュボード
│   │   ├── services/         # API client
│   │   ├── hooks/            # Custom hooks
│   │   └── App.tsx
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml
├── .claude/                   # Claude Code設定（claude-universal-config使用）
├── CLAUDE.md                  # このファイル
└── README.md
```

## Database Design

### 符号マスタテーブル (morse_codes)
```sql
CREATE TABLE morse_codes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    character TEXT NOT NULL UNIQUE,  -- 文字 (例: 'A', 'イ', 'SOS')
    code_pattern TEXT NOT NULL,      -- 符号パターン (例: '・ー')
    category TEXT NOT NULL,          -- カテゴリ (和文/欧文/略符号)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 学習ログテーブル (training_logs)
```sql
CREATE TABLE training_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code_id INTEGER NOT NULL,        -- 符号ID (FK)
    session_id TEXT NOT NULL,        -- セッションID
    is_correct BOOLEAN NOT NULL,     -- 正解/不正解
    response_time_ms INTEGER,        -- 応答時間（ミリ秒）
    speed_wpm INTEGER,               -- 設定速度（WPM）
    practiced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (code_id) REFERENCES morse_codes(id)
);
```

### インデックス
```sql
CREATE INDEX idx_training_code ON training_logs(code_id);
CREATE INDEX idx_training_session ON training_logs(session_id);
CREATE INDEX idx_training_date ON training_logs(practiced_at);
```

## Development Commands

### Docker
```bash
docker-compose up -d          # Start all services
docker-compose logs -f backend # Backend logs
docker-compose logs -f frontend # Frontend logs
docker-compose ps             # Status
```

### Backend (FastAPI)
```bash
cd backend
uvicorn app.main:app --reload  # Dev server (port 8000)
pytest                         # Run tests
ruff check .                   # Lint
mypy app                       # Type check
```

### Frontend (React + Vite)
```bash
cd frontend
npm run dev                    # Dev server (port 5173)
npm run build                  # Production build
npm test                       # Run tests
npm run lint                   # ESLint
```

## API Endpoints

Base URL: `http://localhost:8000/api/`

### 符号API
- `GET /codes/` - 符号一覧
- `GET /codes/{id}` - 符号詳細
- `GET /codes/search?q=A` - 符号検索（文字 or パターン）

### トレーニングAPI
- `POST /training/sessions` - セッション開始
- `POST /training/logs` - 練習結果記録
- `GET /training/sessions/{session_id}` - セッション詳細

### 分析API
- `GET /analysis/weak-codes` - 苦手符号ランキング
- `GET /analysis/progress` - 進捗グラフデータ
- `GET /analysis/stats` - 統計サマリー

## Critical Patterns

### SQLite クエリのパラメータ化（必須）
```python
# ❌ 危険: SQL injection vulnerability
cursor.execute(f"SELECT * FROM morse_codes WHERE character = '{char}'")

# ✅ 安全: パラメータ化
cursor.execute("SELECT * FROM morse_codes WHERE character = ?", (char,))
```

### FastAPI レスポンスモデル
```python
from pydantic import BaseModel

class MorseCode(BaseModel):
    id: int
    character: str
    code_pattern: str
    category: str

@app.get("/codes/{code_id}", response_model=MorseCode)
def get_code(code_id: int):
    return db.query(MorseCode).filter_by(id=code_id).first()
```

### React Query パターン
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['codes'],
  queryFn: async () => {
    const response = await fetch('/api/codes');
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json();
  },
});
```

## Security Notes

- SQLite queries: Always use parameterized queries
- Input validation: Both frontend (TypeScript) and backend (Pydantic)
- CORS: Configure allowed origins in FastAPI
- No sensitive data: This app runs locally, no user authentication required

## Testing Strategy

### Backend (pytest)
- Unit tests for models, services
- Integration tests for API endpoints
- Coverage target: 80%+

### Frontend (Vitest / React Testing Library)
- Component tests
- Hook tests
- Integration tests for user flows
- Coverage target: 80%+

## Performance Considerations

- Database indexing on frequently queried columns
- Pagination for large datasets (training logs)
- React.memo for expensive components
- Debounce for search input

## Future Enhancements

- Export training data to CSV/Excel
- Practice mode with automatic difficulty adjustment
- Sound playback of morse code
- Offline PWA support
