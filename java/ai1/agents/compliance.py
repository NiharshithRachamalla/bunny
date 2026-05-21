"""Enforces SEBI disclaimers and response formatting."""

from typing import Any


def enforce_compliance(response: str) -> str:
    """Apply compliance rules to the provided response."""
    disclaimer = (
        "This information is provided for educational purposes only and is not investment advice. "
        "Please consult a qualified financial advisor before taking any action."
    )
    return f"{response}\n\n{disclaimer}"
