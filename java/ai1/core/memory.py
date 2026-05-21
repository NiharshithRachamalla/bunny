"""SQLite-backed session persistence for conversation state."""

import sqlite3
from pathlib import Path
from .state import AppState


DB_PATH = Path(__file__).resolve().parent / "session.db"


def init_db() -> None:
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS session_state (
                session_id TEXT PRIMARY KEY,
                user_id TEXT,
                intent TEXT,
                last_message TEXT
            )
            """
        )


def save_state(state: AppState) -> None:
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute(
            "REPLACE INTO session_state (session_id, user_id, intent, last_message) VALUES (?, ?, ?, ?)",
            (state.session_id, state.user_id, state.intent, state.last_message),
        )


from typing import Optional


def load_state(session_id: str) -> Optional[AppState]:
    with sqlite3.connect(DB_PATH) as conn:
        cursor = conn.execute(
            "SELECT session_id, user_id, intent, last_message FROM session_state WHERE session_id = ?",
            (session_id,),
        )
        row = cursor.fetchone()
        if row is None:
            return None
        return AppState(
            session_id=row[0],
            user_id=row[1],
            intent=row[2],
            last_message=row[3],
        )
