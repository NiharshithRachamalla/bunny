"""Intent classification router for domain-specific AI agents."""

from typing import Dict


def classify_intent(message: str) -> str:
    """Return a simplified intent label based on input text."""
    if "tax" in message.lower():
        return "tax"
    if "health" in message.lower():
        return "health"
    if "investment" in message.lower() or "mutual fund" in message.lower():
        return "mf"
    return "general"
