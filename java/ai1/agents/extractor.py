"""Parses unstructured text into structured JSON / Pydantic models."""

from typing import Dict, Any


def extract_data(text: str) -> Dict[str, Any]:
    """Extract key fields from freeform text."""
    return {"raw_text": text}
