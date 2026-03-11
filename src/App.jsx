import { useState } from "react";

const O = "#F5A623";
const DARK = "#111111";
const CARD = "#1c1c1c";
const CARD2 = "#222222";
const BORDER = "#2e2e2e";
const GOLD = "#b8862a";

const inp = {
  background: "#161616", border: "1px solid #3a3a3a", borderRadius: 7,
  color: "white", padding: "9px 12px", fontSize: 14, width: "100%",
  outline: "none", boxSizing: "border-box", fontFamily: "inherit"
};
const lbl = {
  fontSize: 10, color: "#777", marginBottom: 5, display: "block",
  textTransform: "uppercase", letterSpacing: 1
};
const oCard = {
  background: GOLD + "22", border: `1px solid ${GOLD}55`, borderRadius: 10, padding: "18px 20px"
};
const dCard = {
  background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "18px 20px"
};

function btnStyle(full) {
  return {
    background: O, color: "#000", border: "none", borderRadius: 8,
    padding: full ? "13px 0" : "10px 22px",
    width: full ? "100%" : "auto",
    fontWeight: "bold", cursor: "pointer", fontSize: 14, fontFamily: "inherit"
  };
}

function ScoreRing({ score, size = 120 }) {
  const r = 44, circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 75 ? "#22c55e" : score >= 50 ? O : "#ef4444";
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={r} fill="none" stroke="#2a2a2a" strokeWidth="8"/>
      <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="8"
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        transform="rotate(-90 50 50)" style={{ transition: "stroke-dashoffset 1s ease" }}/>
      <text x="50" y="46" textAnchor="middle" fill="white" fontSize="19" fontWeight="bold">{score}</text>
      <text x="50" y="60" textAnchor="middle" fill="#666" fontSize="9">/100</text>
    </svg>
  );
}

function Tag({ text, color = O }) {
  return (
    <span style={{
      display: "inline-block", padding: "2px 10px", borderRadius: 20,
      background: color + "22", border: `1px solid ${color}55`,
      color, fontSize: 11, fontWeight: "bold", marginRight: 4, marginBottom: 2
    }}>{text}</span>
  );
}

