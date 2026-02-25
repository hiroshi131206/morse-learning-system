"""
Morse Learning System - FastAPI Backend
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Morse Learning System API",
    description="モールス信号学習支援・分析システムのバックエンドAPI",
    version="1.0.0",
)

# CORS設定（開発環境用）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    """ルートエンドポイント"""
    return {
        "message": "Morse Learning System API",
        "version": "1.0.0",
        "status": "running",
    }


@app.get("/health")
def health_check():
    """ヘルスチェックエンドポイント"""
    return {"status": "healthy"}


# モールス信号辞書データ
MORSE_CODES = {
    # 欧文（アルファベット）
    "A": "・ー", "B": "ー・・・", "C": "ー・ー・", "D": "ー・・", "E": "・",
    "F": "・・ー・", "G": "ーー・", "H": "・・・・", "I": "・・", "J": "・ーーー",
    "K": "ー・ー", "L": "・ー・・", "M": "ーー", "N": "ー・", "O": "ーーー",
    "P": "・ーー・", "Q": "ーー・ー", "R": "・ー・", "S": "・・・", "T": "ー",
    "U": "・・ー", "V": "・・・ー", "W": "・ーー", "X": "ー・・ー", "Y": "ー・ーー",
    "Z": "ーー・・",

    # 数字
    "1": "・ーーーー", "2": "・・ーーー", "3": "・・・ーー", "4": "・・・・ー", "5": "・・・・・",
    "6": "ー・・・・", "7": "ーー・・・", "8": "ーーー・・", "9": "ーーーー・", "0": "ーーーーー",

    # 和文（カタカナ）
    "イ": "・ー", "ロ": "・ー・ー", "ハ": "ー・・・", "ニ": "ー・ー・", "ホ": "ー・・",
    "へ": "・", "ト": "・・ー・・", "チ": "・・ー・", "リ": "ーー・", "ヌ": "・・・・",
    "ル": "ー・ーー・", "ヲ": "・ーーー", "ワ": "ー・ー", "カ": "・ー・・", "ヨ": "ーー",
    "タ": "ー・", "レ": "ーーー", "ソ": "ーーー・", "ツ": "・ーー・", "ネ": "ーー・ー",
    "ナ": "・ー・", "ラ": "・・・", "ム": "ー", "ウ": "・・ー", "ヰ": "・ー・・ー",
    "ノ": "・・ーー", "オ": "・ー・・・", "ク": "・・・ー", "ヤ": "・ーー", "マ": "ー・・ー",
    "ケ": "ー・ーー", "フ": "ーー・・", "コ": "ーーーー", "エ": "ー・ーーー", "テ": "・ー・ーー",
    "ア": "ーーー・ー", "サ": "ー・ー・ー", "キ": "ー・ー・・", "ユ": "ー・・ーー", "メ": "ー・・・ー",
    "ミ": "・・ー・ー", "シ": "ーー・ー・", "ヱ": "・ーーー・", "ヒ": "ーー・・ー", "モ": "ー・・ー・",
    "セ": "・ーーー・", "ス": "ーーー・ー", "ン": "・ー・ー・",

    # 記号
    ".": "・ー・ー・ー", ",": "ー・ー・ー・", "?": "・・ーー・・", "/": "ー・・ー・",
    "-": "ー・・・・ー", "=": "ー・・・ー", "+": "・ー・ー・", "@": "・ーー・ー・",
    "(": "ー・ーー・", ")": "ー・ーー・ー", ":": "ーーー・・・", ";": "ー・ー・ー・",
    "\"": "・ー・・ー・", "'": "・ーーーー・", "_": "・・ーー・ー", "$": "・・・ー・・ー",
}


@app.get("/api/codes")
def get_codes(category: str = None, search: str = None):
    """符号一覧取得"""
    codes = []
    code_id = 1

    for char, pattern in MORSE_CODES.items():
        # カテゴリー判定
        if char.isalpha() and char.isupper():
            cat = "欧文"
        elif char.isdigit():
            cat = "数字"
        elif ord(char) >= 0x30A0 and ord(char) <= 0x30FF:  # カタカナ範囲
            cat = "和文"
        else:
            cat = "記号"

        # フィルタリング
        if category and cat != category:
            continue
        if search and search.lower() not in char.lower() and search not in pattern:
            continue

        codes.append({
            "id": code_id,
            "character": char,
            "code_pattern": pattern,
            "category": cat
        })
        code_id += 1

    return {"codes": codes, "total": len(codes)}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8001)
