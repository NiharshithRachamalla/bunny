"""LangGraph state graph compiler and orchestration."""

from datetime import datetime

from .state import AppState


def compile_graph(state: AppState) -> dict:
    """Compile orchestration graph from app state."""
    return {
        "graph": {
            "generated_at": datetime.utcnow().isoformat() + "Z",
            "nodes": [
                {"id": "intent_classification", "type": "classifier", "label": "Intent Classification", "intent": state.intent},
                {"id": "tool_selection", "type": "router", "label": "Tool Selection", "selected_tool": state.intent},
                {"id": "response_generation", "type": "executor", "label": "Response Generation"},
                {"id": "compliance_check", "type": "compliance", "label": "Compliance Enforcement"},
            ],
            "edges": [
                {"from": "intent_classification", "to": "tool_selection"},
                {"from": "tool_selection", "to": "response_generation"},
                {"from": "response_generation", "to": "compliance_check"},
            ],
            "state": state.dict(),
        }
    }
