import re
from datetime import datetime
from uuid import uuid4

import streamlit as st

from agents.supervisor import classify_intent
from agents.compliance import enforce_compliance
from core.memory import init_db, load_state, save_state
from core.orchestrator import compile_graph
from core.state import AppState
from tools.fire_math import run_fire_calc
from tools.health_math import estimate_medical_fund
from tools.tax_math import estimate_tax


def extract_number(text: str, default: float) -> float:
    match = re.search(r"\d+[\d,\.]*", text.replace("₹", "").replace(",", ""))
    if not match:
        return default
    try:
        return float(match.group())
    except ValueError:
        return default


def build_response(intent: str, message: str) -> str:
    if intent == "tax":
        income = extract_number(message, 300000)
        result = estimate_tax(income=income, rate=0.25)
        return (
            f"Tax intent detected. For an estimated income of ₹{income:,.0f}, "
            f"your tax due is approximately ₹{result['tax_due']:,.2f} at an effective rate of {result['effective_rate']:.0%}."
        )

    if intent == "health":
        age = int(extract_number(message, 35))
        yearly_cost = extract_number(message, 20000)
        result = estimate_medical_fund(age=age, annual_health_cost=yearly_cost)
        return (
            f"Health planning intent detected. At age {result['age']}, "
            f"a recommended emergency health reserve is ₹{result['estimated_fund']:,.2f}."
        )

    if intent == "mf":
        spending = extract_number(message, 300000)
        result = run_fire_calc(current_savings=100000, annual_spending=spending)
        return (
            "Investment planning intent detected. "
            f"Your FIRE target is ₹{result['target_savings']:,.0f} based on annual spending of ₹{spending:,.0f}."
        )

    return (
        "I can help with tax estimates, health reserve planning, and investment/FIRE guidance. "
        "Try asking about annual income, health cost, or mutual fund strategy."
    )


def build_graphviz_dot(graph_obj: dict) -> str:
    lines = [
        "digraph orchestrator {",
        "rankdir=LR;",
        "node [shape=box, style=filled, fillcolor=\"#FF8C00\", color=\"#000000\", fontcolor=\"#000000\"];",
    ]
    for node in graph_obj.get("nodes", []):
        label = node.get("label", node.get("type", node.get("id", ""))).replace("_", " ").title()
        lines.append(f'"{node["id"]}" [label="{label}"];')
    for edge in graph_obj.get("edges", []):
        lines.append(f'"{edge["from"]}" -> "{edge["to"]}";')
    lines.append("}")
    return "\n".join(lines)


def init_session_state() -> None:
    if "user_id" not in st.session_state:
        st.session_state.user_id = f"user_{uuid4().hex[:8]}"
    if "session_id" not in st.session_state:
        st.session_state.session_id = f"session_{uuid4().hex[:8]}"
    if "history" not in st.session_state:
        st.session_state.history = []
    if "last_graph" not in st.session_state:
        st.session_state.last_graph = None


def main() -> None:
    st.set_page_config(page_title="AI Money Mentor", layout="wide")
    init_db()
    init_session_state()

    st.markdown(
        """
        <style>
        [data-testid="stAppViewContainer"] {
            background-color: #1a1a1a;
        }
        .stTabs [role="tablist"] button [aria-selected="true"] {
            background-color: #FF8C00;
            color: #1a1a1a;
        }
        h1, h2, h3 {
            color: #FF8C00;
        }
        </style>
        """,
        unsafe_allow_html=True,
    )

    st.title("🔥 AI Money Mentor")
    st.markdown(
        "Use the form below to ask the mentor a finance question. "
        "The app classifies your intent, compiles an orchestration graph, and returns a sample response.",
        help="Orange-Black Financial Advisory AI"
    )

    with st.sidebar:
        st.header("Session info")
        st.text_input("User ID", value=st.session_state.user_id, disabled=True)
        st.text_input("Session ID", value=st.session_state.session_id, disabled=True)

        if st.button("Load latest saved state"):
            loaded = load_state(st.session_state.session_id)
            if loaded:
                st.success("Loaded saved session state.")
                st.json(loaded.dict())
            else:
                st.warning("No saved state found for this session.")

    with st.form("mentor_form"):
        prompt = st.text_area(
            "Ask the AI Money Mentor",
            value="I want help with tax planning for 500000 income",
            height=180,
        )
        submitted = st.form_submit_button("Submit")

    graph = None
    if submitted and prompt.strip():
        intent = classify_intent(prompt)
        state = AppState(
            user_id=st.session_state.user_id,
            session_id=st.session_state.session_id,
            intent=intent,
            last_message=prompt,
        )

        graph = compile_graph(state)
        st.session_state.last_graph = graph
        response = build_response(intent, prompt)
        response = enforce_compliance(response)
        compliance_applied = True
        save_state(state)

        entry = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "message": prompt,
            "intent": intent,
            "response": response,
            "compliance_applied": compliance_applied,
        }
        st.session_state.history.append(entry)
    else:
        graph = st.session_state.last_graph

    col1, col2 = st.columns([3, 2])

    with col1:
        st.subheader("Conversation history")
        if not st.session_state.history:
            st.info("Submit a question above to begin an example orchestration flow.")
        for item in reversed(st.session_state.history):
            badge = ":white_check_mark: Compliance applied" if item.get("compliance_applied") else ":x: Compliance not applied"
            st.write(f"**{item['timestamp']}** — _Intent: {item['intent']}_")
            st.write(badge)
            st.write(f"**You:** {item['message']}")
            st.write(f"**Mentor:** {item['response']}")
            st.markdown("---")

    with col2:
        st.subheader("Orchestration overview")
        if st.session_state.history and graph:
            st.markdown("**Execution graph**")
            st.graphviz_chart(build_graphviz_dot(graph["graph"]))
            st.markdown("**Raw orchestration metadata**")
            st.json(graph)
        else:
            st.info("The graph will appear here after you submit your first question.")

        st.markdown("### Example workflow")
        st.write(
            "1. Classify intent from the user prompt.\n"
            "2. Select a tool and route the request.\n"
            "3. Apply compliance enforcement to the output.\n"
            "4. Save session state to SQLite."
        )


if __name__ == "__main__":
    main()
