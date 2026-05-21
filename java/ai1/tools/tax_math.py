"""Utility functions for tax calculations."""

from typing import Dict


def estimate_tax(income: float, rate: float = 0.3) -> Dict[str, float]:
    """Return a simple tax estimate."""
    return {"tax_due": income * rate, "effective_rate": rate}
