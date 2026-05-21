"""Pydantic schemas and typed application state."""

from pydantic import BaseModel
from typing import Optional


class AppState(BaseModel):
    user_id: str
    session_id: str
    intent: Optional[str] = None
    last_message: Optional[str] = None