/* PILLAR 1 */
function DealFinderPanel() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [signal, setSignal] = useState("all");
  const [f, setF] = useState({
    city: "Phoenix, AZ", zip: "",
    minPrice: 0, maxPrice: 500000,
    minBeds: 0, maxBeds: 10,
    minBaths: 0, maxBaths: 10,
    minSqft: 0, maxSqft: 10000,
    propType: "all", condition: "all",
  });
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
  const signals = [
    { key: "all", label: "All Signals" },
    { key: "absentee", label: "👤 Absentee" },
    { key: "distressed", label: "🏚 Distressed" },
    { key: "foreclosure", label: "⚠️ Foreclosure" },
    { key: "appreciation", label: "📈 Appreciation" },
  ];
  const propTypes = [
    { key: "all", label: "All Types" },
    { key: "sfr", label: "🏠 SFR" },
    { key: "multi", label: "🏢 Multi-Family" },
    { key: "condo", label: "🏙 Condo" },
    { key: "townhouse", label: "🏘 Townhouse" },
  ];
  const conditions = [
    { key: "all", label: "Any Condition" },
    { key: "good", label: "✅ Good" },
    { key: "fair", label: "🟡 Fair" },
    { key: "poor", label: "🔴 Poor" },
  ];
  const conditionColors = { good: "#22c55e", fair: "#f59e0b", poor: "#ef4444" };

  const scan = () => {
    setLoading(true);
    setTimeout(() => {
      let filtered = allProps.filter(p =>
        (signal === "all" || p.signal === signal) &&
        (f.zip === "" || p.zip.includes(f.zip)) &&
        p.price >= f.minPrice && p.price <= f.maxPrice &&
        p.beds >= f.minBeds && p.beds <= f.maxBeds &&
        p.baths >= f.minBaths && p.baths <= f.maxBaths &&
        p.sqft >= f.minSqft && p.sqft <= f.maxSqft &&
        (f.propType === "all" || p.propType === f.propType) &&
        (f.condition === "all" || p.condition === f.condition)
      );
      filtered = filtered.sort((a, b) => b.score - a.score);
      setResults(filtered);
      setLoading(false);
    }, 1600);
  };

  const resetFilters = () => {
    setF({ city: "Phoenix, AZ", zip: "", minPrice: 0, maxPrice: 500000, minBeds: 0, maxBeds: 10, minBaths: 0, maxBaths: 10, minSqft: 0, maxSqft: 10000, propType: "all", condition: "all" });
    setSignal("all");
    setResults(null);
  };

  return (
    <div>
      <p style={{ color: "#888", fontSize: 13, lineHeight: 1.7, marginBottom: 20 }}>
        Our AI-powered deal discovery engine scans <strong style={{ color: O }}>millions of properties</strong> and market data points to identify the most promising real estate investment opportunities. Using advanced algorithms that detect profitability signals, market inefficiencies, and value gaps, it performs in seconds what would normally take a team of analysts weeks to uncover — saving you time, eliminating guesswork, and helping you focus only on deals with real potential.
      </p>

      {/* Signal Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 10, marginBottom: 22 }}>
        {[
          { icon: "👤", title: "Absentee Owners", desc: "Properties where owners are not occupying the home — a strong signal of seller motivation.", color: "#60a5fa" },
          { icon: "🏚", title: "Distressed Properties", desc: "Flags deferred maintenance, financial difficulty — prime acquisition targets.", color: "#f87171" },
          { icon: "⚠️", title: "Foreclosure Signals", desc: "Detects early-stage foreclosure activity before properties hit the open market.", color: "#fb923c" },
          { icon: "📈", title: "Market Appreciation", desc: "Analyzes neighborhood appreciation trends to identify high-upside opportunities.", color: "#34d399" },
        ].map(s => (
          <div key={s.title} style={{ ...dCard, borderLeft: `3px solid ${s.color}` }}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 12, fontWeight: "bold", color: s.color, marginBottom: 4 }}>{s.title}</div>
            <div style={{ fontSize: 12, color: "#666", lineHeight: 1.6 }}>{s.desc}</div>
          </div>
        ))}
      </div>

      {/* Main Search Bar */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 14 }}>
        <div style={{ flex: 3, minWidth: 180 }}>
          <label style={lbl}>Target Market / City</label>
          <input value={f.city} onChange={e => sf("city", e.target.value)} style={inp} placeholder="Phoenix, AZ" />
        </div>
        <div style={{ flex: 1, minWidth: 120 }}>
          <label style={lbl}>Zip Code</label>
          <input value={f.zip} onChange={e => sf("zip", e.target.value)} style={inp} placeholder="e.g. 85035" />
        </div>
      </div>

      {/* Signal Filter Pills */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
        {signals.map(s => (
          <button key={s.key} onClick={() => setSignal(s.key)} style={{
            padding: "7px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 12,
            background: signal === s.key ? O : "#2a2a2a", color: signal === s.key ? "#000" : "#888", fontWeight: "bold"
          }}>{s.label}</button>
        ))}
      </div>

      {/* Filters - Always Visible */}
      <div style={{ ...dCard, marginBottom: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14 }}>
          <div>
            <label style={lbl}>Min Price ($)</label>
            <input type="number" value={f.minPrice} onChange={e => sf("minPrice", +e.target.value)} style={inp} />
          </div>
          <div>
            <label style={lbl}>Max Price ($)</label>
            <input type="number" value={f.maxPrice} onChange={e => sf("maxPrice", +e.target.value)} style={inp} />
          </div>
          <div>
            <label style={lbl}>Min Beds</label>
            <select value={f.minBeds} onChange={e => sf("minBeds", +e.target.value)} style={inp}>
              {[0,1,2,3,4,5].map(n => <option key={n} value={n}>{n === 0 ? "Any" : `${n}+`}</option>)}
            </select>
          </div>
          <div>
            <label style={lbl}>Max Beds</label>
            <select value={f.maxBeds} onChange={e => sf("maxBeds", +e.target.value)} style={inp}>
              {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n === 10 ? "Any" : n}</option>)}
            </select>
          </div>
          <div>
            <label style={lbl}>Min Baths</label>
            <select value={f.minBaths} onChange={e => sf("minBaths", +e.target.value)} style={inp}>
              {[0,1,2,3,4].map(n => <option key={n} value={n}>{n === 0 ? "Any" : `${n}+`}</option>)}
            </select>
          </div>
          <div>
            <label style={lbl}>Max Baths</label>
            <select value={f.maxBaths} onChange={e => sf("maxBaths", +e.target.value)} style={inp}>
              {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n === 10 ? "Any" : n}</option>)}
            </select>
          </div>
          <div>
            <label style={lbl}>Min Sq Ft</label>
            <input type="number" value={f.minSqft} onChange={e => sf("minSqft", +e.target.value)} style={inp} placeholder="0" />
          </div>
          <div>
            <label style={lbl}>Max Sq Ft</label>
            <input type="number" value={f.maxSqft} onChange={e => sf("maxSqft", +e.target.value)} style={inp} placeholder="10000" />
          </div>
          <div>
            <label style={lbl}>Property Type</label>
            <select value={f.propType} onChange={e => sf("propType", e.target.value)} style={inp}>
              {propTypes.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label style={lbl}>Condition</label>
            <select value={f.condition} onChange={e => sf("condition", e.target.value)} style={inp}>
              {conditions.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
            </select>
          </div>
        </div>
        <button onClick={resetFilters} style={{
          marginTop: 14, background: "none", border: "1px solid #333",
          color: "#666", borderRadius: 8, padding: "7px 16px",
          cursor: "pointer", fontSize: 12, fontFamily: "inherit"
        }}>↺ Reset All Filters</button>
      </div>

      <button onClick={scan} style={btnStyle(true)}>
        {loading ? "⚙️ Scanning millions of properties..." : "🔍 Scan Market"}
      </button>

      {results && !loading && (
        <div style={{ marginTop: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
            <div style={{ color: "#777", fontSize: 13 }}>
              Found <span style={{ color: O, fontWeight: "bold" }}>{results.length} opportunities</span> in {f.city}
              {f.zip && <span style={{ color: "#555" }}> · ZIP {f.zip}</span>}
              <span style={{ color: "#555", fontSize: 11, marginLeft: 8 }}>Sorted by: Highest Opportunity Score</span>
            </div>
            {results.length > 0 && (
              <div style={{ fontSize: 11, color: "#555" }}>
                Avg Score: <span style={{ color: O, fontWeight: "bold" }}>
                  {Math.round(results.reduce((a, p) => a + p.score, 0) / results.length)}
                </span>
              </div>
            )}
          </div>

          {results.length === 0 ? (
            <div style={{ ...dCard, textAlign: "center", padding: 40 }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
              <div style={{ color: "#666", fontSize: 14 }}>No properties match your filters.</div>
              <button onClick={resetFilters} style={{ ...btnStyle(false), marginTop: 14, fontSize: 13 }}>Reset Filters</button>
            </div>
          ) : (
            results.map((p, i) => {
              const profit = p.arv - p.price - p.rehab;
              const roi = Math.round((profit / (p.price + p.rehab)) * 100);
              const sc = signalColors[p.signal];
              const cc = conditionColors[p.condition];
              return (
                <div key={i} style={{ ...dCard, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", marginBottom: 10, borderLeft: `3px solid ${sc}` }}>
                  {/* Rank */}
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: i === 0 ? O : "#1e1e1e", color: i === 0 ? "#000" : "#555", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: "bold", flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 2, minWidth: 200 }}>
                    <div style={{ fontWeight: "bold", color: "white", marginBottom: 3 }}>{p.address}</div>
                    <div style={{ color: "#555", fontSize: 11, marginBottom: 5 }}>
                      ZIP {p.zip} · {p.beds}bd/{p.baths}ba · {p.sqft.toLocaleString()} sqft · {p.dom} DOM
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      <Tag text={p.signalLabel} color={sc} />
                      <Tag text={propTypes.find(t => t.key === p.propType)?.label.replace(/^[^\s]+\s/, "")} color="#a78bfa" />
                      <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 20, background: cc + "22", border: `1px solid ${cc}55`, color: cc, fontSize: 11, fontWeight: "bold" }}>
                        {p.condition.charAt(0).toUpperCase() + p.condition.slice(1)} Condition
                      </span>
                    </div>
                  </div>
                  {[
                    ["ASK", `$${(p.price/1000).toFixed(0)}K`, "white"],
                    ["ARV", `$${(p.arv/1000).toFixed(0)}K`, "#aaa"],
                    ["PROFIT", `$${profit.toLocaleString()}`, "#22c55e"],
                    ["ROI", `${roi}%`, O]
                  ].map(([label, val, color]) => (
                    <div key={label} style={{ textAlign: "center", minWidth: 65 }}>
                      <div style={{ fontSize: 9, color: "#444", marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.8 }}>{label}</div>
                      <div style={{ color, fontWeight: "bold", fontSize: 14 }}>{val}</div>
                    </div>
                  ))}
                  <ScoreRing score={p.score} size={68} />
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

/* PILLAR 2 */
function DealAnalyzerPanel() {
  const [f, setF] = useState({
    address: "", purchasePrice: 185000, arv: 295000,
    rehabCost: 45000, holdMonths: 6, financing: 0.08,
    taxRate: 1.2, insurance: 150, closingBuyPct: 2, agentFeePct: 6, strategy: "Fix & Flip"
  });
  const [res, setRes] = useState(null);
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));

  const analyze = () => {
    const { purchasePrice, arv, rehabCost, holdMonths, financing, taxRate, insurance, closingBuyPct, agentFeePct } = f;
    const finCost = purchasePrice * (financing / 12) * holdMonths;
    const taxCost = purchasePrice * (taxRate / 100 / 12) * holdMonths;
    const insCost = insurance * holdMonths;
    const holdTotal = finCost + taxCost + insCost;
    const closingBuy = purchasePrice * (closingBuyPct / 100);
    const closingSell = arv * (agentFeePct / 100);
    const totalIn = purchasePrice + rehabCost + holdTotal + closingBuy + closingSell;
    const profit = arv - totalIn;
    const roi = ((profit / (purchasePrice + rehabCost)) * 100).toFixed(1);
    const mao = arv * 0.7 - rehabCost;
    const recOffer = Math.min(purchasePrice, mao * 1.05);
    const margin = ((profit / arv) * 100).toFixed(1);
    const score = Math.min(100, Math.max(0,
      (profit > 0 ? 35 : 0) + (roi > 25 ? 30 : roi > 15 ? 20 : roi > 5 ? 10 : 0) +
      (purchasePrice <= mao ? 25 : purchasePrice <= mao * 1.1 ? 15 : 5) + (margin > 15 ? 10 : margin > 8 ? 5 : 0)
    ));
    setRes({ finCost, taxCost, insCost, holdTotal, closingBuy, closingSell, totalIn, profit, roi, mao, recOffer, margin, score });
  };

  return (
    <div>
      <p style={{ color: "#888", fontSize: 13, lineHeight: 1.7, marginBottom: 20 }}>
        Once a property is identified, the system instantly produces a <strong style={{ color: O }}>full deal breakdown</strong> — replacing hours of manual spreadsheet work with instant, accurate acquisition intelligence.
      </p>
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 280 }}>
          <div style={{ fontSize: 10, color: O, textTransform: "uppercase", letterSpacing: 2, marginBottom: 14 }}>What the AI Calculates</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
            {[
              ["Property Address", "address", "text", true],
              ["Purchase Price ($)", "purchasePrice", "number", false],
              ["After Repair Value — ARV ($)", "arv", "number", false],
              ["Rehab Estimate ($)", "rehabCost", "number", false],
              ["Hold Period (months)", "holdMonths", "number", false],
              ["Financing Rate (annual %)", "financing", "number", false],
              ["Property Tax Rate (%)", "taxRate", "number", false],
              ["Monthly Insurance ($)", "insurance", "number", false],
              ["Buying Closing Cost (%)", "closingBuyPct", "number", false],
              ["Selling Agent Fee (%)", "agentFeePct", "number", false],
            ].map(([label, key, type, full]) => (
              <div key={key} style={{ gridColumn: full ? "1 / -1" : "auto" }}>
                <label style={lbl}>{label}</label>
                <input type={type} value={f[key]} onChange={e => set(key, type === "number" ? +e.target.value : e.target.value)} style={inp} />
              </div>
            ))}
            <div>
              <label style={lbl}>Strategy</label>
              <select value={f.strategy} onChange={e => set("strategy", e.target.value)} style={inp}>
                <option>Fix & Flip</option><option>Buy & Hold</option><option>BRRRR</option><option>Wholesale</option>
              </select>
            </div>
          </div>
          <button onClick={analyze} style={btnStyle(true)}>⚡ Generate Acquisition Intelligence</button>
        </div>

        {res && (
          <div style={{ flex: 1, minWidth: 280 }}>
            <div style={{ fontSize: 10, color: O, textTransform: "uppercase", letterSpacing: 2, marginBottom: 14 }}>The Output Investors Receive</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
              {[
                ["Recommended Offer Price", `$${Math.round(res.recOffer).toLocaleString()}`, O],
                ["Expected Profit Margin", `$${Math.round(res.profit).toLocaleString()}`, res.profit > 0 ? "#22c55e" : "#ef4444"],
                ["Return on Investment", `${res.roi}%`, O],
                ["Profit as % of ARV", `${res.margin}%`, "#60a5fa"],
              ].map(([label, val, color]) => (
                <div key={label} style={{ background: "#161616", border: "1px solid #2a2a2a", borderRadius: 8, padding: "12px 14px" }}>
                  <div style={{ fontSize: 10, color: "#555", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.8 }}>{label}</div>
                  <div style={{ fontSize: 20, fontWeight: "bold", color }}>{val}</div>
                </div>
              ))}
            </div>
            <div style={{ ...dCard, marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: "#555", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>Full Cost Breakdown</div>
              {[
                ["Purchase Price", f.purchasePrice],
                ["Rehab Estimate", f.rehabCost],
                ["Financing Cost", Math.round(res.finCost)],
                ["Taxes During Hold", Math.round(res.taxCost)],
                ["Insurance During Hold", Math.round(res.insCost)],
                ["Buying Closing Costs", Math.round(res.closingBuy)],
                ["Selling / Agent Fees", Math.round(res.closingSell)],
              ].map(([label, val]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #1c1c1c", fontSize: 13 }}>
                  <span style={{ color: "#777" }}>{label}</span>
                  <span style={{ color: "white" }}>${val.toLocaleString()}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", fontSize: 15 }}>
                <span style={{ fontWeight: "bold", color: "white" }}>Net Profit</span>
                <span style={{ fontWeight: "bold", fontSize: 18, color: res.profit > 0 ? "#22c55e" : "#ef4444" }}>${Math.round(res.profit).toLocaleString()}</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
              <div style={{ flex: 1, ...dCard }}>
                <div style={{ fontSize: 10, color: "#555", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.8 }}>Max Allowable Offer (70% Rule)</div>
                <div style={{ color: O, fontWeight: "bold", fontSize: 18 }}>${Math.round(res.mao).toLocaleString()}</div>
                <div style={{ fontSize: 11, marginTop: 4, color: f.purchasePrice <= res.mao ? "#22c55e" : "#ef4444" }}>
                  {f.purchasePrice <= res.mao ? "✓ Within MAO — strong position" : "⚠ Purchase price exceeds MAO"}
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 10, color: "#555", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.8 }}>Deal Score</div>
                <ScoreRing score={res.score} size={90} />
                <div style={{ fontSize: 12, fontWeight: "bold", marginTop: 4, color: res.score >= 75 ? "#22c55e" : res.score >= 50 ? O : "#ef4444" }}>
                  {res.score >= 75 ? "Strong Deal ✓" : res.score >= 50 ? "Negotiate Harder" : "Pass on This"}
                </div>
              </div>
            </div>
            <div style={oCard}>
              <div style={{ fontSize: 13, color: "#ddd", lineHeight: 1.7 }}>
                Instead of spreadsheets, investors receive <strong style={{ color: O }}>instant acquisition intelligence</strong> — the difference between moving in hours versus days.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* PILLAR 3 */
function OpportunityScorePanel() {
  const [scores, setScores] = useState({ profitMargin: 3, neighborhoodAppreciation: 3, rentalDemand: 3, daysOnMarket: 3, sellerMotivation: 3 });
  const setS = (k, v) => setScores(s => ({ ...s, [k]: v }));

  const factors = [
    { key: "profitMargin", icon: "💰", title: "Profit Margin", desc: "Weighted score based on the spread between acquisition cost, rehab, and projected ARV.", tips: ["Thin or negative margin — risky deal", "Near breakeven — needs negotiation", "Strong equity spread — high priority"] },
    { key: "neighborhoodAppreciation", icon: "📈", title: "Neighborhood Appreciation", desc: "Historical and projected appreciation data for the specific submarket surrounding the property.", tips: ["Declining or flat area — weak upside", "Stable market — moderate confidence", "Strong appreciation trend — high upside"] },
    { key: "rentalDemand", icon: "🏘", title: "Rental Demand", desc: "Local rental vacancy rates, average rents, and demand indicators for buy-and-hold investors.", tips: ["High vacancy, weak rents — avoid B&H", "Average demand — OK for right price", "Low vacancy, rising rents — excellent hold"] },
    { key: "daysOnMarket", icon: "📅", title: "Days on Market", desc: "Properties sitting longer signal motivated sellers and greater negotiating leverage for the investor.", tips: ["Fresh listing — seller expects full price", "Some time on market — slight leverage", "60+ days — seller is motivated, negotiate hard"] },
    { key: "sellerMotivation", icon: "🎯", title: "Seller Motivation Signals", desc: "AI-detected behavioral and data signals indicating a seller's urgency and likelihood to accept a below-market offer.", tips: ["No urgency detected — hold firm", "Possible motivation — test the waters", "Highly motivated — press for best terms"] },
  ];

  const composite = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / 5 * 20);

  return (
    <div>
      <p style={{ color: "#888", fontSize: 13, lineHeight: 1.7, marginBottom: 20 }}>
        Every property receives a proprietary <strong style={{ color: O }}>Opportunity Score</strong> — a composite investment rating based on multiple data factors that tells investors at a glance whether a deal is worth pursuing.
      </p>
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        <div style={{ flex: 2, minWidth: 300 }}>
          {factors.map(fac => (
            <div key={fac.key} style={{ ...dCard, marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: "bold", color: "white", marginBottom: 2 }}>{fac.icon} {fac.title}</div>
                  <div style={{ fontSize: 12, color: "#555", lineHeight: 1.5 }}>{fac.desc}</div>
                </div>
                <div style={{ fontSize: 20, fontWeight: "bold", color: O, marginLeft: 16, minWidth: 36, textAlign: "right" }}>{scores[fac.key]}/5</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {[1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => setS(fac.key, n)} style={{
                    flex: 1, padding: "8px 0", borderRadius: 6, border: "none", cursor: "pointer",
                    background: scores[fac.key] >= n ? O : "#2a2a2a",
                    color: scores[fac.key] >= n ? "#000" : "#555", fontWeight: "bold", fontSize: 13
                  }}>{n}</button>
                ))}
              </div>
              <div style={{ fontSize: 11, color: "#444", marginTop: 6 }}>{fac.tips[scores[fac.key] <= 2 ? 0 : scores[fac.key] === 3 ? 1 : 2]}</div>
            </div>
          ))}
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ textAlign: "center", position: "sticky", top: 20 }}>
            <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Composite Opportunity Score</div>
            <ScoreRing score={composite} size={170} />
            <div style={{ marginTop: 12, fontSize: 16, fontWeight: "bold", color: composite >= 75 ? "#22c55e" : composite >= 50 ? O : "#ef4444" }}>
              {composite >= 75 ? "🟢 HIGH PRIORITY" : composite >= 50 ? "🟡 WORTH ANALYZING" : "🔴 PASS ON THIS"}
            </div>
            <div style={{ marginTop: 20, ...dCard }}>
              <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Score Guide</div>
              {[["80–100","Chase it hard","#22c55e"],["60–79","Negotiate harder",O],["40–59","Needs more data","#f59e0b"],["0–39","Move on","#ef4444"]].map(([range, label, color]) => (
                <div key={range} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #1c1c1c", fontSize: 13 }}>
                  <span style={{ color, fontWeight: "bold" }}>{range}</span>
                  <span style={{ color: "#666" }}>{label}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14, ...oCard, textAlign: "left" }}>
              <div style={{ fontSize: 12, color: "#ccc", lineHeight: 1.7 }}>
                Members filter their entire pipeline by Opportunity Score — focusing exclusively on <strong style={{ color: O }}>high-probability opportunities</strong> while ignoring the noise.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* PILLAR 4 */
function SellerOutreachPanel() {
  const [tab, setTab] = useState("cold_sms");
  const [name, setName] = useState("John");
  const [address, setAddress] = useState("123 Main St");
  const [offer, setOffer] = useState("175,000");
  const [strategy, setStrategy] = useState("subject-to");
  const [copied, setCopied] = useState(false);

  const tabs = [
    { key: "cold_sms", icon: "📱", label: "Cold SMS" },
    { key: "cold_call", icon: "📞", label: "Cold Call" },
    { key: "direct_mail", icon: "✉️", label: "Direct Mail" },
    { key: "follow_up", icon: "🔄", label: "Follow-Up" },
    { key: "offer_letter", icon: "📄", label: "Offer Letter" },
    { key: "objection", icon: "🛡", label: "Objections" },
    { key: "acquisition", icon: "🔑", label: "Acquisition Strategy" },
  ];

  const getScript = () => {
    const scripts = {
      cold_sms: `Hi ${name} 👋 I'm a local real estate investor. I noticed ${address} and wanted to reach out directly. I buy homes AS-IS — no repairs, no agent fees, no hassle, quick close. Would you be open to a quick 5-min conversation? No pressure. – [Your Name]`,
      cold_call: `"Hi, may I speak with ${name}? 

Hi ${name}, my name is [Your Name] and I'm a local real estate investor — not an agent. I'm calling about ${address}. 

I buy homes directly from owners — no commissions, no repairs, and I can close on your timeline, sometimes in as little as 2 weeks. 

I'm not here to pressure you — just curious if this is something you'd be open to exploring? Even if the timing isn't perfect, I'd love to just learn a bit about your situation."`,
      direct_mail: `Dear ${name},

My name is [Your Name] and I'm a local real estate investor who buys homes directly.

I'm reaching out about ${address}. If you've ever considered selling — or are facing any situation that might make a sale attractive — I'd love to connect.

What I offer:
✓ All-cash purchase — no bank approvals needed
✓ Buy the home AS-IS — no repairs or cleaning
✓ No agent fees or commissions (save 5-6%)
✓ Close on YOUR timeline — 2 weeks or 6 months

Call or text me anytime at [Your Number].

Warmly, [Your Name]`,
      follow_up: `Hi ${name}, following up on my note about ${address}. 

Life gets busy — I get it. I'm still very interested and have complete flexibility on timing — whether that's 2 weeks from now or 6 months. 

No obligation, no pressure. Just reach out whenever you're ready.

[Your Name] | [Your Number]`,
      offer_letter: `Dear ${name},

Thank you for speaking with me about ${address}. Here is my formal purchase offer:

━━━━━━━━━━━━━━━━━━━━━━━
PURCHASE OFFER SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━
Property:        ${address}
Purchase Price:  $${offer}
Earnest Money:   $2,500 (deposited within 3 days)
Closing:         14–21 business days (or your preferred date)
Condition:       Purchased AS-IS — no repairs required
Financing:       All-Cash — no bank contingency
Contingencies:   None

You benefit from speed, certainty, and zero hassle — no showings, no repairs, no waiting on bank approvals.

Please reply to accept or to discuss.

Respectfully,
[Your Name | Company | Phone]`,
      objection: `OBJECTION HANDLING PLAYBOOK

❝ "Your offer is too low." ❞
"I completely understand, ${name}. Let's run the real numbers side by side — with a traditional listing you're paying 6% in agent fees, plus repairs, plus 60-90 days of carrying costs. What does your actual net look like? I'd love to show you a comparison right now."

❝ "I'm not ready to sell." ❞
"No problem at all — I work on your timeline. Can I just check back with you in 30 days? Things change and I want to be your first call when the time is right."

❝ "I need to think about it." ❞
"Absolutely. Is there a specific concern I can help clarify? Sometimes talking through it helps you make the best decision either way — I'm not going anywhere."

❝ "I want to list with an agent." ❞
"That's totally valid. The main tradeoffs are 5-6% commissions, required repairs, open houses, and a 60-90 day process. If any of that sounds like friction, I'm here as a faster alternative. No pressure, ${name} — your call."`,
    };

    const acquisitionScripts = {
      "subject-to": `SUBJECT-TO ACQUISITION — ${address}

Overview: You acquire the deed while the seller's existing mortgage stays in place. You make the payments; the title transfers to you.

Best for: Sellers behind on payments, facing foreclosure, or who need immediate relief.

Script:
"${name}, what if I could take over your mortgage payments completely — relieving you of that burden — and we transfer the property to my name? You'd get immediate relief, walk away clean, and I handle everything from here. This is called a 'subject-to' purchase and it's 100% legal and done at a title company."

Key Terms:
• Deed transfers at closing
• You cover any arrears to bring loan current  
• Insurance and tax responsibilities transfer
• Negotiate any cash-to-seller at close`,

      "seller_financing": `SELLER FINANCING — ${address}

Overview: The seller acts as the bank. You make monthly payments directly to ${name} instead of a traditional lender.

Best for: Sellers who own free-and-clear or want a reliable income stream vs. lump sum.

Script:
"${name}, what if instead of a lump sum, I paid you monthly — like an annuity — over the next several years? You'd earn interest, receive consistent income, and we could agree on a higher total price because I'm not paying all cash upfront. It could actually be more profitable for you."

Typical Structure:
• Purchase Price: $${offer}
• Down Payment: 10–20% at closing
• Interest Rate: 5–7% annually
• Term: 5–15 years with balloon in 3–5 years`,

      "wholesale": `WHOLESALE STRATEGY — ${address}

Overview: Get the property under contract at a deep discount, then assign your contract to an end-buyer for an assignment fee.

Best for: Deep-rehab deals or when you prefer not to hold the asset.

Script:
"${name}, I'd like to put ${address} under contract today at $${offer}. I may bring in a partner or another investor to actually close — but I personally guarantee the transaction. You receive exactly $${offer} at the closing table no matter what."

Assignment Process:
1. Execute purchase agreement with seller
2. Market deal to your buyer list at higher price
3. Assign contract for the spread (your fee)
4. Close via assignment or double-close at title`,

      "traditional": `TRADITIONAL CASH PURCHASE — ${address}

Overview: Clean, straightforward cash or financed acquisition with clear title transfer.

Best for: Clean deals with strong equity and motivated sellers.

Script:
"${name}, I'd like to make a straightforward all-cash offer on ${address} at $${offer}. No agents, no financing contingencies, no repairs required. I can provide proof of funds today and we can be at the closing table in 14 business days."

Acquisition Checklist:
✓ Purchase & Sale Agreement signed
✓ Proof of funds / pre-approval delivered
✓ Title search ordered (5–7 days)
✓ Property walkthrough scheduled
✓ Close at title company`
    };

    return tab === "acquisition" ? acquisitionScripts[strategy] : scripts[tab];
  };

  const copy = () => {
    navigator.clipboard?.writeText(getScript()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div>
      <p style={{ color: "#888", fontSize: 13, lineHeight: 1.7, marginBottom: 20 }}>
        The platform dramatically shortens the time between <strong style={{ color: O }}>finding a deal and making an offer</strong> — equipping investors with everything they need to execute and close.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 22 }}>
        {[
          { title: "Owner Contact Data", desc: "Direct access to verified owner contact info — phone numbers, mailing addresses, and email data — so you reach sellers before competitors even know the property exists." },
          { title: "Outreach Scripts", desc: "Proven, field-tested scripts for cold calls, direct mail, and text campaigns — designed to open conversations with motivated sellers and build rapport quickly." },
          { title: "Negotiation Frameworks", desc: "Structured playbooks based on thousands of real deals — covering price reduction strategies, creative financing conversations, and closing techniques." },
          { title: "Acquisition Strategies", desc: "Multiple pathways including subject-to, seller financing, wholesale, and traditional purchase — matched to the specific deal profile and seller situation." },
        ].map(c => (
          <div key={c.title} style={{ ...dCard, borderTop: `2px solid ${O}` }}>
            <div style={{ fontWeight: "bold", color: O, marginBottom: 6, fontSize: 13 }}>{c.title}</div>
            <div style={{ color: "#666", fontSize: 12, lineHeight: 1.6 }}>{c.desc}</div>
          </div>
        ))}
      </div>
      <div style={{ ...dCard, background: "#161616" }}>
        <div style={{ fontSize: 10, color: O, textTransform: "uppercase", letterSpacing: 2, marginBottom: 14 }}>Script & Framework Generator</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: "7px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 12,
              background: tab === t.key ? O : "#2a2a2a", color: tab === t.key ? "#000" : "#777", fontWeight: "bold"
            }}>{t.icon} {t.label}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 14 }}>
          <div><label style={lbl}>Seller Name</label><input value={name} onChange={e => setName(e.target.value)} style={{ ...inp, width: 130 }} /></div>
          <div><label style={lbl}>Property Address</label><input value={address} onChange={e => setAddress(e.target.value)} style={{ ...inp, width: 220 }} /></div>
          {(tab === "offer_letter" || tab === "acquisition") && (
            <div><label style={lbl}>Offer Amount</label><input value={offer} onChange={e => setOffer(e.target.value)} style={{ ...inp, width: 130 }} /></div>
          )}
          {tab === "acquisition" && (
            <div>
              <label style={lbl}>Strategy Type</label>
              <select value={strategy} onChange={e => setStrategy(e.target.value)} style={{ ...inp, width: 180 }}>
                <option value="subject-to">Subject-To</option>
                <option value="seller_financing">Seller Financing</option>
                <option value="wholesale">Wholesale</option>
                <option value="traditional">Traditional Cash</option>
              </select>
            </div>
          )}
        </div>
        <div style={{
          background: "#0d0d0d", border: "1px solid #252525", borderRadius: 10,
          padding: 20, fontFamily: "Georgia", color: "#ccc", lineHeight: 1.9,
          fontSize: 14, whiteSpace: "pre-wrap", minHeight: 160, maxHeight: 420, overflowY: "auto"
        }}>
          {getScript()}
        </div>
        <button onClick={copy} style={{ ...btnStyle(false), marginTop: 12 }}>
          {copied ? "✓ Copied!" : "📋 Copy to Clipboard"}
        </button>
      </div>
    </div>
  );
}

/* PILLAR 5 */
function DealRoomPanel() {
  const [view, setView] = useState("browse");
  const deals = [
    { investor: "Marcus T.", initials: "MT", city: "Atlanta, GA", type: "Fix & Flip", ask: 245000, arv: 385000, rehab: 52000, score: 88, status: "Seeking Co-Investor", split: "50/50 equity", tags: ["Absentee Owner", "Foreclosure Signal"] },
    { investor: "Sarah K.", initials: "SK", city: "Tampa, FL", type: "BRRRR", ask: 162000, arv: 290000, rehab: 41000, score: 82, status: "Seeking Capital", split: "Pref Return 8%", tags: ["Distressed Property"] },
    { investor: "James R.", initials: "JR", city: "Dallas, TX", type: "Wholesale", ask: 195000, arv: 330000, rehab: 0, score: 75, status: "Assigning Contract", split: "$18K Fee", tags: ["Absentee Owner"] },
    { investor: "Priya M.", initials: "PM", city: "Phoenix, AZ", type: "Buy & Hold", ask: 310000, arv: 430000, rehab: 35000, score: 79, status: "JV Opportunity", split: "60/40", tags: ["Market Appreciation"] },
    { investor: "Derek W.", initials: "DW", city: "Charlotte, NC", type: "Fix & Flip", ask: 178000, arv: 295000, rehab: 48000, score: 85, status: "Seeking Hard Money", split: "Equity Kicker", tags: ["Distressed", "High DOM"] },
  ];

  return (
    <div>
      <p style={{ color: "#888", fontSize: 13, lineHeight: 1.7, marginBottom: 20 }}>
        The <strong style={{ color: O }}>Investor Deal Room</strong> is where AI-powered deal discovery meets investor collaboration. Members share opportunities, post their deals, partner on acquisitions, and fund deals together. Because in real estate, your network truly becomes your net worth.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10, marginBottom: 22 }}>
        {[
          { icon: "🎯", title: "Pitch Deals", desc: "Bring your best AI-analyzed opportunities and present them to a community of active investors ready to co-invest or partner on acquisitions." },
          { icon: "🤝", title: "Find Partners", desc: "Connect with experienced investors, operators, and deal-finders who complement your skill set and expand your acquisition capacity." },
          { icon: "💰", title: "Secure Funding", desc: "Access a network of private lenders, hard money sources, and equity partners actively looking to deploy capital into well-analyzed deals." },
          { icon: "🌐", title: "Collaborate", desc: "The ecosystem creates a flywheel — better deals attract better partners, which attracts more capital, which enables more deals." },
        ].map(f => (
          <div key={f.title} style={oCard}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>{f.icon}</div>
            <div style={{ fontWeight: "bold", color: "white", marginBottom: 6, fontSize: 14 }}>{f.title}</div>
            <div style={{ color: "#ccc", fontSize: 12, lineHeight: 1.6 }}>{f.desc}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 0, marginBottom: 16, background: "#1a1a1a", borderRadius: 8, padding: 4, width: "fit-content" }}>
        {[["browse", "Browse Active Deals"], ["post", "Post Your Deal"]].map(([k, l]) => (
          <button key={k} onClick={() => setView(k)} style={{
            padding: "8px 20px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 13,
            background: view === k ? O : "transparent", color: view === k ? "#000" : "#555", fontWeight: "bold"
          }}>{l}</button>
        ))}
      </div>

      {view === "browse" && (
        <div>
          <div style={{ color: "#555", fontSize: 13, marginBottom: 12 }}>
            <span style={{ color: O, fontWeight: "bold" }}>{deals.length} live deals</span> active in the community
          </div>
          {deals.map((d, i) => {
            const profit = d.arv - d.ask - d.rehab;
            return (
              <div key={i} style={{ ...dCard, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", marginBottom: 10 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: O, color: "#000", fontWeight: "bold", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{d.initials}</div>
                <div style={{ flex: 2, minWidth: 180 }}>
                  <div style={{ fontWeight: "bold", color: "white", marginBottom: 2 }}>{d.investor}</div>
                  <div style={{ color: "#555", fontSize: 12, marginBottom: 6 }}>{d.city} · {d.type}</div>
                  <div>{d.tags.map(t => <Tag key={t} text={t} color="#60a5fa" />)}<Tag text={d.status} color={O} /></div>
                </div>
                {[["ASK/ARV", `$${(d.ask/1000).toFixed(0)}K / $${(d.arv/1000).toFixed(0)}K`, "#aaa"], ["PROFIT EST.", `$${profit.toLocaleString()}`, "#22c55e"], ["SPLIT", d.split, O]].map(([label, val, color]) => (
                  <div key={label} style={{ textAlign: "center", minWidth: 90 }}>
                    <div style={{ fontSize: 9, color: "#444", marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.8 }}>{label}</div>
                    <div style={{ color, fontWeight: "bold", fontSize: 13 }}>{val}</div>
                  </div>
                ))}
                <ScoreRing score={d.score} size={68} />
                <button style={btnStyle(false)}>Connect</button>
              </div>
            );
          })}
        </div>
      )}

      {view === "post" && (
        <div style={dCard}>
          <div style={{ fontSize: 13, fontWeight: "bold", color: O, marginBottom: 16 }}>Post a Deal to the Community</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[["Property Address", "text"], ["Market / City", "text"], ["Purchase Price ($)", "number"], ["ARV ($)", "number"], ["Rehab Cost ($)", "number"], ["Opportunity Score", "number"]].map(([label, type]) => (
              <div key={label}><label style={lbl}>{label}</label><input type={type} style={inp} /></div>
            ))}
            <div><label style={lbl}>Investment Type</label><select style={inp}><option>Fix & Flip</option><option>BRRRR</option><option>Wholesale</option><option>Buy & Hold</option></select></div>
            <div><label style={lbl}>What You're Seeking</label><select style={inp}><option>Co-Investor (50/50)</option><option>Capital / Hard Money</option><option>JV Partner</option><option>Assigning Contract</option></select></div>
            <div style={{ gridColumn: "1 / -1" }}><label style={lbl}>Deal Summary</label><textarea style={{ ...inp, minHeight: 80, resize: "vertical" }} placeholder="Describe the deal, location highlights, and why it's a strong opportunity..." /></div>
          </div>
          <button style={{ ...btnStyle(true), marginTop: 14 }}>🚀 Post to Deal Room</button>
        </div>
      )}
    </div>
  );
}

/* MAIN */
const pillars = [
  { id: 1, key: "finder", icon: "🔍", name: "AI Deal Finder", subtitle: "Scan. Identify. Act." },
  { id: 2, key: "analyzer", icon: "📊", name: "AI Deal Analyzer", subtitle: "Instant Acquisition Intelligence" },
  { id: 3, key: "score", icon: "⚡", name: "Opportunity Score", subtitle: "Focus on High-Probability Deals" },
  { id: 4, key: "outreach", icon: "📞", name: "Seller Outreach", subtitle: "From Analysis to Acquisition" },
  { id: 5, key: "dealroom", icon: "🤝", name: "Investor Deal Room", subtitle: "Where Technology Meets Relationships" },
];
const panels = { finder: DealFinderPanel, analyzer: DealAnalyzerPanel, score: OpportunityScorePanel, outreach: SellerOutreachPanel, dealroom: DealRoomPanel };

export default function App() {
  const [active, setActive] = useState("finder");
  const current = pillars.find(p => p.key === active);
  const Panel = panels[active];

  return (
    <div style={{ minHeight: "100vh", background: DARK, color: "white", fontFamily: "'Trebuchet MS', 'Gill Sans', sans-serif" }}>
      <div style={{ background: "#0d0d0d", borderBottom: `2px solid ${GOLD}44`, padding: "18px 32px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 10, color: O, textTransform: "uppercase", letterSpacing: 4, marginBottom: 4 }}>Deal Lab</div>
            <div style={{ fontSize: 22, fontWeight: "bold" }}>
              <span style={{ color: "white" }}>THE </span>
              <span style={{ color: O }}>AI DEAL ENGINE</span>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "#444" }}>Real Estate Investment OS</div>
            <div style={{ fontSize: 11, color: O, marginTop: 2 }}>● LIVE</div>
          </div>
        </div>
      </div>

      <div style={{ background: "#0d0d0d", borderBottom: "1px solid #1a1a1a", overflowX: "auto" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", display: "flex" }}>
          {pillars.map(p => (
            <button key={p.key} onClick={() => setActive(p.key)} style={{
              background: "none", border: "none", cursor: "pointer", padding: "14px 18px",
              borderBottom: active === p.key ? `2px solid ${O}` : "2px solid transparent",
              color: active === p.key ? O : "#555", fontWeight: active === p.key ? "bold" : "normal",
              fontSize: 13, whiteSpace: "nowrap", fontFamily: "inherit",
              display: "flex", alignItems: "center", gap: 7
            }}>
              <span>{p.icon}</span><span>{p.id}. {p.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "28px 32px" }}>
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "28px 30px" }}>
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 10, color: O, textTransform: "uppercase", letterSpacing: 3, marginBottom: 4 }}>Pillar {current.id}</div>
            <div style={{ fontSize: 22, fontWeight: "bold", color: "white" }}>{current.icon} {current.name}</div>
            <div style={{ fontSize: 13, color: "#555", marginTop: 2 }}>{current.subtitle}</div>
            <div style={{ width: 40, height: 2, background: O, marginTop: 10 }} />
          </div>
          <Panel />
        </div>
      </div>
    </div>
  );
}
