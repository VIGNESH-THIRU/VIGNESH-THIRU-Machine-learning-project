from fastapi import FastAPI
import pandas as pd
from pathlib import Path

app = FastAPI(title="Exact Match Chatbot", version="1.0.0")

# File path
BASE_DIR = Path(__file__).resolve().parent
CSV_FILE = BASE_DIR / "mydata.csv"


def load_chat_dict():
    """Load the CSV and return a dictionary of prompts → replies."""
    if not CSV_FILE.exists():
        raise FileNotFoundError(f"CSV file not found: {CSV_FILE}")

    df = pd.read_csv(CSV_FILE)  # must have columns: Prompt, Reply
    if "Prompt" not in df.columns or "Reply" not in df.columns:
        raise ValueError("CSV must have columns: Prompt, Reply")

    # Lowercase keys for case-insensitive matching
    return {row["Prompt"].strip().lower(): row["Reply"] for _, row in df.iterrows()}


@app.post("/predict")
def predict(data: dict):
    """Predict reply for given prompt."""
    # Load latest CSV data (ensures changes are reflected after restart)
    chat_dict = load_chat_dict()

    user_prompt = data.get("prompt", "").strip().lower()
    reply = chat_dict.get(user_prompt, "Sorry, I don't understand that yet.")
    return {"result": reply}


@app.get("/health")
def health():
    """Health check endpoint."""
    try:
        chat_dict = load_chat_dict()
        return {
            "status": "ok",
            "entries": len(chat_dict),
            "file": str(CSV_FILE)
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}
