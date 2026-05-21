import { useState, useEffect, useRef } from "react";

const CLAUDE_MODEL = "claude-sonnet-4-20250514";

// ── Design Tokens — Google Antigravity-inspired: clean white + stark black ──
const C = {
  bg:       "#FFFFFF",
  bgOff:    "#F7F7F5",
  bgDark:   "#111111",
  panel:    "#FAFAF8",
  card:     "#F3F3F0",
  border:   "#E5E5E2",
  borderDk: "#CCCCCA",
  text:     "#111111",
  textSub:  "#555555",
  textMute: "#999999",
  accent:   "#111111",
  white:    "#FFFFFF",
  tag:      "#EBEBEB",
};

// ── Font stack: DM Sans for display, DM Mono for code/labels ─────────────────
const FONT_DISPLAY = "'DM Sans', 'Helvetica Neue', Arial, sans-serif";
const FONT_MONO    = "'DM Mono', 'Fira Mono', monospace";

// Google Fonts import injected once
const FONTS_URL = "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,900;1,9..40,400&family=DM+Mono:wght@400;500&display=swap";

function injectFonts() {
  if (document.getElementById("dm-fonts")) return;
  const l = document.createElement("link");
  l.id = "dm-fonts"; l.rel = "stylesheet"; l.href = FONTS_URL;
  document.head.appendChild(l);
}

// ── Utility ───────────────────────────────────────────────────────────────────
const card = {
  background: C.bg,
  border: `1px solid ${C.border}`,
  borderRadius: 16,
};

const cardDark = {
  background: C.bgDark,
  borderRadius: 16,
};

