"""Health-related financial calculators."""

from typing import Dict


def estimate_medical_fund(age: int, annual_health_cost: float) -> Dict[str, float]:
    """Estimate necessary reserve for health expenses."""
    return {"estimated_fund": annual_health_cost * 5, "age": age}
