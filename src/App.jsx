import { useState, useEffect } from "react";

/* ─── THEME ─── */
const O = "#F5A623";
const DARK = "#0a0a0a";
const DARK2 = "#111111";
const CARD = "#161616";
const CARD2 = "#1c1c1c";
const BORDER = "#2a2a2a";
const GOLD = "#b8862a";

/* ─── SHARED STYLES ─── */
const inp = {
  background: "#0d0d0d", border: "1px solid #2e2e2e", borderRadius: 8,
  color: "white", padding: "11px 14px", fontSize: 14, width: "100%",
  outline: "none", boxSizing: "border-box", fontFamily: "inherit",
  transition: "border-color 0.2s"
};
const lbl = { fontSize: 11, color: "#666", marginBottom: 6, display: "block", textTransform: "uppercase", letterSpacing: 1 };
const dCard = { background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "18px 20px" };
const oCard = { background: GOLD + "18", border: `1px solid ${GOLD}44`, borderRadius: 10, padding: "18px 20px" };
const section = { maxWidth: 1100, margin: "0 auto", padding: "80px 32px" };

function btn(full, variant = "primary") {
  const styles = {
    primary: { background: O, color: "#000", border: "none" },
    secondary: { background: "transparent", color: "white", border: "1px solid #333" },
    outline: { background: "transparent", color: O, border: `1px solid ${O}55` },
  };
  return {
    ...styles[variant],
    borderRadius: 8, fontWeight: "bold", cursor: "pointer",
    padding: full ? "14px 0" : "11px 24px",
    width: full ? "100%" : "auto",
    fontSize: 14, fontFamily: "inherit", transition: "opacity 0.2s"
  };
}

