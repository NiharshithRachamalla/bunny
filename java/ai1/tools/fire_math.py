"""Calculators for financial independence / FIRE planning."""

from typing import Dict


def run_fire_calc(current_savings: float, annual_spending: float, safe_withdrawal_rate: float = 0.04) -> Dict[str, float]:
    """Compute target savings and years to FIRE."""
    target = annual_spending / safe_withdrawal_rate
    return {"target_savings": target, "current_savings": current_savings}