// ── Progress bar ──────────────────────────────────────────────────────────────
function Bar({ value, height = 5, color = C.bgDark, bg = C.border }) {
  return (
    <div style={{ height, background: bg, borderRadius: height, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${value}%`, background: color, borderRadius: height, transition: "width 1s ease" }} />
    </div>
  );
}

// ── Sparkline ─────────────────────────────────────────────────────────────────
function Sparkline({ data, color = C.bgDark, height = 48, width = 160 }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data), max = Math.max(...data), range = max - min || 1;
  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * width,
    height - ((v - min) / range) * height * 0.85 - height * 0.07,
  ]);
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  return (
    <svg width={width} height={height}>
      <path d={d} stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r="3.5" fill={C.bg} stroke={color} strokeWidth="2" />
    </svg>
  );
}

// ── Ring ──────────────────────────────────────────────────────────────────────
function Ring({ value, size = 72, label }) {
  const r = size / 2 - 7;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} stroke={C.border} strokeWidth="3.5" fill="none" />
        <circle cx={size/2} cy={size/2} r={r} stroke={C.bgDark} strokeWidth="3.5" fill="none"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1.2s ease" }} />
        <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central"
          style={{ transform: "rotate(90deg)", transformOrigin: `${size/2}px ${size/2}px`, fontSize: 12, fontWeight: 700, fill: C.text, fontFamily: FONT_DISPLAY }} >
          {value}
        </text>
      </svg>
      {label && <div style={{ fontSize: 11, color: C.textMute, fontFamily: FONT_DISPLAY, letterSpacing: 0.3 }}>{label}</div>}
    </div>
  );
}

// ── Animated dot indicator ────────────────────────────────────────────────────
function LiveDot() {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22C55E", display: "inline-block",
        boxShadow: "0 0 0 0 rgba(34,197,94,0.4)", animation: "pulse-dot 2s infinite" }} />
      <style>{`@keyframes pulse-dot{0%{box-shadow:0 0 0 0 rgba(34,197,94,0.4)}70%{box-shadow:0 0 0 6px rgba(34,197,94,0)}100%{box-shadow:0 0 0 0 rgba(34,197,94,0)}}`}</style>
    </span>
  );
}

// ── Typing dots ───────────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 4, padding: "10px 14px" }}>
      {[0,1,2].map(i => (
        <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: C.textMute,
          animation: `tdot 1.2s ease-in-out ${i*0.2}s infinite` }} />
      ))}
      <style>{`@keyframes tdot{0%,60%,100%{opacity:.3;transform:translateY(0)}30%{opacity:1;transform:translateY(-4px)}}`}</style>
    </div>
  );
}

// ── Top nav ───────────────────────────────────────────────────────────────────
function TopNav({ name, page, onNav }) {
  const links = [
    { id: "dashboard", label: "Dashboard" },
    { id: "twin",      label: "AI Twin" },
    { id: "memory",    label: "Memory" },
    { id: "emotions",  label: "Emotions" },
    { id: "decisions", label: "Decisions" },
    { id: "timeline",  label: "Timeline" },
    { id: "future",    label: "Future Self" },
  ];
  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 100, background: `${C.bg}EE`, borderBottom: `1px solid ${C.border}`,
      backdropFilter: "blur(12px)", display: "flex", alignItems: "center", padding: "0 32px", height: 60, gap: 32 }}>
      <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 15, color: C.text, letterSpacing: -0.3, flexShrink: 0 }}>
        ◈ Cognitive Clone
      </div>
      <div style={{ display: "flex", gap: 4, flex: 1, overflowX: "auto" }}>
        {links.map(l => (
          <button key={l.id} onClick={() => onNav(l.id)} style={{
            padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: FONT_DISPLAY,
            fontSize: 13, fontWeight: page === l.id ? 600 : 400, transition: "all 0.15s", whiteSpace: "nowrap",
            background: page === l.id ? C.bgDark : "transparent",
            color: page === l.id ? C.white : C.textSub,
          }}>{l.label}</button>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        <LiveDot />
        <span style={{ fontSize: 13, fontFamily: FONT_DISPLAY, color: C.textSub }}>{name || "User"}</span>
      </div>
    </nav>
  );
}

// ── Section header ─────────────────────────────────────────────────────────────
function SH({ eyebrow, title, sub }) {
  return (
    <div style={{ marginBottom: 36 }}>
      {eyebrow && <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: C.textMute, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>{eyebrow}</div>}
      <h2 style={{ margin: "0 0 8px", fontFamily: FONT_DISPLAY, fontSize: 28, fontWeight: 700, color: C.text, letterSpacing: -0.8, lineHeight: 1.2 }}>{title}</h2>
      {sub && <p style={{ margin: 0, fontSize: 14, color: C.textSub, fontFamily: FONT_DISPLAY, lineHeight: 1.6 }}>{sub}</p>}
    </div>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, unit, sub, dark }) {
  return (
    <div style={{ ...(dark ? cardDark : card), padding: "20px 24px" }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: dark ? "rgba(255,255,255,0.4)" : C.textMute, marginBottom: 10 }}>{label}</div>
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 36, fontWeight: 800, letterSpacing: -1.5, color: dark ? C.white : C.text, lineHeight: 1 }}>
        {value}<span style={{ fontSize: 14, fontWeight: 400, color: dark ? "rgba(255,255,255,0.5)" : C.textMute }}>{unit}</span>
      </div>
      {sub && <div style={{ fontFamily: FONT_DISPLAY, fontSize: 12, color: dark ? "rgba(255,255,255,0.4)" : C.textMute, marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

// ── LANDING ───────────────────────────────────────────────────────────────────
function LandingPage({ onEnter }) {
  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: FONT_DISPLAY, display: "flex", flexDirection: "column" }}>
      {/* Nav */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 48px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ fontWeight: 700, fontSize: 16, letterSpacing: -0.3 }}>◈ Cognitive Clone</div>
        <div style={{ display: "flex", gap: 32, fontSize: 14, color: C.textSub }}>
          {["Product","Use Cases","Pricing","Blog"].map(n => <span key={n} style={{ cursor: "pointer" }}>{n}</span>)}
        </div>
        <button onClick={onEnter} style={{ padding: "10px 22px", borderRadius: 100, background: C.bgDark, color: C.white, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, letterSpacing: -0.2 }}>
          Get Started ↓
        </button>
      </nav>
      {/* Hero */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "80px 48px 60px" }}>
        <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 3, color: C.textMute, textTransform: "uppercase", marginBottom: 32 }}>
          AI · Cognitive Systems · v2.0
        </div>
        <h1 style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: "clamp(48px, 10vw, 96px)", letterSpacing: -3, lineHeight: 1.0, color: C.text, margin: "0 0 28px", maxWidth: 900 }}>
          Your mind,<br />modeled in AI
        </h1>
        <p style={{ fontFamily: FONT_DISPLAY, fontSize: 18, color: C.textSub, maxWidth: 520, lineHeight: 1.7, margin: "0 0 48px", fontWeight: 400 }}>
          A living cognitive clone that thinks, decides, and evolves exactly like you — powered by advanced behavioral AI.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginBottom: 64 }}>
          <button onClick={onEnter} style={{ padding: "14px 32px", borderRadius: 100, background: C.bgDark, color: C.white, border: "none", cursor: "pointer", fontSize: 15, fontWeight: 600, letterSpacing: -0.3 }}>
            Initialize clone →
          </button>
          <button style={{ padding: "14px 32px", borderRadius: 100, background: "transparent", color: C.text, border: `1px solid ${C.borderDk}`, cursor: "pointer", fontSize: 15, fontWeight: 500 }}>
            See how it works
          </button>
        </div>
        {/* Feature pills */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginBottom: 80 }}>
          {["🧠 Cognitive Profiling","⚡ Decision AI","◈ Memory Engine","◬ Future Self","◉ Emotional AI"].map(f => (
            <span key={f} style={{ padding: "8px 18px", borderRadius: 100, border: `1px solid ${C.border}`, fontSize: 13, color: C.textSub, background: C.bg, fontFamily: FONT_DISPLAY }}>{f}</span>
          ))}
        </div>
        {/* Stats strip */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: C.border, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden", maxWidth: 540, width: "100%" }}>
          {[["10M+","Data Points"],["99.2%","Pattern Match"],["∞","Memory Depth"]].map(([v, l]) => (
            <div key={l} style={{ background: C.bg, padding: "28px 24px", textAlign: "center" }}>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 30, fontWeight: 800, letterSpacing: -1, color: C.text }}>{v}</div>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 12, color: C.textMute, marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── ONBOARDING ────────────────────────────────────────────────────────────────
function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const questions = [
    { key: "name",         q: "What's your name?",                      ph: "Your name…",                          type: "text" },
    { key: "role",         q: "What do you do?",                         ph: "e.g. Designer, Founder, Engineer…",   type: "text" },
    { key: "goals",        q: "What are your top goals right now?",      ph: "e.g. Build a startup, Travel more…",  type: "textarea" },
    { key: "decisions",    q: "How do you make big decisions?",          type: "choice",
      choices: ["Pure logic & data","Gut feeling first","Consult others","Research everything"] },
    { key: "stress",       q: "Your stress response?",                   type: "choice",
      choices: ["Power through it","Step back & plan","Seek support","Get creative"] },
    { key: "riskTolerance",q: "Your risk appetite?",                     type: "slider", min: 0, max: 100, left: "Cautious", right: "Bold" },
    { key: "personality",  q: "Your dominant trait?",                    type: "choice",
      choices: ["Analytical 🔬","Creative 🎨","Strategic 🎯","Empathetic 💙"] },
  ];
  const q = questions[step];
  const pct = (step / questions.length) * 100;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", fontFamily: FONT_DISPLAY }}>
      {/* Header */}
      <div style={{ padding: "20px 48px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: -0.3 }}>◈ Cognitive Clone</div>
      </div>
      {/* Progress */}
      <div style={{ height: 2, background: C.border }}>
        <div style={{ height: "100%", width: `${pct}%`, background: C.bgDark, transition: "width 0.5s ease" }} />
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 48 }}>
        <div style={{ width: "100%", maxWidth: 520 }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.textMute, textTransform: "uppercase", marginBottom: 20 }}>
            Step {step + 1} of {questions.length} — Building your cognitive model
          </div>
          <h2 style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 32, letterSpacing: -1, color: C.text, margin: "0 0 32px", lineHeight: 1.2 }}>{q.q}</h2>

          {q.type === "text" && (
            <input value={answers[q.key] || ""} onChange={e => setAnswers(a => ({ ...a, [q.key]: e.target.value }))}
              placeholder={q.ph} style={{ width: "100%", padding: "16px 0", background: "transparent", border: "none", borderBottom: `2px solid ${C.border}`, color: C.text, fontSize: 18, outline: "none", fontFamily: FONT_DISPLAY, boxSizing: "border-box" }}
              onFocus={e => e.target.style.borderBottomColor = C.bgDark}
              onBlur={e => e.target.style.borderBottomColor = C.border} />
          )}
          {q.type === "textarea" && (
            <textarea value={answers[q.key] || ""} onChange={e => setAnswers(a => ({ ...a, [q.key]: e.target.value }))}
              placeholder={q.ph} rows={4} style={{ width: "100%", padding: "16px 0", background: "transparent", border: "none", borderBottom: `2px solid ${C.border}`, color: C.text, fontSize: 16, outline: "none", resize: "none", fontFamily: FONT_DISPLAY, boxSizing: "border-box", lineHeight: 1.6 }} />
          )}
          {q.type === "choice" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {q.choices.map(c => (
                <button key={c} onClick={() => setAnswers(a => ({ ...a, [q.key]: c }))} style={{
                  padding: "16px 20px", borderRadius: 12, cursor: "pointer", textAlign: "left", fontSize: 14, fontWeight: 500, transition: "all 0.15s", fontFamily: FONT_DISPLAY,
                  background: answers[q.key] === c ? C.bgDark : C.bg,
                  border: `1.5px solid ${answers[q.key] === c ? C.bgDark : C.border}`,
                  color: answers[q.key] === c ? C.white : C.text,
                }}>{c}</button>
              ))}
            </div>
          )}
          {q.type === "slider" && (
            <div>
              <input type="range" min={q.min} max={q.max} value={answers[q.key] ?? 50}
                onChange={e => setAnswers(a => ({ ...a, [q.key]: Number(e.target.value) }))}
                style={{ width: "100%", accentColor: C.bgDark, margin: "8px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: C.textMute }}>
                <span>{q.left}</span>
                <span style={{ fontWeight: 700, color: C.text, fontFamily: FONT_MONO }}>{answers[q.key] ?? 50}%</span>
                <span>{q.right}</span>
              </div>
            </div>
          )}

          <button onClick={() => step < questions.length - 1 ? setStep(s => s + 1) : onComplete(answers)} style={{
            marginTop: 36, padding: "16px 36px", borderRadius: 100, background: C.bgDark, color: C.white,
            border: "none", cursor: "pointer", fontSize: 15, fontWeight: 600, fontFamily: FONT_DISPLAY, letterSpacing: -0.2,
          }}>
            {step < questions.length - 1 ? "Continue →" : "Build my clone →"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
function Dashboard({ profile }) {
  const cogScores = { Analytical: 82, Creative: 68, Empathy: 74, Strategic: 91, Resilience: 77 };
  const emoHistory = [65,70,58,80,75,85,72,88,76,90,82,87];
  const prodHistory = [40,55,70,60,80,75,90,65,85,80,92,88];

  return (
    <div style={{ padding: "40px 48px", maxWidth: 1100, margin: "0 auto" }}>
      <SH eyebrow="Overview" title={`Welcome back, ${profile?.name || "User"}`} sub="Your cognitive model is active and learning." />

      {/* Stat row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 28 }}>
        <StatCard label="Cognitive Score" value="91" unit="/100" sub="Top 8% of users" dark />
        <StatCard label="Emotional IQ"    value="78" unit="/100" sub="+4 pts this week" />
        <StatCard label="Memory Nodes"    value="2.4K" unit="" sub="Indexed & searchable" />
        <StatCard label="Decisions Sim'd" value="147" unit="" sub="Across 6 domains" />
      </div>

      {/* Cognitive rings + sparklines */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div style={{ ...card, padding: 28 }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.textMute, textTransform: "uppercase", marginBottom: 20 }}>Cognitive Profile</div>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {Object.entries(cogScores).map(([k, v]) => <Ring key={k} value={v} size={72} label={k} />)}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: 12 }}>
          <div style={{ ...card, padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.textMute, textTransform: "uppercase", marginBottom: 6 }}>Emotional Trend</div>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 26, fontWeight: 800, letterSpacing: -1 }}>77 avg</div>
              </div>
              <span style={{ fontSize: 12, color: "#22C55E", fontFamily: FONT_MONO }}>▲ +12%</span>
            </div>
            <Sparkline data={emoHistory} width={320} height={44} />
          </div>
          <div style={{ ...card, padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.textMute, textTransform: "uppercase", marginBottom: 6 }}>Productivity</div>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 26, fontWeight: 800, letterSpacing: -1 }}>88 peak</div>
              </div>
              <span style={{ fontSize: 12, color: "#22C55E", fontFamily: FONT_MONO }}>▲ +8%</span>
            </div>
            <Sparkline data={prodHistory} width={320} height={44} />
          </div>
        </div>
      </div>

      {/* Decision predictions */}
      <div style={{ ...card, padding: 28 }}>
        <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.textMute, textTransform: "uppercase", marginBottom: 20 }}>Decision Predictions</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {[
            { label: "Startup investment", outcome: "Would accept", conf: 76 },
            { label: "Career pivot",       outcome: "Would hesitate", conf: 61 },
            { label: "Relocate city",      outcome: "Would decline",  conf: 84 },
          ].map(d => (
            <div key={d.label}>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 4 }}>{d.label}</div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: C.textMute, marginBottom: 10 }}>{d.outcome}</div>
              <Bar value={d.conf} />
              <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.textMute, marginTop: 6 }}>{d.conf}% confidence</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── AI TWIN CHAT ──────────────────────────────────────────────────────────────
function TwinChat({ profile }) {
  const [messages, setMessages] = useState([{
    role: "assistant",
    content: `Hello, ${profile?.name || "you"}. I am your cognitive clone — a digital reflection of your mind. I think like you, reason like you, and respond as you would. What shall we explore today?`
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const systemPrompt = `You are an AI cognitive clone of ${profile?.name || "the user"}, a ${profile?.role || "professional"}.
You ARE this person's digital mind. Respond exactly as they would — same reasoning, same voice.
Profile: Decision style: ${profile?.decisions}. Stress: ${profile?.stress}. Risk tolerance: ${profile?.riskTolerance ?? 50}%. Trait: ${profile?.personality}. Goals: ${profile?.goals}.
Speak in first person as this person reflecting on themselves. Be introspective, psychologically precise. 2-3 paragraphs max.`;

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input };
    const next = [...messages, userMsg];
    setMessages(next); setInput(""); setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: CLAUDE_MODEL, max_tokens: 1000, system: systemPrompt,
          messages: next.map(m => ({ role: m.role, content: m.content })) }),
      });
      const data = await res.json();
      setMessages(m => [...m, { role: "assistant", content: data.content?.map(b => b.text || "").join("") || "…" }]);
    } catch { setMessages(m => [...m, { role: "assistant", content: "Connection interrupted." }]); }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 60px)", padding: "0 48px", maxWidth: 860, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
      <div style={{ padding: "32px 0 20px" }}>
        <SH eyebrow="AI Twin" title="Chat with your clone" sub={`Active model: ${profile?.personality || "Analytical"} · ${profile?.role || "Professional"}`} />
      </div>
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 20, paddingBottom: 20 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "72%", padding: "14px 20px", borderRadius: m.role === "user" ? "20px 20px 6px 20px" : "6px 20px 20px 20px",
              background: m.role === "user" ? C.bgDark : C.card,
              color: m.role === "user" ? C.white : C.text,
              fontSize: 14, lineHeight: 1.75, fontFamily: FONT_DISPLAY,
            }}>{m.content}</div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex" }}>
            <div style={{ background: C.card, borderRadius: "6px 20px 20px 20px" }}><TypingDots /></div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div style={{ padding: "16px 0 24px", display: "flex", gap: 10 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Ask your cognitive clone…"
          style={{ flex: 1, padding: "14px 20px", background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 100, color: C.text, fontSize: 14, outline: "none", fontFamily: FONT_DISPLAY }} />
        <button onClick={send} disabled={loading || !input.trim()} style={{
          padding: "14px 28px", borderRadius: 100, border: "none", cursor: "pointer",
          background: C.bgDark, color: C.white, fontSize: 14, fontWeight: 600, fontFamily: FONT_DISPLAY,
          opacity: loading || !input.trim() ? 0.4 : 1,
        }}>Send</button>
      </div>
    </div>
  );
}

// ── MEMORY ENGINE ─────────────────────────────────────────────────────────────
function MemoryEngine({ profile }) {
  const [note, setNote] = useState("");
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [memories, setMemories] = useState([
    { id: 1, type: "goal",       content: profile?.goals || "Build something meaningful",                  date: "Jan 15", tags: ["vision","career"] },
    { id: 2, type: "insight",    content: "I work best in early morning deep work sessions",               date: "Jan 20", tags: ["productivity"] },
    { id: 3, type: "decision",   content: "Chose to prioritize health over short-term career gains",       date: "Feb 1",  tags: ["health","balance"] },
    { id: 4, type: "reflection", content: "My fear of failure often masquerades as perfectionism",         date: "Feb 10", tags: ["psychology","growth"] },
  ]);
  const typeIcon  = { goal: "🎯", insight: "💡", decision: "⚡", reflection: "🌀", note: "📝" };

  const addMemory = () => {
    if (!note.trim()) return;
    setMemories(m => [...m, { id: Date.now(), type: "note", content: note, date: "Today", tags: [] }]);
    setNote("");
  };

  const search = async () => {
    if (!query.trim() || loading) return;
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: CLAUDE_MODEL, max_tokens: 1000, messages: [{
          role: "user", content: `Semantic memory search for ${profile?.name || "user"}.\nMemories: ${JSON.stringify(memories)}\nQuery: "${query}"\nFind a match and give a 2-3 sentence psychological insight. Be specific.`
        }]}),
      });
      const data = await res.json();
      setResult(data.content?.map(b => b.text || "").join("") || "No result.");
    } catch { setResult("Search failed."); }
    setLoading(false);
  };

  return (
    <div style={{ padding: "40px 48px", maxWidth: 1100, margin: "0 auto" }}>
      <SH eyebrow="Memory Engine" title="Your stored mind" sub="Semantic memory storage, retrieval, and pattern recognition." />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
        {/* Add */}
        <div style={{ ...card, padding: 28 }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.textMute, textTransform: "uppercase", marginBottom: 16 }}>Add Memory</div>
          <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Write a memory, insight, or reflection…"
            rows={4} style={{ width: "100%", padding: 0, background: "transparent", border: "none", borderBottom: `1.5px solid ${C.border}`, color: C.text, fontSize: 14, outline: "none", resize: "none", fontFamily: FONT_DISPLAY, lineHeight: 1.7, boxSizing: "border-box", marginBottom: 16 }} />
          <button onClick={addMemory} style={{ padding: "10px 24px", borderRadius: 100, background: C.bgDark, color: C.white, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: FONT_DISPLAY }}>
            + Store
          </button>
        </div>
        {/* Search */}
        <div style={{ ...card, padding: 28 }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.textMute, textTransform: "uppercase", marginBottom: 16 }}>Semantic Search</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && search()}
              placeholder="Search your memories…"
              style={{ flex: 1, padding: "10px 0", background: "transparent", border: "none", borderBottom: `1.5px solid ${C.border}`, color: C.text, fontSize: 14, outline: "none", fontFamily: FONT_DISPLAY }} />
            <button onClick={search} disabled={loading} style={{ padding: "10px 20px", borderRadius: 100, background: C.bgDark, color: C.white, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: FONT_DISPLAY }}>
              {loading ? "…" : "Search"}
            </button>
          </div>
          {result && <div style={{ fontSize: 13, color: C.text, lineHeight: 1.7, padding: "16px", background: C.bgOff, borderRadius: 10, fontFamily: FONT_DISPLAY }}>{result}</div>}
        </div>
      </div>
      <div style={{ display: "grid", gap: 10 }}>
        {memories.map(m => (
          <div key={m.id} style={{ ...card, padding: "18px 24px", display: "flex", gap: 16, alignItems: "flex-start", borderLeft: `3px solid ${C.bgDark}` }}>
            <div style={{ fontSize: 18, flexShrink: 0, marginTop: 2 }}>{typeIcon[m.type]}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 14, color: C.text, lineHeight: 1.65, marginBottom: 8 }}>{m.content}</div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.textMute }}>{m.date}</span>
                {m.tags.map(t => <span key={t} style={{ fontSize: 11, padding: "2px 10px", borderRadius: 100, background: C.tag, color: C.textSub, fontFamily: FONT_MONO }}>#{t}</span>)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── EMOTIONAL AI ──────────────────────────────────────────────────────────────
function EmotionalAI({ profile }) {
  const [text, setText] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const emotions = [
    { label: "Confidence",   value: 78 },
    { label: "Stress",       value: 34 },
    { label: "Motivation",   value: 85 },
    { label: "Anxiety",      value: 28 },
    { label: "Burnout Risk", value: 22 },
  ];

  const analyze = async () => {
    if (!text.trim() || loading) return;
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: CLAUDE_MODEL, max_tokens: 1000, messages: [{
          role: "user",
          content: `Emotional analysis for ${profile?.name || "user"} (${profile?.personality || "Analytical"}). Text: "${text}"\nReturn ONLY valid JSON: {"dominantEmotion":"","stressLevel":0,"confidenceLevel":0,"motivationLevel":0,"psychologicalInsight":"","cognitivePattern":"","recommendation":""}`
        }]}),
      });
      const data = await res.json();
      const raw = data.content?.map(b => b.text || "").join("") || "{}";
      setAnalysis(JSON.parse(raw.replace(/```json|```/g, "").trim()));
    } catch { setAnalysis(null); }
    setLoading(false);
  };

  return (
    <div style={{ padding: "40px 48px", maxWidth: 1100, margin: "0 auto" }}>
      <SH eyebrow="Emotional AI" title="Psychological state detection" sub="Real-time emotional intelligence mapping from any text." />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
        <div style={{ ...card, padding: 28 }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.textMute, textTransform: "uppercase", marginBottom: 16 }}>Baseline Model</div>
          {emotions.map(e => (
            <div key={e.label} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontFamily: FONT_DISPLAY, fontSize: 13, color: C.text }}>{e.label}</span>
                <span style={{ fontFamily: FONT_MONO, fontSize: 12, color: C.textSub }}>{e.value}%</span>
              </div>
              <Bar value={e.value} height={4} />
            </div>
          ))}
        </div>
        <div style={{ ...card, padding: 28 }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.textMute, textTransform: "uppercase", marginBottom: 16 }}>Live Text Analysis</div>
          <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Write anything — a journal entry, thought, or message…"
            rows={7} style={{ width: "100%", padding: 0, background: "transparent", border: "none", borderBottom: `1.5px solid ${C.border}`, color: C.text, fontSize: 14, outline: "none", resize: "none", fontFamily: FONT_DISPLAY, lineHeight: 1.7, marginBottom: 20, boxSizing: "border-box" }} />
          <button onClick={analyze} disabled={loading || !text.trim()} style={{
            padding: "12px 28px", borderRadius: 100, background: C.bgDark, color: C.white,
            border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: FONT_DISPLAY, opacity: loading || !text.trim() ? 0.4 : 1,
          }}>{loading ? "Analyzing…" : "Analyze state →"}</button>
        </div>
      </div>
      {analysis && (
        <div style={{ ...cardDark, padding: 32 }}>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr 1fr", gap: 24, alignItems: "start", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: 8 }}>Dominant</div>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 28, fontWeight: 800, color: C.white, letterSpacing: -1 }}>{analysis.dominantEmotion}</div>
            </div>
            {[["Stress", analysis.stressLevel], ["Confidence", analysis.confidenceLevel], ["Motivation", analysis.motivationLevel]].map(([l, v]) => (
              <div key={l}>
                <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: 8 }}>{l}</div>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 28, fontWeight: 800, color: C.white, letterSpacing: -1 }}>{v}%</div>
                <Bar value={Number(v)} height={3} color="rgba(255,255,255,0.7)" bg="rgba(255,255,255,0.15)" />
              </div>
            ))}
          </div>
          <div style={{ marginTop: 24, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: 12 }}>{analysis.psychologicalInsight}</div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 12, color: "rgba(255,255,255,0.5)" }}>→ {analysis.recommendation}</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── DECISION SIMULATOR ────────────────────────────────────────────────────────
function DecisionSim({ profile }) {
  const [scenario, setScenario] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const presets = [
    "Quit my job to start a company with $20K savings",
    "Move to a new city for a 40% salary raise",
    "Invest 50% of savings in crypto",
    "Turn down a promotion to focus on side projects",
  ];

  const simulate = async (sc = scenario) => {
    if (!sc.trim() || loading) return;
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: CLAUDE_MODEL, max_tokens: 1000, messages: [{
          role: "user",
          content: `Simulate decision for ${profile?.name}. Risk: ${profile?.riskTolerance??50}%. Style: ${profile?.decisions}. Personality: ${profile?.personality}. Goals: ${profile?.goals}.\nScenario: "${sc}"\nReturn ONLY JSON: {"decision":"Would Accept|Would Decline|Deeply Conflicted","probability":0,"logicalAnalysis":"","emotionalAnalysis":"","riskAssessment":"","finalVerdict":"","primaryReason":""}`
        }]}),
      });
      const data = await res.json();
      const raw = data.content?.map(b => b.text || "").join("") || "{}";
      setResult(JSON.parse(raw.replace(/```json|```/g, "").trim()));
    } catch { setResult(null); }
    setLoading(false);
  };

  return (
    <div style={{ padding: "40px 48px", maxWidth: 1100, margin: "0 auto" }}>
      <SH eyebrow="Decision Simulator" title="How would you decide?" sub="Multi-agent cognitive simulation of your decision-making." />
      <div style={{ ...card, padding: 32, marginBottom: 24 }}>
        <textarea value={scenario} onChange={e => setScenario(e.target.value)} placeholder="Describe a decision scenario…"
          rows={3} style={{ width: "100%", padding: 0, background: "transparent", border: "none", borderBottom: `1.5px solid ${C.border}`, color: C.text, fontSize: 18, outline: "none", resize: "none", fontFamily: FONT_DISPLAY, lineHeight: 1.6, marginBottom: 20, boxSizing: "border-box" }} />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          {presets.map(p => (
            <button key={p} onClick={() => { setScenario(p); simulate(p); }} style={{ padding: "8px 16px", borderRadius: 100, border: `1px solid ${C.border}`, background: C.bg, color: C.textSub, fontSize: 12, cursor: "pointer", fontFamily: FONT_DISPLAY }}>
              {p.slice(0, 38)}…
            </button>
          ))}
        </div>
        <button onClick={() => simulate()} disabled={loading || !scenario.trim()} style={{
          padding: "14px 32px", borderRadius: 100, background: C.bgDark, color: C.white, border: "none",
          cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: FONT_DISPLAY, opacity: loading || !scenario.trim() ? 0.4 : 1,
        }}>{loading ? "Simulating…" : "Simulate decision →"}</button>
      </div>

      {result && (
        <div style={{ display: "grid", gap: 14 }}>
          <div style={{ ...cardDark, padding: 32 }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: 12 }}>Predicted Decision</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 40, fontWeight: 900, letterSpacing: -2, color: C.white, marginBottom: 12 }}>{result.decision}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 3 }}>
                <div style={{ height: "100%", width: `${result.probability}%`, background: C.white, borderRadius: 3 }} />
              </div>
              <span style={{ fontFamily: FONT_MONO, fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{result.probability}% likely to accept</span>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
            {[["Logical Brain 🔬", result.logicalAnalysis], ["Emotional Brain 💙", result.emotionalAnalysis], ["Risk Assessment ⚡", result.riskAssessment]].map(([l, v]) => (
              <div key={l} style={{ ...card, padding: 24 }}>
                <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1.5, color: C.textMute, textTransform: "uppercase", marginBottom: 12 }}>{l}</div>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 13, color: C.text, lineHeight: 1.7 }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ ...card, padding: 24, borderLeft: `4px solid ${C.bgDark}` }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.textMute, textTransform: "uppercase", marginBottom: 10 }}>Final Verdict</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 15, color: C.text, lineHeight: 1.75 }}>{result.finalVerdict}</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── COGNITIVE TIMELINE ────────────────────────────────────────────────────────
function CognitiveTimeline() {
  const events = [
    { date: "Jan 2024", label: "Clarity Spike",      desc: "Major shift in strategic thinking — goals crystallized",     score: 88 },
    { date: "Feb 2024", label: "Stress Peak",         desc: "High workload caused temporary analytical decline",           score: 42 },
    { date: "Mar 2024", label: "Creative Surge",      desc: "3 major insights recorded, new perspectives unlocked",        score: 92 },
    { date: "Apr 2024", label: "Decision Inflection", desc: "Risk tolerance increased 15% — bolder choices made",          score: 79 },
    { date: "May 2024", label: "Emotional Mastery",   desc: "Stress response patterns improved significantly",              score: 85 },
    { date: "Jun 2024", label: "Present",             desc: "Cognitive model fully calibrated and learning",               score: 91 },
  ];
  return (
    <div style={{ padding: "40px 48px", maxWidth: 860, margin: "0 auto" }}>
      <SH eyebrow="Cognitive Timeline" title="Your mind's evolution" sub="Every shift, spike, and growth moment — tracked and visualized." />
      <div style={{ position: "relative", paddingLeft: 40 }}>
        <div style={{ position: "absolute", left: 19, top: 8, bottom: 8, width: 1.5, background: C.border }} />
        {events.map((e, i) => (
          <div key={i} style={{ position: "relative", marginBottom: 20 }}>
            <div style={{ position: "absolute", left: -21, top: 18, width: 12, height: 12, borderRadius: "50%", background: C.bgDark, border: `2px solid ${C.bg}`, outline: `1px solid ${C.bgDark}` }} />
            <div style={{ ...card, padding: "20px 28px", marginLeft: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1.5, color: C.textMute, marginBottom: 4 }}>{e.date}</div>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 6, letterSpacing: -0.3 }}>{e.label}</div>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 13, color: C.textSub, lineHeight: 1.6 }}>{e.desc}</div>
              </div>
              <div style={{ textAlign: "right", marginLeft: 20, flexShrink: 0 }}>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 32, fontWeight: 900, letterSpacing: -2, color: C.text }}>{e.score}</div>
                <div style={{ fontFamily: FONT_MONO, fontSize: 9, color: C.textMute }}>COG SCORE</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── FUTURE SELF ───────────────────────────────────────────────────────────────
function FutureSelf({ profile }) {
  const [timeframe, setTimeframe] = useState("1 year");
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: CLAUDE_MODEL, max_tokens: 1000, messages: [{
          role: "user",
          content: `Future self prediction for ${profile?.name}, ${profile?.role}, risk ${profile?.riskTolerance??50}%, ${profile?.personality}, goals: ${profile?.goals}. Timeframe: ${timeframe}.\nReturn ONLY JSON: {"personalityEvolution":"","careerTrajectory":"","keyMilestones":["","",""],"cognitiveGrowth":"","emotionalMaturity":"","potentialChallenge":"","opportunityToWatch":"","overallOutlook":"positive|neutral|challenging","probability":0}`
        }]}),
      });
      const data = await res.json();
      const raw = data.content?.map(b => b.text || "").join("") || "{}";
      setPrediction(JSON.parse(raw.replace(/```json|```/g, "").trim()));
    } catch { setPrediction(null); }
    setLoading(false);
  };

  return (
    <div style={{ padding: "40px 48px", maxWidth: 1100, margin: "0 auto" }}>
      <SH eyebrow="Future Self" title="Who will you become?" sub="AI-powered personality and life trajectory prediction engine." />
      <div style={{ ...card, padding: 28, marginBottom: 24 }}>
        <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.textMute, textTransform: "uppercase", marginBottom: 14 }}>Prediction timeframe</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          {["6 months","1 year","3 years","5 years","10 years"].map(t => (
            <button key={t} onClick={() => setTimeframe(t)} style={{
              padding: "10px 22px", borderRadius: 100, border: `1.5px solid ${timeframe === t ? C.bgDark : C.border}`,
              background: timeframe === t ? C.bgDark : "transparent",
              color: timeframe === t ? C.white : C.textSub, fontSize: 13, cursor: "pointer", fontFamily: FONT_DISPLAY, fontWeight: timeframe === t ? 600 : 400,
            }}>{t}</button>
          ))}
        </div>
        <button onClick={generate} disabled={loading} style={{
          padding: "14px 32px", borderRadius: 100, background: C.bgDark, color: C.white, border: "none",
          cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: FONT_DISPLAY, opacity: loading ? 0.4 : 1,
        }}>{loading ? "Simulating…" : "Generate future self →"}</button>
      </div>

      {prediction && (
        <div style={{ display: "grid", gap: 14 }}>
          <div style={{ ...cardDark, padding: 32, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: 8 }}>Overall Outlook in {timeframe}</div>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 40, fontWeight: 900, letterSpacing: -2, color: C.white, textTransform: "capitalize" }}>{prediction.overallOutlook}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 56, fontWeight: 900, letterSpacing: -3, color: C.white }}>{prediction.probability}%</div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: "rgba(255,255,255,0.4)" }}>CONFIDENCE</div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {[["Personality Evolution", prediction.personalityEvolution], ["Career Trajectory", prediction.careerTrajectory], ["Cognitive Growth", prediction.cognitiveGrowth], ["Emotional Maturity", prediction.emotionalMaturity]].map(([l, v]) => (
              <div key={l} style={{ ...card, padding: 24 }}>
                <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.textMute, textTransform: "uppercase", marginBottom: 10 }}>{l}</div>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 14, color: C.text, lineHeight: 1.7 }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div style={{ ...card, padding: 24 }}>
              <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.textMute, textTransform: "uppercase", marginBottom: 12 }}>Key Milestones</div>
              {prediction.keyMilestones?.map((m, i) => (
                <div key={i} style={{ fontFamily: FONT_DISPLAY, fontSize: 13, color: C.text, marginBottom: 10, display: "flex", gap: 10 }}>
                  <span style={{ fontFamily: FONT_MONO, color: C.textMute }}>{i+1}.</span> {m}
                </div>
              ))}
            </div>
            <div style={{ ...card, padding: 24 }}>
              <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.textMute, textTransform: "uppercase", marginBottom: 12 }}>Watch List</div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.textMute, marginBottom: 6 }}>MAIN CHALLENGE</div>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 13, color: C.text, lineHeight: 1.6, marginBottom: 16 }}>{prediction.potentialChallenge}</div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.textMute, marginBottom: 6 }}>KEY OPPORTUNITY</div>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 13, color: C.text, lineHeight: 1.6 }}>{prediction.opportunityToWatch}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── APP SHELL ─────────────────────────────────────────────────────────────────
export default function App() {
  const [phase, setPhase] = useState("landing");
  const [profile, setProfile] = useState(null);
  const [page, setPage] = useState("dashboard");

  useEffect(() => { injectFonts(); }, []);

  const PAGE_MAP = { dashboard: Dashboard, twin: TwinChat, memory: MemoryEngine, emotions: EmotionalAI, decisions: DecisionSim, timeline: CognitiveTimeline, future: FutureSelf };
  const PageComponent = PAGE_MAP[page] || Dashboard;

  if (phase === "landing") return <LandingPage onEnter={() => setPhase("onboarding")} />;
  if (phase === "onboarding") return <Onboarding onComplete={p => { setProfile(p); setPhase("app"); }} />;

  return (
    <div style={{ minHeight: "100vh", background: C.bgOff, fontFamily: FONT_DISPLAY }}>
      <TopNav name={profile?.name} page={page} onNav={setPage} />
      <div style={{ overflowY: "auto" }}>
        <PageComponent profile={profile} />
      </div>
    </div>
  );
}