/* ─── SHARED UI ─── */
function ScoreRing({ score, size = 120 }) {
  const r = 44, circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 75 ? "#22c55e" : score >= 50 ? O : "#ef4444";
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={r} fill="none" stroke="#2a2a2a" strokeWidth="8"/>
      <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="8"
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        transform="rotate(-90 50 50)" style={{ transition: "stroke-dashoffset 0.8s ease" }}/>
      <text x="50" y="46" textAnchor="middle" fill="white" fontSize="19" fontWeight="bold">{score}</text>
      <text x="50" y="60" textAnchor="middle" fill="#666" fontSize="9">/100</text>
    </svg>
  );
}
function Tag({ text, color = O }) {
  return <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 20, background: color+"22", border: `1px solid ${color}55`, color, fontSize: 11, fontWeight: "bold", marginRight: 4, marginBottom: 2 }}>{text}</span>;
}
function LockOverlay({ onUpgrade }) {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 10, background: "linear-gradient(to bottom, transparent 0%, rgba(10,10,10,0.85) 35%, rgba(10,10,10,0.98) 100%)", borderRadius: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", padding: "28px 24px" }}>
      <div style={{ fontSize: 28, marginBottom: 10 }}>🔒</div>
      <div style={{ fontSize: 15, fontWeight: "bold", color: "white", marginBottom: 6 }}>Members Only</div>
      <div style={{ fontSize: 13, color: "#777", marginBottom: 18, textAlign: "center", maxWidth: 260 }}>Join Investor Lab to unlock full results, save deals, and access the live community.</div>
      <button onClick={onUpgrade} style={{ ...btn(false), fontSize: 13 }}>🚀 Unlock Full Access →</button>
    </div>
  );
}
function UpgradePopup({ onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(0,0,0,0.88)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#111", border: `1px solid ${GOLD}55`, borderRadius: 18, padding: "40px 36px", maxWidth: 480, width: "100%", position: "relative", textAlign: "center" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 14, right: 18, background: "none", border: "none", color: "#555", fontSize: 20, cursor: "pointer" }}>✕</button>
        <div style={{ fontSize: 40, marginBottom: 14 }}>⚡</div>
        <div style={{ fontSize: 11, color: O, letterSpacing: 3, textTransform: "uppercase", marginBottom: 10 }}>You just analyzed your first deal</div>
        <div style={{ fontSize: 24, fontWeight: "bold", color: "white", marginBottom: 14, lineHeight: 1.3 }}>Imagine doing this on every deal, every day.</div>
        <div style={{ fontSize: 14, color: "#777", lineHeight: 1.7, marginBottom: 24 }}>
          Your free trial gave you a taste. Members get <strong style={{ color: "white" }}>unlimited deal analyses</strong>, saved results, the full Deal Finder, all 7 outreach scripts, and a live investor community.
        </div>
        <div style={{ ...dCard, marginBottom: 22, textAlign: "left" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div><div style={{ fontSize: 13, fontWeight: "bold", color: "white" }}>Investor Lab</div><div style={{ fontSize: 11, color: "#555" }}>AI Deal Engine + Full Community</div></div>
            <div style={{ textAlign: "right" }}><div style={{ fontSize: 11, color: O }}>$197 enrollment</div><div style={{ fontSize: 18, fontWeight: "bold", color: O }}>$99<span style={{ fontSize: 12, color: "#555" }}>/mo</span></div></div>
          </div>
          {["Unlimited deal analyses","Full Deal Finder — all results","Investor Deal Room access","All 7 outreach scripts","Live investor community"].map(f => (
            <div key={f} style={{ fontSize: 12, color: "#777", padding: "4px 0", display: "flex", gap: 8 }}><span style={{ color: O }}>✓</span>{f}</div>
          ))}
        </div>
        <a href="#pricing" onClick={onClose} style={{ display: "block", textAlign: "center", textDecoration: "none", background: O, color: "#000", border: "none", borderRadius: 8, padding: "13px 0", width: "100%", fontWeight: "bold", fontSize: 14, marginBottom: 10 }}>
          Join Investor Lab →
        </a>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#555", fontSize: 13, cursor: "pointer" }}>Continue with free trial</button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   LANDING PAGE
───────────────────────────────────────────── */
function LandingPage({ onRegister, onLogin }) {
  const pillars = [
    { icon: "🔍", n: "01", title: "AI Deal Finder", desc: "Scans millions of properties using profitability signals — absentee owners, distressed, foreclosure, appreciation — to surface deals before anyone else sees them." },
    { icon: "📊", n: "02", title: "AI Deal Analyzer", desc: "Enter any property and get a full breakdown in seconds: profit margin, ROI, MAO, holding costs, and a proprietary Deal Score." },
    { icon: "⚡", n: "03", title: "Opportunity Score", desc: "A composite 0–100 rating based on profit margin, neighborhood appreciation, rental demand, days on market, and seller motivation." },
    { icon: "📞", n: "04", title: "Seller Outreach", desc: "AI-generated scripts for cold SMS, calls, direct mail, follow-ups, offer letters, objection handling, and full acquisition strategy playbooks." },
    { icon: "🤝", n: "05", title: "Investor Deal Room", desc: "A live community where members post deals, find co-investors, secure capital, and close together. Your network is your net worth." },
  ];
  const nuggets = [
    "Start with the end in mind","Know your area","You make money when you buy",
    "Due diligence is the mother of good luck","Network = Net Worth","Be prepared for opportunity",
    "Never stop learning","You gotta be hungry","Don't get paralyzed",
    "Stay organized","Time is not your friend in RE","If it makes money it makes sense",
  ];
  const pricing = [
    { name: "Course Only", price: "$297", sub: "one-time", badge: null, features: ["Full video curriculum","12 Golden Nuggets framework","Self-paced learning","NO deal engine access"], cta: "Get the Course", highlight: false },
    { name: "Investor Lab", price: "$99", sub: "/mo", badge: "BEST VALUE", enrollment: "$197 enrollment", features: ["Everything in Course","AI Deal Engine — full access","Investor Deal Room","All 7 outreach scripts","Live investor community"], cta: "Join Investor Lab", highlight: true },
    { name: "Group Coaching", price: "$297", sub: "/mo", badge: null, enrollment: "$497 enrollment", features: ["Everything in Investor Lab","Weekly live coaching calls","Deal reviews with Kris","Hot seat Q&A sessions","Priority community support"], cta: "Join Group Coaching", highlight: false },
    { name: "1-on-1 Elite", price: "Application", sub: "only", badge: null, features: ["Fully personalized coaching","Direct access to Kris","Custom deal strategy","Weekly 1-on-1 sessions","Network introductions"], cta: "Apply Now", highlight: false, email: true },
  ];

  return (
    <div style={{ background: DARK, color: "white", fontFamily: "'DM Sans', 'Trebuchet MS', sans-serif", minHeight: "100vh" }}>

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(10,10,10,0.92)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${BORDER}`, padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: 2, color: "white" }}>THE <span style={{ color: O }}>AI DEAL ENGINE</span></div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button onClick={onLogin} style={{ background: "none", border: "none", color: "#888", cursor: "pointer", fontSize: 14, fontFamily: "inherit" }}>Sign In</button>
          <button onClick={onRegister} style={{ ...btn(false), fontSize: 13, padding: "9px 20px" }}>Start Free Trial</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", padding: "120px 32px 80px" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 60% 40%, rgba(245,166,35,0.07) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(245,166,35,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(245,166,35,0.04) 1px, transparent 1px)", backgroundSize: "60px 60px", WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)" }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1, display: "flex", gap: 60, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 300 }}>
            <div style={{ fontSize: 11, color: O, letterSpacing: 4, textTransform: "uppercase", marginBottom: 20 }}>Real Estate Investing Coaching</div>
            <h1 style={{ fontSize: "clamp(42px, 7vw, 76px)", fontWeight: 900, lineHeight: 1.05, marginBottom: 24, letterSpacing: "-1px" }}>
              STOP GUESSING.<br/><span style={{ color: O }}>START CLOSING.</span>
            </h1>
            <p style={{ fontSize: 18, color: "#aaa", lineHeight: 1.7, marginBottom: 36, maxWidth: 520 }}>
              A <strong style={{ color: "white" }}>complete real estate investing system</strong> — the education, the tools, the community, and the coaching you need to find deals, analyze them fast, and build real wealth.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <button onClick={onRegister} style={{ ...btn(false), fontSize: 16, padding: "14px 32px" }}>Start Free Trial →</button>
              <a href="#what-you-get" style={{ ...btn(false, "secondary"), fontSize: 16, padding: "14px 28px", textDecoration: "none" }}>See What's Inside</a>
            </div>
            <div style={{ marginTop: 28, fontSize: 12, color: "#444" }}>✓ No credit card required &nbsp;·&nbsp; ✓ Free trial access instantly</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, minWidth: 280, flex: "0 0 auto" }}>
            {[["🔍","5","AI Pillars"],["📊","∞","Deal Analyses"],["🤝","Live","Deal Room"],["⚡","12","Golden Nuggets"]].map(([icon,num,label]) => (
              <div key={label} style={{ ...dCard, textAlign: "center", padding: "20px 16px" }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: O }}>{num}</div>
                <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT'S INSIDE */}
      <section id="what-you-get" style={{ ...section, borderTop: `1px solid ${BORDER}` }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ fontSize: 11, color: O, letterSpacing: 4, textTransform: "uppercase", marginBottom: 12 }}>The Program</div>
          <h2 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 900, lineHeight: 1.1 }}>EVERYTHING YOU NEED<br/><span style={{ color: O }}>TO CLOSE DEALS</span></h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
          {[
            { icon: "🤖", title: "The AI Deal Engine", desc: "Five AI-powered tools built for investors: Deal Finder, Deal Analyzer, Opportunity Score, Seller Outreach, and the Investor Deal Room. Real-time deal intelligence at your fingertips." },
            { icon: "📚", title: "Complete Education", desc: "A full curriculum covering wholesaling, fix & flip, rentals, BRRRR, creative financing, and more — structured for beginners and seasoned investors alike." },
            { icon: "📐", title: "12 Golden Nuggets", desc: "Kris's 12 core investing principles — a decision-making framework you can apply to any deal, any market, any strategy." },
            { icon: "🤝", title: "The Investor Community", desc: "A live network of active investors sharing deals, insights, and resources. Who you know matters as much as what you know." },
            { icon: "🎯", title: "Live Coaching", desc: "Weekly coaching calls, deal reviews, hot seat Q&As, and direct access to Kris (Group and Elite tiers). Theory means nothing without execution." },
            { icon: "📋", title: "Deal Systems & Scripts", desc: "Outreach scripts, negotiation frameworks, acquisition strategies, offer letter templates, and objection handlers — built right into the AI Deal Engine." },
          ].map(f => (
            <div key={f.title} style={{ ...dCard, borderTop: `2px solid ${O}22` }}>
              <div style={{ fontSize: 32, marginBottom: 14 }}>{f.icon}</div>
              <div style={{ fontSize: 16, fontWeight: "bold", color: "white", marginBottom: 10 }}>{f.title}</div>
              <div style={{ fontSize: 14, color: "#666", lineHeight: 1.7 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 5 PILLARS */}
      <section style={{ background: "#0d0d0d", borderTop: `1px solid ${BORDER}` }}>
        <div style={section}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 11, color: O, letterSpacing: 4, textTransform: "uppercase", marginBottom: 12 }}>The Tool</div>
            <h2 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 900, lineHeight: 1.1 }}>THE 5 PILLARS OF<br/><span style={{ color: O }}>THE AI DEAL ENGINE</span></h2>
            <p style={{ fontSize: 16, color: "#666", marginTop: 16, maxWidth: 560, margin: "16px auto 0" }}>One platform. Five systems. Everything you need to find, analyze, and close deals faster than you ever have before.</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {pillars.map((p, i) => (
              <div key={p.n} style={{ ...dCard, display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap", borderLeft: `3px solid ${O}44` }}>
                <div style={{ fontSize: 11, color: O, fontWeight: 900, letterSpacing: 2, minWidth: 28 }}>{p.n}</div>
                <div style={{ fontSize: 32 }}>{p.icon}</div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontSize: 16, fontWeight: "bold", color: "white", marginBottom: 4 }}>{p.title}</div>
                  <div style={{ fontSize: 13, color: "#666", lineHeight: 1.6 }}>{p.desc}</div>
                </div>
                {i < 2 && <span style={{ background: "#22c55e22", border: "1px solid #22c55e44", color: "#22c55e", fontSize: 10, padding: "3px 10px", borderRadius: 20, fontWeight: "bold", whiteSpace: "nowrap" }}>✓ Free Trial</span>}
                {i >= 2 && <span style={{ background: O+"18", border: `1px solid ${O}33`, color: O, fontSize: 10, padding: "3px 10px", borderRadius: 20, fontWeight: "bold", whiteSpace: "nowrap" }}>Members Only</span>}
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <button onClick={onRegister} style={{ ...btn(false), fontSize: 15, padding: "13px 36px" }}>Try the AI Deal Engine Free →</button>
          </div>
        </div>
      </section>

      {/* GOLDEN NUGGETS */}
      <section style={{ ...section, borderTop: `1px solid ${BORDER}` }}>
        <div style={{ display: "flex", gap: 60, flexWrap: "wrap", alignItems: "flex-start" }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <div style={{ fontSize: 11, color: O, letterSpacing: 4, textTransform: "uppercase", marginBottom: 12 }}>The Framework</div>
            <h2 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 20 }}>THE 12<br/><span style={{ color: O }}>GOLDEN NUGGETS</span></h2>
            <div style={{ width: 40, height: 3, background: O, marginBottom: 24 }} />
            <p style={{ fontSize: 15, color: "#777", lineHeight: 1.8 }}>These aren't motivational quotes. These are 12 battle-tested principles that guide every deal decision — the same framework Kris uses on every acquisition.</p>
          </div>
          <div style={{ flex: 1, minWidth: 280 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {nuggets.map((n, i) => (
                <div key={n} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "12px 14px", background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 8 }}>
                  <span style={{ color: O, fontWeight: 900, fontSize: 13, minWidth: 22 }}>{String(i+1).padStart(2,"0")}</span>
                  <span style={{ fontSize: 12, color: "#999", lineHeight: 1.5 }}>{n}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ background: "#0d0d0d", borderTop: `1px solid ${BORDER}` }}>
        <div style={section}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 11, color: O, letterSpacing: 4, textTransform: "uppercase", marginBottom: 12 }}>Pricing</div>
            <h2 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 900, lineHeight: 1.1 }}>CHOOSE YOUR<br/><span style={{ color: O }}>LEVEL</span></h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
            {pricing.map(p => (
              <div key={p.name} style={{ position: "relative", background: p.highlight ? "#111" : CARD2, border: `1px solid ${p.highlight ? O+"66" : BORDER}`, borderRadius: 14, padding: "28px 24px", display: "flex", flexDirection: "column" }}>
                {p.badge && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: O, color: "#000", fontSize: 10, fontWeight: 900, padding: "4px 14px", borderRadius: 20, letterSpacing: 1, whiteSpace: "nowrap" }}>{p.badge}</div>}
                <div style={{ fontSize: 14, fontWeight: "bold", color: "white", marginBottom: 16 }}>{p.name}</div>
                {p.enrollment && <div style={{ fontSize: 11, color: "#555", marginBottom: 4 }}>{p.enrollment}</div>}
                <div style={{ marginBottom: 20 }}>
                  <span style={{ fontSize: 36, fontWeight: 900, color: p.highlight ? O : "white" }}>{p.price}</span>
                  <span style={{ fontSize: 13, color: "#555" }}> {p.sub}</span>
                </div>
                <div style={{ flex: 1 }}>
                  {p.features.map(f => (
                    <div key={f} style={{ display: "flex", gap: 10, padding: "6px 0", fontSize: 13, color: "#888", borderBottom: `1px solid ${BORDER}` }}>
                      <span style={{ color: p.highlight ? O : "#444" }}>✓</span>{f}
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 24 }}>
                  {p.email
                    ? <a href="mailto:alphaluxliving@gmail.com" style={{ ...btn(true), display: "block", textAlign: "center", textDecoration: "none", background: CARD, color: "#888", border: `1px solid ${BORDER}` }}>{p.cta}</a>
                    : <button onClick={onRegister} style={{ ...btn(true, p.highlight ? "primary" : "secondary") }}>{p.cta}</button>
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT KRIS */}
      <section style={{ ...section, borderTop: `1px solid ${BORDER}` }}>
        <div style={{ display: "flex", gap: 60, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ width: 240, height: 300, borderRadius: 14, background: `linear-gradient(135deg, ${O}22, #1a1a1a)`, border: `1px solid ${O}33`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 64 }}>
            🧑🏽‍💼
          </div>
          <div style={{ flex: 1, minWidth: 260 }}>
            <div style={{ fontSize: 11, color: O, letterSpacing: 4, textTransform: "uppercase", marginBottom: 12 }}>Your Coach</div>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 900, marginBottom: 16 }}>KRIS ALFARO</h2>
            <div style={{ width: 40, height: 3, background: O, marginBottom: 20 }} />
            <p style={{ fontSize: 15, color: "#888", lineHeight: 1.8, marginBottom: 14 }}>I built this program because I know what it feels like to be overwhelmed by real estate — the analysis paralysis, not knowing where to start, not having the right people around you.</p>
            <p style={{ fontSize: 15, color: "#888", lineHeight: 1.8, marginBottom: 20 }}>The <strong style={{ color: "white" }}>AI Deal Engine</strong> and the <strong style={{ color: "white" }}>12 Golden Nuggets</strong> are the exact system I wish I had when I started. Not theory — <strong style={{ color: O }}>execution</strong>.</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["🏠 Wholesaling","🔨 Fix & Flip","🏦 Buy & Hold","🤖 AI Deal Analysis","📍 Phoenix, AZ"].map(t => (
                <span key={t} style={{ background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 20, padding: "5px 14px", fontSize: 12, color: "#888" }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#0d0d0d", borderTop: `1px solid ${BORDER}`, textAlign: "center", padding: "80px 32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 60% 80% at 50% 50%, ${O}08 0%, transparent 70%)` }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 11, color: O, letterSpacing: 4, textTransform: "uppercase", marginBottom: 16 }}>Ready?</div>
          <h2 style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 900, marginBottom: 20, lineHeight: 1.05 }}>STOP WATCHING.<br/><span style={{ color: O }}>START CLOSING.</span></h2>
          <p style={{ fontSize: 16, color: "#666", maxWidth: 500, margin: "0 auto 36px", lineHeight: 1.7 }}>Every day you wait is a deal someone else is closing. The system is built. The community is here. Your move.</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={onRegister} style={{ ...btn(false), fontSize: 16, padding: "14px 36px" }}>Get Started Today →</button>
            <button onClick={onRegister} style={{ ...btn(false, "secondary"), fontSize: 16, padding: "14px 28px" }}>Try Free First</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#060606", borderTop: `1px solid ${BORDER}`, padding: "32px", textAlign: "center" }}>
        <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: 2, color: "white", marginBottom: 8 }}>THE <span style={{ color: O }}>AI DEAL ENGINE</span></div>
        <p style={{ color: "#444", fontSize: 12, marginTop: 8 }}>© 2026 The AI Deal Engine. All rights reserved.</p>
        <p style={{ color: "#333", fontSize: 11, marginTop: 6, maxWidth: 560, margin: "8px auto 0" }}>Real estate investing involves risk. Results vary based on market conditions, experience, and individual effort. This is not financial advice.</p>
      </footer>
    </div>
  );
}

/* ─────────────────────────────────────────────
   AUTH PAGES
───────────────────────────────────────────── */
function AuthPage({ mode, onSuccess, onSwitch, onBack }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    setError("");
    if (mode === "register") {
      if (!form.name.trim()) return setError("Please enter your name.");
      if (!form.email.includes("@")) return setError("Please enter a valid email.");
      if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    } else {
      if (!form.email.includes("@")) return setError("Please enter your email.");
      if (!form.password) return setError("Please enter your password.");
    }
    setLoading(true);
    // TODO: Replace with Clerk auth — this is a mock for now
    setTimeout(() => {
      const user = { name: form.name || form.email.split("@")[0], email: form.email, plan: "free_trial" };
      try { localStorage.setItem("aide_user", JSON.stringify(user)); } catch(e) {}
      onSuccess(user);
      setLoading(false);
    }, 900);
  };

  return (
    <div style={{ minHeight: "100vh", background: DARK, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "'DM Sans', 'Trebuchet MS', sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <button onClick={onBack} style={{ background: "none", border: "none", color: O, cursor: "pointer", fontSize: 13, fontFamily: "inherit", marginBottom: 24, display: "block", margin: "0 auto 24px" }}>← Back to site</button>
          <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: 2, color: "white" }}>THE <span style={{ color: O }}>AI DEAL ENGINE</span></div>
        </div>

        <div style={{ background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 16, padding: "36px 32px" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: "white", marginBottom: 6 }}>
              {mode === "register" ? "Start Your Free Trial" : "Welcome Back"}
            </div>
            <div style={{ fontSize: 13, color: "#555" }}>
              {mode === "register" ? "Create your account — no credit card needed" : "Sign in to your account"}
            </div>
          </div>

          {mode === "register" && (
            <div style={{ marginBottom: 16 }}>
              <label style={lbl}>Your Name</label>
              <input value={form.name} onChange={e => set("name", e.target.value)} style={inp} placeholder="Kris Alfaro" onKeyDown={e => e.key==="Enter" && handleSubmit()} />
            </div>
          )}
          <div style={{ marginBottom: 16 }}>
            <label style={lbl}>Email Address</label>
            <input type="email" value={form.email} onChange={e => set("email", e.target.value)} style={inp} placeholder="you@email.com" onKeyDown={e => e.key==="Enter" && handleSubmit()} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={lbl}>Password</label>
            <input type="password" value={form.password} onChange={e => set("password", e.target.value)} style={inp} placeholder={mode==="register"?"Create a password (6+ chars)":"Your password"} onKeyDown={e => e.key==="Enter" && handleSubmit()} />
          </div>

          {error && <div style={{ background: "#ef444418", border: "1px solid #ef444444", borderRadius: 8, padding: "10px 14px", color: "#f87171", fontSize: 13, marginBottom: 18 }}>{error}</div>}

          <button onClick={handleSubmit} disabled={loading} style={{ ...btn(true), opacity: loading ? 0.7 : 1 }}>
            {loading ? "⚙️ Setting up your account..." : mode === "register" ? "Create Free Account →" : "Sign In →"}
          </button>

          {mode === "register" && (
            <div style={{ marginTop: 16, padding: "14px", background: "#0d0d0d", borderRadius: 8, border: "1px solid #1a1a1a" }}>
              <div style={{ fontSize: 12, color: "#555", lineHeight: 1.7 }}>
                <span style={{ color: O, fontWeight: "bold" }}>Free trial includes:</span><br/>
                ✓ AI Deal Analyzer (1 free analysis)<br/>
                ✓ Opportunity Score (unlimited)<br/>
                ✓ Deal Finder preview (top 3 results)<br/>
                ✓ Cold SMS outreach script
              </div>
            </div>
          )}

          <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "#555" }}>
            {mode === "register" ? (
              <>Already have an account? <button onClick={onSwitch} style={{ background: "none", border: "none", color: O, cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>Sign in</button></>
            ) : (
              <>Don't have an account? <button onClick={onSwitch} style={{ background: "none", border: "none", color: O, cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>Start free trial</button></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   DEAL ENGINE (gated dashboard)
───────────────────────────────────────────── */
function DealEngineDashboard({ user, onLogout, onUpgrade }) {
  const [active, setActive] = useState("finder");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [freeAnalysisDone, setFreeAnalysisDone] = useState(false);
  const isMember = user?.plan === "member";
  const pillars = [
    { id: 1, key: "finder", icon: "🔍", name: "AI Deal Finder", subtitle: "Scan. Identify. Act." },
    { id: 2, key: "analyzer", icon: "📊", name: "AI Deal Analyzer", subtitle: "Instant Acquisition Intelligence" },
    { id: 3, key: "score", icon: "⚡", name: "Opportunity Score", subtitle: "Focus on High-Probability Deals" },
    { id: 4, key: "outreach", icon: "📞", name: "Seller Outreach", subtitle: "From Analysis to Acquisition" },
    { id: 5, key: "dealroom", icon: "🤝", name: "Investor Deal Room", subtitle: "Where Technology Meets Relationships" },
  ];
  const current = pillars.find(p => p.key === active);
  const panelProps = { isMember, onUpgrade: () => setShowUpgrade(true) };
  const handleAnalysisDone = () => { setFreeAnalysisDone(true); setTimeout(() => setShowUpgrade(true), 1200); };

  return (
    <div style={{ minHeight: "100vh", background: DARK2, color: "white", fontFamily: "'Trebuchet MS', 'Gill Sans', sans-serif" }}>
      {showUpgrade && <UpgradePopup onClose={() => setShowUpgrade(false)} />}

      {/* Header */}
      <div style={{ background: "#0d0d0d", borderBottom: `2px solid ${GOLD}44`, padding: "14px 32px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <div>
            <div style={{ fontSize: 10, color: O, textTransform: "uppercase", letterSpacing: 4, marginBottom: 3 }}>Deal Lab</div>
            <div style={{ fontSize: 20, fontWeight: "bold" }}><span style={{ color: "white" }}>THE </span><span style={{ color: O }}>AI DEAL ENGINE</span></div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            {!isMember && (
              <span style={{ background: O+"18", border: `1px solid ${O}33`, color: O, fontSize: 11, padding: "4px 12px", borderRadius: 20, fontWeight: "bold" }}>🎁 FREE TRIAL</span>
            )}
            {!isMember && (
              <button onClick={() => setShowUpgrade(true)} style={{ ...btn(false), fontSize: 12, padding: "8px 16px" }}>Upgrade →</button>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 10, paddingLeft: 10, borderLeft: `1px solid ${BORDER}` }}>
              <div style={{ fontSize: 12, color: "#555" }}>👋 {user?.name}</div>
              <button onClick={onLogout} style={{ background: "none", border: `1px solid ${BORDER}`, color: "#555", borderRadius: 6, padding: "5px 12px", cursor: "pointer", fontSize: 11, fontFamily: "inherit" }}>Sign Out</button>
            </div>
            <div style={{ fontSize: 11, color: O }}>● LIVE</div>
          </div>
        </div>
      </div>

      {/* Nav Tabs */}
      <div style={{ background: "#0d0d0d", borderBottom: "1px solid #1a1a1a", overflowX: "auto" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", display: "flex" }}>
          {pillars.map(p => (
            <button key={p.key} onClick={() => setActive(p.key)} style={{
              background: "none", border: "none", cursor: "pointer", padding: "13px 18px",
              borderBottom: active===p.key ? `2px solid ${O}` : "2px solid transparent",
              color: active===p.key ? O : "#555", fontWeight: active===p.key ? "bold" : "normal",
              fontSize: 13, whiteSpace: "nowrap", fontFamily: "inherit",
              display: "flex", alignItems: "center", gap: 6
            }}>
              <span>{p.icon}</span><span>{p.id}. {p.name}</span>
              {!isMember && [4,5].includes(p.id) && <span style={{ fontSize: 9, color: "#333" }}>🔒</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Panel */}
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "28px 32px" }}>
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "28px 30px" }}>
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 10, color: O, textTransform: "uppercase", letterSpacing: 3, marginBottom: 4 }}>Pillar {current.id}</div>
            <div style={{ fontSize: 22, fontWeight: "bold", color: "white" }}>{current.icon} {current.name}</div>
            <div style={{ fontSize: 13, color: "#555", marginTop: 2 }}>{current.subtitle}</div>
            <div style={{ width: 40, height: 2, background: O, marginTop: 10 }} />
          </div>
          {active==="finder" && <DealFinderPanel {...panelProps} />}
          {active==="analyzer" && <DealAnalyzerPanel {...panelProps} freeAnalysisDone={freeAnalysisDone} onAnalysisDone={handleAnalysisDone} />}
          {active==="score" && <OpportunityScorePanel />}
          {active==="outreach" && <SellerOutreachPanel {...panelProps} />}
          {active==="dealroom" && <DealRoomPanel {...panelProps} />}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   DEAL ENGINE PANELS (same as before)
───────────────────────────────────────────── */
const inp2 = { background: "#161616", border: "1px solid #3a3a3a", borderRadius: 7, color: "white", padding: "9px 12px", fontSize: 14, width: "100%", outline: "none", boxSizing: "border-box", fontFamily: "inherit" };
const lbl2 = { fontSize: 10, color: "#777", marginBottom: 5, display: "block", textTransform: "uppercase", letterSpacing: 1 };
const dCard2 = { background: "#222222", border: "1px solid #2e2e2e", borderRadius: 10, padding: "18px 20px" };

function DealFinderPanel({ isMember, onUpgrade }) {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [signal, setSignal] = useState("all");
  const [f, setF] = useState({ city: "Phoenix, AZ", zip: "", minPrice: 0, maxPrice: 500000, minBeds: 0, maxBeds: 10, minBaths: 0, maxBaths: 10, minSqft: 0, maxSqft: 10000, propType: "all", condition: "all" });
  const sf = (k, v) => setF(p => ({ ...p, [k]: v }));
  const allProps = [
    { address: "4821 W McDowell Rd", zip: "85035", price: 185000, arv: 295000, rehab: 45000, score: 87, beds: 3, baths: 2, sqft: 1420, propType: "sfr", condition: "fair", signal: "absentee", signalLabel: "Absentee Owner", dom: 47 },
    { address: "1103 E Van Buren St", zip: "85006", price: 172000, arv: 310000, rehab: 78000, score: 74, beds: 4, baths: 2, sqft: 1780, propType: "sfr", condition: "poor", signal: "distressed", signalLabel: "Distressed Property", dom: 112 },
    { address: "7302 N 19th Ave", zip: "85015", price: 155000, arv: 248000, rehab: 38000, score: 91, beds: 3, baths: 1, sqft: 1250, propType: "sfr", condition: "fair", signal: "foreclosure", signalLabel: "Foreclosure Signal", dom: 19 },
    { address: "2914 S Mill Ave", zip: "85282", price: 272000, arv: 410000, rehab: 55000, score: 79, beds: 4, baths: 3, sqft: 2100, propType: "multi", condition: "good", signal: "appreciation", signalLabel: "Market Appreciation", dom: 8 },
    { address: "8851 E Thomas Rd", zip: "85251", price: 198000, arv: 320000, rehab: 42000, score: 83, beds: 3, baths: 2, sqft: 1560, propType: "sfr", condition: "fair", signal: "absentee", signalLabel: "Absentee Owner", dom: 63 },
    { address: "3341 W Camelback Rd", zip: "85017", price: 289000, arv: 445000, rehab: 67000, score: 76, beds: 5, baths: 3, sqft: 2380, propType: "sfr", condition: "good", signal: "foreclosure", signalLabel: "Foreclosure Signal", dom: 31 },
    { address: "1204 E Indian School Rd", zip: "85014", price: 145000, arv: 230000, rehab: 32000, score: 88, beds: 2, baths: 1, sqft: 980, propType: "condo", condition: "fair", signal: "distressed", signalLabel: "Distressed Property", dom: 88 },
    { address: "5610 N 7th St #204", zip: "85014", price: 165000, arv: 260000, rehab: 28000, score: 82, beds: 2, baths: 2, sqft: 1100, propType: "condo", condition: "good", signal: "absentee", signalLabel: "Absentee Owner", dom: 44 },
    { address: "921 W Glendale Ave", zip: "85021", price: 310000, arv: 480000, rehab: 85000, score: 71, beds: 4, baths: 2, sqft: 2200, propType: "multi", condition: "poor", signal: "distressed", signalLabel: "Distressed Property", dom: 135 },
    { address: "3802 E Thunderbird Rd", zip: "85032", price: 225000, arv: 355000, rehab: 48000, score: 85, beds: 3, baths: 2, sqft: 1680, propType: "townhouse", condition: "fair", signal: "foreclosure", signalLabel: "Foreclosure Signal", dom: 22 },
    { address: "7011 S Central Ave", zip: "85040", price: 138000, arv: 218000, rehab: 35000, score: 89, beds: 3, baths: 1, sqft: 1150, propType: "sfr", condition: "poor", signal: "foreclosure", signalLabel: "Foreclosure Signal", dom: 67 },
    { address: "2233 W Dunlap Ave", zip: "85021", price: 195000, arv: 305000, rehab: 40000, score: 80, beds: 3, baths: 2, sqft: 1490, propType: "townhouse", condition: "fair", signal: "appreciation", signalLabel: "Market Appreciation", dom: 14 },
  ];
  const signalColors = { absentee: "#60a5fa", distressed: "#f87171", foreclosure: "#fb923c", appreciation: "#34d399" };
  const signals = [{ key: "all", label: "All Signals" },{ key: "absentee", label: "👤 Absentee" },{ key: "distressed", label: "🏚 Distressed" },{ key: "foreclosure", label: "⚠️ Foreclosure" },{ key: "appreciation", label: "📈 Appreciation" }];
  const propTypes = [{ key: "all", label: "All Types" },{ key: "sfr", label: "🏠 SFR" },{ key: "multi", label: "🏢 Multi-Family" },{ key: "condo", label: "🏙 Condo" },{ key: "townhouse", label: "🏘 Townhouse" }];
  const conditions = [{ key: "all", label: "Any Condition" },{ key: "good", label: "✅ Good" },{ key: "fair", label: "🟡 Fair" },{ key: "poor", label: "🔴 Poor" }];
  const conditionColors = { good: "#22c55e", fair: "#f59e0b", poor: "#ef4444" };
  const FREE_LIMIT = 3;
  const scan = () => {
    setLoading(true);
    setTimeout(() => {
      let filtered = allProps.filter(p => (signal==="all"||p.signal===signal)&&(f.zip===""||p.zip.includes(f.zip))&&p.price>=f.minPrice&&p.price<=f.maxPrice&&p.beds>=f.minBeds&&p.beds<=f.maxBeds&&p.baths>=f.minBaths&&p.baths<=f.maxBaths&&p.sqft>=f.minSqft&&p.sqft<=f.maxSqft&&(f.propType==="all"||p.propType===f.propType)&&(f.condition==="all"||p.condition===f.condition));
      setResults(filtered.sort((a,b)=>b.score-a.score));
      setLoading(false);
    }, 1600);
  };
  const resetFilters = () => { setF({ city: "Phoenix, AZ", zip: "", minPrice: 0, maxPrice: 500000, minBeds: 0, maxBeds: 10, minBaths: 0, maxBaths: 10, minSqft: 0, maxSqft: 10000, propType: "all", condition: "all" }); setSignal("all"); setResults(null); };

  return (
    <div>
      <p style={{ color: "#888", fontSize: 13, lineHeight: 1.7, marginBottom: 20 }}>AI-powered deal discovery engine scanning <strong style={{ color: O }}>millions of properties</strong> using profitability signals. Performs in seconds what would take analysts weeks.{!isMember && <span style={{ color: O, fontWeight: "bold" }}> Free trial: top 3 results shown.</span>}</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 10, marginBottom: 22 }}>
        {[{ icon: "👤", title: "Absentee Owners", color: "#60a5fa" },{ icon: "🏚", title: "Distressed Properties", color: "#f87171" },{ icon: "⚠️", title: "Foreclosure Signals", color: "#fb923c" },{ icon: "📈", title: "Market Appreciation", color: "#34d399" }].map(s => (
          <div key={s.title} style={{ ...dCard2, borderLeft: `3px solid ${s.color}` }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 12, fontWeight: "bold", color: s.color }}>{s.title}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 14 }}>
        <div style={{ flex: 3, minWidth: 180 }}><label style={lbl2}>Target Market / City</label><input value={f.city} onChange={e => sf("city",e.target.value)} style={inp2} /></div>
        <div style={{ flex: 1, minWidth: 120 }}><label style={lbl2}>Zip Code</label><input value={f.zip} onChange={e => sf("zip",e.target.value)} style={inp2} placeholder="e.g. 85035" /></div>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
        {signals.map(s => <button key={s.key} onClick={() => setSignal(s.key)} style={{ padding: "7px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 12, background: signal===s.key?O:"#2a2a2a", color: signal===s.key?"#000":"#888", fontWeight: "bold" }}>{s.label}</button>)}
      </div>
      <div style={{ ...dCard2, marginBottom: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(175px, 1fr))", gap: 12 }}>
          <div><label style={lbl2}>Min Price ($)</label><input type="number" value={f.minPrice} onChange={e=>sf("minPrice",+e.target.value)} style={inp2}/></div>
          <div><label style={lbl2}>Max Price ($)</label><input type="number" value={f.maxPrice} onChange={e=>sf("maxPrice",+e.target.value)} style={inp2}/></div>
          <div><label style={lbl2}>Min Beds</label><select value={f.minBeds} onChange={e=>sf("minBeds",+e.target.value)} style={inp2}>{[0,1,2,3,4,5].map(n=><option key={n} value={n}>{n===0?"Any":`${n}+`}</option>)}</select></div>
          <div><label style={lbl2}>Max Beds</label><select value={f.maxBeds} onChange={e=>sf("maxBeds",+e.target.value)} style={inp2}>{[1,2,3,4,5,6,7,8,9,10].map(n=><option key={n} value={n}>{n===10?"Any":n}</option>)}</select></div>
          <div><label style={lbl2}>Min Baths</label><select value={f.minBaths} onChange={e=>sf("minBaths",+e.target.value)} style={inp2}>{[0,1,2,3,4].map(n=><option key={n} value={n}>{n===0?"Any":`${n}+`}</option>)}</select></div>
          <div><label style={lbl2}>Max Baths</label><select value={f.maxBaths} onChange={e=>sf("maxBaths",+e.target.value)} style={inp2}>{[1,2,3,4,5,6,7,8,9,10].map(n=><option key={n} value={n}>{n===10?"Any":n}</option>)}</select></div>
          <div><label style={lbl2}>Property Type</label><select value={f.propType} onChange={e=>sf("propType",e.target.value)} style={inp2}>{propTypes.map(t=><option key={t.key} value={t.key}>{t.label}</option>)}</select></div>
          <div><label style={lbl2}>Condition</label><select value={f.condition} onChange={e=>sf("condition",e.target.value)} style={inp2}>{conditions.map(c=><option key={c.key} value={c.key}>{c.label}</option>)}</select></div>
        </div>
        <button onClick={resetFilters} style={{ marginTop: 12, background: "none", border: "1px solid #333", color: "#666", borderRadius: 8, padding: "7px 16px", cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>↺ Reset</button>
      </div>
      <button onClick={scan} style={{ background: O, color: "#000", border: "none", borderRadius: 8, padding: "13px 0", width: "100%", fontWeight: "bold", cursor: "pointer", fontSize: 14, fontFamily: "inherit" }}>
        {loading ? "⚙️ Scanning millions of properties..." : "🔍 Scan Market"}
      </button>
      {results && !loading && (
        <div style={{ marginTop: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontSize: 13, color: "#555" }}>
            <span><span style={{ color: O, fontWeight: "bold" }}>{results.length} properties</span> found{!isMember && results.length>FREE_LIMIT && ` — showing top ${FREE_LIMIT} free`}</span>
          </div>
          {results.length === 0 ? (
            <div style={{ ...dCard2, textAlign: "center", padding: 40 }}><div style={{ fontSize: 32 }}>🔍</div><div style={{ color: "#666", marginTop: 12 }}>No properties match your filters.</div></div>
          ) : (
            <>
              {results.slice(0, isMember ? results.length : FREE_LIMIT).map((p,i) => {
                const profit = p.arv-p.price-p.rehab, roi = Math.round((profit/(p.price+p.rehab))*100), sc = signalColors[p.signal], cc = conditionColors[p.condition];
                return (
                  <div key={i} style={{ ...dCard2, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", marginBottom: 10, borderLeft: `3px solid ${sc}` }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: i===0?O:"#1e1e1e", color: i===0?"#000":"#555", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: "bold", flexShrink: 0 }}>{i+1}</div>
                    <div style={{ flex: 2, minWidth: 180 }}>
                      <div style={{ fontWeight: "bold", color: "white", marginBottom: 3 }}>{p.address}</div>
                      <div style={{ color: "#555", fontSize: 11, marginBottom: 5 }}>ZIP {p.zip} · {p.beds}bd/{p.baths}ba · {p.sqft.toLocaleString()} sqft · {p.dom} DOM</div>
                      <div><Tag text={p.signalLabel} color={sc} /><Tag text={propTypes.find(t=>t.key===p.propType)?.label.replace(/^[^\s]+\s/,"")} color="#a78bfa" /></div>
                    </div>
                    {[["ASK",`$${(p.price/1000).toFixed(0)}K`,"white"],["ARV",`$${(p.arv/1000).toFixed(0)}K`,"#aaa"],["PROFIT",`$${profit.toLocaleString()}`,"#22c55e"],["ROI",`${roi}%`,O]].map(([label,val,color]) => (
                      <div key={label} style={{ textAlign: "center", minWidth: 60 }}><div style={{ fontSize: 9, color: "#444", marginBottom: 3, textTransform: "uppercase" }}>{label}</div><div style={{ color, fontWeight: "bold", fontSize: 14 }}>{val}</div></div>
                    ))}
                    <ScoreRing score={p.score} size={68} />
                  </div>
                );
              })}
              {!isMember && results.length > FREE_LIMIT && (
                <div style={{ position: "relative", borderRadius: 10, overflow: "hidden" }}>
                  {results.slice(FREE_LIMIT).map((p,i) => {
                    const sc = signalColors[p.signal];
                    return (
                      <div key={i} style={{ ...dCard2, display: "flex", alignItems: "center", gap: 14, marginBottom: 10, borderLeft: `3px solid ${sc}`, filter: "blur(4px)", userSelect: "none", pointerEvents: "none" }}>
                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#1e1e1e", color: "#555", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: "bold" }}>{i+FREE_LIMIT+1}</div>
                        <div style={{ flex: 2 }}><div style={{ fontWeight: "bold", color: "white" }}>{p.address}</div><div style={{ color: "#555", fontSize: 11 }}>ZIP {p.zip} · {p.beds}bd/{p.baths}ba</div></div>
                        {[["ASK",`$${(p.price/1000).toFixed(0)}K`],["PROFIT","???"],["ROI","???"]].map(([label,val]) => (
                          <div key={label} style={{ textAlign: "center", minWidth: 60 }}><div style={{ fontSize: 9, color: "#444", marginBottom: 3 }}>{label}</div><div style={{ color: "white", fontWeight: "bold" }}>{val}</div></div>
                        ))}
                        <ScoreRing score={p.score} size={68} />
                      </div>
                    );
                  })}
                  <LockOverlay onUpgrade={onUpgrade} />
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function DealAnalyzerPanel({ isMember, onUpgrade, freeAnalysisDone, onAnalysisDone }) {
  const [f, setF] = useState({ address: "", purchasePrice: 185000, arv: 295000, rehabCost: 45000, holdMonths: 6, financing: 0.08, taxRate: 1.2, insurance: 150, closingBuyPct: 2, agentFeePct: 6, strategy: "Fix & Flip" });
  const [res, setRes] = useState(null);
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  const analyze = () => {
    const { purchasePrice, arv, rehabCost, holdMonths, financing, taxRate, insurance, closingBuyPct, agentFeePct } = f;
    const finCost = purchasePrice*(financing/12)*holdMonths, taxCost = purchasePrice*(taxRate/100/12)*holdMonths, insCost = insurance*holdMonths;
    const closingBuy = purchasePrice*(closingBuyPct/100), closingSell = arv*(agentFeePct/100);
    const totalIn = purchasePrice+rehabCost+finCost+taxCost+insCost+closingBuy+closingSell;
    const profit = arv-totalIn, roi = ((profit/(purchasePrice+rehabCost))*100).toFixed(1);
    const mao = arv*0.7-rehabCost, recOffer = Math.min(purchasePrice, mao*1.05), margin = ((profit/arv)*100).toFixed(1);
    const score = Math.min(100,Math.max(0,(profit>0?35:0)+(roi>25?30:roi>15?20:roi>5?10:0)+(purchasePrice<=mao?25:purchasePrice<=mao*1.1?15:5)+(margin>15?10:margin>8?5:0)));
    setRes({ finCost, taxCost, insCost, closingBuy, closingSell, profit, roi, mao, recOffer, margin, score });
    if (!isMember) onAnalysisDone();
  };
  const canAnalyze = isMember || !freeAnalysisDone;
  return (
    <div>
      <p style={{ color: "#888", fontSize: 13, lineHeight: 1.7, marginBottom: 20 }}>Full deal breakdown in seconds — profit, ROI, MAO, holding costs, and a proprietary Deal Score.{!isMember && !freeAnalysisDone && <span style={{ color: O, fontWeight: "bold" }}> 1 free analysis included.</span>}</p>
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 280 }}>
          <div style={{ fontSize: 10, color: O, textTransform: "uppercase", letterSpacing: 2, marginBottom: 14 }}>Deal Inputs</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
            {[["Property Address","address","text",true],["Purchase Price ($)","purchasePrice","number",false],["After Repair Value ($)","arv","number",false],["Rehab Estimate ($)","rehabCost","number",false],["Hold Period (months)","holdMonths","number",false],["Financing Rate (%)","financing","number",false],["Property Tax Rate (%)","taxRate","number",false],["Monthly Insurance ($)","insurance","number",false],["Buying Closing Cost (%)","closingBuyPct","number",false],["Selling Agent Fee (%)","agentFeePct","number",false]].map(([label,key,type,full]) => (
              <div key={key} style={{ gridColumn: full?"1/-1":"auto" }}><label style={lbl2}>{label}</label><input type={type} value={f[key]} onChange={e=>set(key,type==="number"?+e.target.value:e.target.value)} style={inp2}/></div>
            ))}
            <div><label style={lbl2}>Strategy</label><select value={f.strategy} onChange={e=>set("strategy",e.target.value)} style={inp2}><option>Fix & Flip</option><option>Buy & Hold</option><option>BRRRR</option><option>Wholesale</option></select></div>
          </div>
          {canAnalyze ? (
            <button onClick={analyze} style={{ background: O, color: "#000", border: "none", borderRadius: 8, padding: "13px 0", width: "100%", fontWeight: "bold", cursor: "pointer", fontSize: 14, fontFamily: "inherit" }}>⚡ Generate Acquisition Intelligence</button>
          ) : (
            <div style={{ ...dCard2, textAlign: "center", padding: 24 }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>🔒</div>
              <div style={{ fontSize: 14, fontWeight: "bold", color: "white", marginBottom: 6 }}>Free Analysis Used</div>
              <div style={{ fontSize: 12, color: "#666", marginBottom: 16 }}>Join Investor Lab for unlimited analyses.</div>
              <button onClick={onUpgrade} style={{ background: O, color: "#000", border: "none", borderRadius: 8, padding: "11px 0", width: "100%", fontWeight: "bold", cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>Unlock Unlimited →</button>
            </div>
          )}
        </div>
        {res && (
          <div style={{ flex: 1, minWidth: 280 }}>
            <div style={{ fontSize: 10, color: O, textTransform: "uppercase", letterSpacing: 2, marginBottom: 14 }}>Acquisition Intelligence</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
              {[["Recommended Offer",`$${Math.round(res.recOffer).toLocaleString()}`,O],["Expected Profit",`$${Math.round(res.profit).toLocaleString()}`,res.profit>0?"#22c55e":"#ef4444"],["ROI",`${res.roi}%`,O],["Profit % of ARV",`${res.margin}%`,"#60a5fa"]].map(([label,val,color]) => (
                <div key={label} style={{ background: "#161616", border: "1px solid #2a2a2a", borderRadius: 8, padding: "12px 14px" }}>
                  <div style={{ fontSize: 10, color: "#555", marginBottom: 5, textTransform: "uppercase" }}>{label}</div>
                  <div style={{ fontSize: 20, fontWeight: "bold", color }}>{val}</div>
                </div>
              ))}
            </div>
            <div style={{ ...dCard2, marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: "#555", marginBottom: 10, textTransform: "uppercase" }}>Full Cost Breakdown</div>
              {[["Purchase Price",f.purchasePrice],["Rehab Estimate",f.rehabCost],["Financing Cost",Math.round(res.finCost)],["Taxes During Hold",Math.round(res.taxCost)],["Insurance",Math.round(res.insCost)],["Buying Closing Costs",Math.round(res.closingBuy)],["Selling/Agent Fees",Math.round(res.closingSell)]].map(([label,val]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #1c1c1c", fontSize: 13 }}>
                  <span style={{ color: "#777" }}>{label}</span><span style={{ color: "white" }}>${val.toLocaleString()}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0" }}>
                <span style={{ fontWeight: "bold", color: "white" }}>Net Profit</span>
                <span style={{ fontWeight: "bold", fontSize: 18, color: res.profit>0?"#22c55e":"#ef4444" }}>${Math.round(res.profit).toLocaleString()}</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
              <div style={{ flex: 1, ...dCard2 }}>
                <div style={{ fontSize: 10, color: "#555", marginBottom: 4, textTransform: "uppercase" }}>MAO (70% Rule)</div>
                <div style={{ color: O, fontWeight: "bold", fontSize: 18 }}>${Math.round(res.mao).toLocaleString()}</div>
                <div style={{ fontSize: 11, marginTop: 4, color: f.purchasePrice<=res.mao?"#22c55e":"#ef4444" }}>{f.purchasePrice<=res.mao?"✓ Within MAO":"⚠ Exceeds MAO"}</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 10, color: "#555", marginBottom: 6, textTransform: "uppercase" }}>Deal Score</div>
                <ScoreRing score={res.score} size={90} />
                <div style={{ fontSize: 12, fontWeight: "bold", marginTop: 4, color: res.score>=75?"#22c55e":res.score>=50?O:"#ef4444" }}>{res.score>=75?"Strong Deal ✓":res.score>=50?"Negotiate Harder":"Pass on This"}</div>
              </div>
            </div>
            {!isMember && <div style={{ ...dCard2, borderColor: O+"44", background: O+"08", textAlign: "center", padding: 18 }}><div style={{ fontSize: 13, color: "#ccc", marginBottom: 14 }}>Want to <strong style={{ color: O }}>save this</strong> and run unlimited analyses?</div><button onClick={onUpgrade} style={{ background: O, color: "#000", border: "none", borderRadius: 8, padding: "11px 0", width: "100%", fontWeight: "bold", cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>Join Investor Lab →</button></div>}
          </div>
        )}
      </div>
    </div>
  );
}

function OpportunityScorePanel() {
  const [scores, setScores] = useState({ profitMargin: 3, neighborhoodAppreciation: 3, rentalDemand: 3, daysOnMarket: 3, sellerMotivation: 3 });
  const setS = (k, v) => setScores(s => ({ ...s, [k]: v }));
  const factors = [
    { key: "profitMargin", icon: "💰", title: "Profit Margin", desc: "Spread between acquisition cost, rehab, and projected ARV.", tips: ["Thin margin — risky","Near breakeven — negotiate","Strong spread — high priority"] },
    { key: "neighborhoodAppreciation", icon: "📈", title: "Neighborhood Appreciation", desc: "Historical and projected appreciation data for the submarket.", tips: ["Declining — weak upside","Stable market — moderate","Strong trend — high upside"] },
    { key: "rentalDemand", icon: "🏘", title: "Rental Demand", desc: "Vacancy rates, average rents, and demand indicators.", tips: ["High vacancy — avoid B&H","Average demand — OK","Low vacancy — excellent hold"] },
    { key: "daysOnMarket", icon: "📅", title: "Days on Market", desc: "Properties sitting longer signal motivated sellers.", tips: ["Fresh listing — full price","Some time — slight leverage","60+ days — press hard"] },
    { key: "sellerMotivation", icon: "🎯", title: "Seller Motivation", desc: "AI-detected signals of seller urgency.", tips: ["No urgency — hold firm","Possible motivation — test","Highly motivated — best terms"] },
  ];
  const composite = Math.round(Object.values(scores).reduce((a,b)=>a+b,0)/5*20);
  return (
    <div>
      <p style={{ color: "#888", fontSize: 13, lineHeight: 1.7, marginBottom: 20 }}>Proprietary <strong style={{ color: O }}>Opportunity Score</strong> — a composite 0–100 rating telling you at a glance whether a deal is worth pursuing. <span style={{ color: "#22c55e", fontWeight: "bold" }}>✓ Unlimited — free forever.</span></p>
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        <div style={{ flex: 2, minWidth: 300 }}>
          {factors.map(fac => (
            <div key={fac.key} style={{ ...dCard2, marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: "bold", color: "white", marginBottom: 2 }}>{fac.icon} {fac.title}</div><div style={{ fontSize: 12, color: "#555" }}>{fac.desc}</div></div>
                <div style={{ fontSize: 20, fontWeight: "bold", color: O, marginLeft: 16 }}>{scores[fac.key]}/5</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {[1,2,3,4,5].map(n => <button key={n} onClick={()=>setS(fac.key,n)} style={{ flex: 1, padding: "8px 0", borderRadius: 6, border: "none", cursor: "pointer", background: scores[fac.key]>=n?O:"#2a2a2a", color: scores[fac.key]>=n?"#000":"#555", fontWeight: "bold", fontSize: 13 }}>{n}</button>)}
              </div>
              <div style={{ fontSize: 11, color: "#444", marginTop: 6 }}>{fac.tips[scores[fac.key]<=2?0:scores[fac.key]===3?1:2]}</div>
            </div>
          ))}
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ textAlign: "center", position: "sticky", top: 20 }}>
            <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Composite Score</div>
            <ScoreRing score={composite} size={170} />
            <div style={{ marginTop: 12, fontSize: 16, fontWeight: "bold", color: composite>=75?"#22c55e":composite>=50?O:"#ef4444" }}>{composite>=75?"🟢 HIGH PRIORITY":composite>=50?"🟡 WORTH ANALYZING":"🔴 PASS ON THIS"}</div>
            <div style={{ marginTop: 20, ...dCard2 }}>
              <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Score Guide</div>
              {[["80–100","Chase it hard","#22c55e"],["60–79","Negotiate harder",O],["40–59","Needs more data","#f59e0b"],["0–39","Move on","#ef4444"]].map(([range,label,color]) => (
                <div key={range} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #1c1c1c", fontSize: 13 }}><span style={{ color, fontWeight: "bold" }}>{range}</span><span style={{ color: "#666" }}>{label}</span></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SellerOutreachPanel({ isMember, onUpgrade }) {
  const [tab, setTab] = useState("sms");
  const [form, setForm] = useState({ sellerName: "John", address: "123 Main St", offer: "165,000" });
  const setFld = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const [copied, setCopied] = useState(false);
  const tabs = [{ key: "sms", label: "📱 Cold SMS", free: true },{ key: "call", label: "📞 Cold Call", free: false },{ key: "mail", label: "✉️ Direct Mail", free: false },{ key: "followup", label: "🔁 Follow-Up", free: false },{ key: "offer", label: "📄 Offer Letter", free: false },{ key: "objections", label: "🛡 Objections", free: false },{ key: "strategy", label: "🎯 Acquisition Strategy", free: false }];
  const scripts = {
    sms: `Hi ${form.sellerName}, my name is Kris and I'm a local real estate investor. I noticed your property at ${form.address} and wanted to reach out — I buy homes as-is, all cash, fast close. Would you be open to a quick conversation? No pressure at all.`,
    call: `Hi, may I speak with ${form.sellerName}? ... Hi ${form.sellerName}, I'm Kris, a local investor. I'm not an agent — I buy properties directly. I noticed ${form.address} and wanted to see if you'd consider a cash offer. Do you have 2 minutes?`,
    mail: `Dear ${form.sellerName},\n\nI'm a local real estate investor who buys homes directly — no agents, no commissions, no repairs needed. I'm interested in ${form.address} and would love to make you a fair cash offer.\n\nCall or text: [YOUR NUMBER]\n\nNo obligation, no pressure.\n\nKris Alfaro\nThe AI Deal Engine`,
    followup: `Hi ${form.sellerName}, following up on my message about ${form.address}. Still very interested. I can close in as little as 7 days, all cash, as-is. Happy to answer any questions — no pressure.`,
    offer: `Dear ${form.sellerName},\n\nThank you for speaking with me. I'm pleased to present the following offer for ${form.address}:\n\nCASH OFFER: $${form.offer}\nClose Date: [DATE]\nCondition: As-Is\nContingencies: None\n\nOffer valid for 72 hours.\n\nSincerely, Kris Alfaro`,
    objections: `"Your price is too low" → The offer reflects repair costs and risk as a cash buyer. The tradeoff is certainty vs. a higher price on the open market.\n\n"I need to think about it" → Absolutely. Offer is valid 72 hours. Anything I can clarify?\n\n"I have an agent" → No problem. I can work with your agent, or selling directly saves you the commission.`,
    strategy: `SUBJECT-TO: Take over mortgage payments. Seller deeds property. Great for motivated sellers with equity.\n\nSELLER FINANCING: Seller acts as bank. Pay them monthly. Ideal when bank financing is tight.\n\nWHOLESALE: Contract → assign to end buyer for fee. No money, no rehab.\n\nCASH: Clean, fast, certain. Best for distressed sellers needing speed.`,
  };
  const currentTab = tabs.find(t => t.key === tab);
  const isLocked = !isMember && !currentTab.free;
  const copy = () => { navigator.clipboard.writeText(scripts[tab]); setCopied(true); setTimeout(()=>setCopied(false),2000); };

  return (
    <div>
      <p style={{ color: "#888", fontSize: 13, lineHeight: 1.7, marginBottom: 20 }}>AI-generated outreach scripts, negotiation frameworks, and acquisition strategies.{!isMember && <span style={{ color: O, fontWeight: "bold" }}> Cold SMS is free. Unlock all 7 with Investor Lab.</span>}</p>
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 220 }}>
          <div style={{ fontSize: 10, color: O, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>Personalize</div>
          {[["Seller Name","sellerName"],["Property Address","address"],["Your Offer ($)","offer"]].map(([label,key]) => (
            <div key={key} style={{ marginBottom: 10 }}><label style={lbl2}>{label}</label><input value={form[key]} onChange={e=>setFld(key,e.target.value)} style={inp2}/></div>
          ))}
          <div style={{ marginTop: 18 }}>
            <div style={{ fontSize: 10, color: O, textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>Script Type</div>
            {tabs.map(t => (
              <button key={t.key} onClick={()=>setTab(t.key)} style={{ display: "block", width: "100%", textAlign: "left", padding: "9px 14px", marginBottom: 6, borderRadius: 8, border: "none", cursor: "pointer", background: tab===t.key?O:"#1a1a1a", color: tab===t.key?"#000":(!isMember&&!t.free?"#444":"#888"), fontWeight: tab===t.key?"bold":"normal", fontSize: 13, fontFamily: "inherit" }}>
                {t.label}{!isMember&&!t.free&&" 🔒"}
              </button>
            ))}
          </div>
        </div>
        <div style={{ flex: 2, minWidth: 280 }}>
          <div style={{ fontSize: 10, color: O, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>
            {currentTab.label}
            {!isMember&&currentTab.free&&<span style={{ marginLeft: 8, color: "#22c55e", fontSize: 10 }}>✓ FREE</span>}
          </div>
          {isLocked ? (
            <div style={{ position: "relative" }}>
              <div style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: 10, padding: 20, color: "#1a1a1a", lineHeight: 1.9, fontSize: 14, minHeight: 200, filter: "blur(3px)", userSelect: "none" }}>This script is for members only. Join to unlock.</div>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
                <div style={{ fontSize: 28 }}>🔒</div>
                <div style={{ fontSize: 14, fontWeight: "bold", color: "white" }}>Members Only Script</div>
                <button onClick={onUpgrade} style={{ background: O, color: "#000", border: "none", borderRadius: 8, padding: "10px 22px", fontWeight: "bold", cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>Unlock All Scripts →</button>
              </div>
            </div>
          ) : (
            <>
              <div style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: 10, padding: 20, fontFamily: "Georgia", color: "#ccc", lineHeight: 1.9, fontSize: 14, whiteSpace: "pre-wrap", minHeight: 160, maxHeight: 420, overflowY: "auto" }}>{scripts[tab]}</div>
              <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
                <button onClick={copy} style={{ background: O, color: "#000", border: "none", borderRadius: 8, padding: "10px 22px", fontWeight: "bold", cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>{copied?"✓ Copied!":"📋 Copy Script"}</button>
                {!isMember&&<button onClick={onUpgrade} style={{ background: "none", border: `1px solid ${O}44`, color: O, borderRadius: 8, padding: "10px 18px", cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>Unlock All 7 Scripts →</button>}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function DealRoomPanel({ isMember, onUpgrade }) {
  const [view, setView] = useState("browse");
  const deals = [
    { investor: "Marcus T.", initials: "MT", city: "Atlanta, GA", type: "Fix & Flip", ask: 245000, arv: 385000, rehab: 52000, score: 88, status: "Seeking Co-Investor", split: "50/50 equity", tags: ["Absentee Owner"] },
    { investor: "Sarah K.", initials: "SK", city: "Tampa, FL", type: "BRRRR", ask: 162000, arv: 290000, rehab: 41000, score: 82, status: "Seeking Capital", split: "Pref 8%", tags: ["Distressed"] },
    { investor: "James R.", initials: "JR", city: "Dallas, TX", type: "Wholesale", ask: 195000, arv: 330000, rehab: 0, score: 75, status: "Assigning Contract", split: "$18K Fee", tags: ["Absentee"] },
    { investor: "Priya M.", initials: "PM", city: "Phoenix, AZ", type: "Buy & Hold", ask: 310000, arv: 430000, rehab: 35000, score: 79, status: "JV Opportunity", split: "60/40", tags: ["Appreciation"] },
    { investor: "Derek W.", initials: "DW", city: "Charlotte, NC", type: "Fix & Flip", ask: 178000, arv: 295000, rehab: 48000, score: 85, status: "Seeking Hard Money", split: "Equity Kicker", tags: ["Distressed"] },
  ];
  return (
    <div>
      <p style={{ color: "#888", fontSize: 13, lineHeight: 1.7, marginBottom: 20 }}>Where AI-powered deal discovery meets investor collaboration. Post deals, find co-investors, secure capital, and close together.{!isMember&&<span style={{ color: O, fontWeight: "bold" }}> Members only.</span>}</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10, marginBottom: 22 }}>
        {[["🎯","Pitch Deals","Bring your best opportunities to active investors ready to co-invest."],["🤝","Find Partners","Connect with investors and deal-finders who complement your skills."],["💰","Secure Funding","Access private lenders and equity partners deploying capital now."],["🌐","Collaborate","Better deals attract better partners — which enables more deals."]].map(([icon,title,desc]) => (
          <div key={title} style={oCard}><div style={{ fontSize: 22, marginBottom: 8 }}>{icon}</div><div style={{ fontWeight: "bold", color: "white", marginBottom: 6 }}>{title}</div><div style={{ fontSize: 12, color: "#888", lineHeight: 1.6 }}>{desc}</div></div>
        ))}
      </div>
      {!isMember ? (
        <div style={{ position: "relative", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ filter: "blur(5px)", pointerEvents: "none", userSelect: "none" }}>
            <div style={{ color: "#555", fontSize: 13, marginBottom: 12 }}><span style={{ color: O, fontWeight: "bold" }}>{deals.length} live deals</span> active in the community</div>
            {deals.slice(0,3).map((d,i) => (
              <div key={i} style={{ ...dCard2, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", marginBottom: 10 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: O, color: "#000", fontWeight: "bold", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>{d.initials}</div>
                <div style={{ flex: 2 }}><div style={{ fontWeight: "bold", color: "white" }}>{d.investor}</div><div style={{ color: "#555", fontSize: 12 }}>{d.city} · {d.type}</div></div>
                <div style={{ textAlign: "center" }}><div style={{ fontSize: 9, color: "#444", marginBottom: 3 }}>PROFIT EST.</div><div style={{ color: "#22c55e", fontWeight: "bold" }}>${(d.arv-d.ask-d.rehab).toLocaleString()}</div></div>
                <ScoreRing score={d.score} size={68} />
              </div>
            ))}
          </div>
          <LockOverlay onUpgrade={onUpgrade} />
        </div>
      ) : (
        <>
          <div style={{ display: "flex", gap: 8, marginBottom: 14, background: "#161616", borderRadius: 8, padding: 4 }}>
            {[["browse","📋 Browse Deals"],["post","➕ Post a Deal"]].map(([k,l]) => (
              <button key={k} onClick={()=>setView(k)} style={{ padding: "8px 20px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 13, background: view===k?O:"transparent", color: view===k?"#000":"#555", fontWeight: "bold" }}>{l}</button>
            ))}
          </div>
          {view === "browse" && deals.map((d,i) => (
            <div key={i} style={{ ...dCard2, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", marginBottom: 10 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: O, color: "#000", fontWeight: "bold", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{d.initials}</div>
              <div style={{ flex: 2 }}><div style={{ fontWeight: "bold", color: "white" }}>{d.investor}</div><div style={{ color: "#555", fontSize: 12, marginBottom: 6 }}>{d.city} · {d.type}</div><div>{d.tags.map(t=><Tag key={t} text={t} color="#60a5fa"/>)}<Tag text={d.status} color={O}/></div></div>
              {[["ASK/ARV",`$${(d.ask/1000).toFixed(0)}K/$${(d.arv/1000).toFixed(0)}K`,"#aaa"],["PROFIT",`$${(d.arv-d.ask-d.rehab).toLocaleString()}`,"#22c55e"],["SPLIT",d.split,O]].map(([label,val,color]) => (
                <div key={label} style={{ textAlign: "center", minWidth: 80 }}><div style={{ fontSize: 9, color: "#444", marginBottom: 3 }}>{label}</div><div style={{ color, fontWeight: "bold", fontSize: 13 }}>{val}</div></div>
              ))}
              <ScoreRing score={d.score} size={68}/>
              <button style={{ background: O, color: "#000", border: "none", borderRadius: 8, padding: "10px 18px", fontWeight: "bold", cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>Connect</button>
            </div>
          ))}
          {view === "post" && (
            <div style={dCard2}>
              <div style={{ fontSize: 13, fontWeight: "bold", color: O, marginBottom: 16 }}>Post a Deal to the Community</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[["Property Address","text"],["Market / City","text"],["Purchase Price ($)","number"],["ARV ($)","number"],["Rehab Cost ($)","number"],["Opportunity Score","number"]].map(([label,type]) => (
                  <div key={label}><label style={lbl2}>{label}</label><input type={type} style={inp2}/></div>
                ))}
                <div><label style={lbl2}>Investment Type</label><select style={inp2}><option>Fix & Flip</option><option>BRRRR</option><option>Wholesale</option><option>Buy & Hold</option></select></div>
                <div><label style={lbl2}>What You're Seeking</label><select style={inp2}><option>Co-Investor (50/50)</option><option>Capital / Hard Money</option><option>JV Partner</option><option>Assigning Contract</option></select></div>
                <div style={{ gridColumn: "1/-1" }}><label style={lbl2}>Deal Summary</label><textarea style={{ ...inp2, minHeight: 80, resize: "vertical" }} placeholder="Describe the deal and why it's a strong opportunity..."/></div>
              </div>
              <button style={{ background: O, color: "#000", border: "none", borderRadius: 8, padding: "13px 0", width: "100%", fontWeight: "bold", cursor: "pointer", fontSize: 14, fontFamily: "inherit", marginTop: 14 }}>🚀 Post to Deal Room</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   ROOT ROUTER
───────────────────────────────────────────── */
export default function App() {
  const [page, setPage] = useState("landing"); // landing | register | login | dashboard
  const [user, setUser] = useState(null);

  // Restore session on load
  useEffect(() => {
    try {
      const saved = localStorage.getItem("aide_user");
      if (saved) { const u = JSON.parse(saved); setUser(u); setPage("dashboard"); }
    } catch(e) {}
  }, []);

  const handleAuthSuccess = (u) => { setUser(u); setPage("dashboard"); };
  const handleLogout = () => {
    try { localStorage.removeItem("aide_user"); } catch(e) {}
    setUser(null); setPage("landing");
  };

  if (page === "landing") return <LandingPage onRegister={() => setPage("register")} onLogin={() => setPage("login")} />;
  if (page === "register") return <AuthPage mode="register" onSuccess={handleAuthSuccess} onSwitch={() => setPage("login")} onBack={() => setPage("landing")} />;
  if (page === "login") return <AuthPage mode="login" onSuccess={handleAuthSuccess} onSwitch={() => setPage("register")} onBack={() => setPage("landing")} />;
  if (page === "dashboard") return <DealEngineDashboard user={user} onLogout={handleLogout} onUpgrade={() => {}} />;
  return null;
}
