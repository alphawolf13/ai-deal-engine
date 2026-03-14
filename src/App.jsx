function DealFinderPanel({ isMember, onUpgrade }) {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [signal, setSignal] = useState("all");
  const [f, setF] = useState({
    zip: "85254",
    minPrice: 0, maxPrice: 900000,
    minBeds: 0, maxBeds: 10,
    propType: "all",
  });
  const sf = (k, v) => setF(p => ({ ...p, [k]: v }));

  const FREE_LIMIT = 3;

  const signalColors = {
    absentee: "#60a5fa", distressed: "#f87171",
    foreclosure: "#fb923c", appreciation: "#34d399"
  };
  const signals = [
    { key: "all", label: "All Signals" },
    { key: "absentee", label: "👤 Absentee" },
    { key: "distressed", label: "🏚 Distressed" },
    { key: "foreclosure", label: "⚠️ Foreclosure" },
    { key: "appreciation", label: "📈 Appreciation" },
  ];
  const propTypes = [
    { key: "all", label: "All Types" },
    { key: "SFR", label: "🏠 SFR" },
    { key: "CONDOMINIUM", label: "🏙 Condo" },
    { key: "TOWNHOUSE", label: "🏘 Townhouse" },
  ];

  const assignSignal = (prop) => {
    const yearBuilt = prop.summary?.yearbuilt || 1990;
    const age = new Date().getFullYear() - yearBuilt;
    const sqft = prop.building?.size?.universalsize || 0;
    const baths = prop.building?.rooms?.bathstotal || 0;

    if (age > 40) return { signal: "distressed", label: "Older Build — Distressed Signal" };
    if (sqft > 2500) return { signal: "appreciation", label: "Large Home — Appreciation Target" };
    if (baths >= 3) return { signal: "absentee", label: "Absentee Owner Signal" };
    return { signal: "foreclosure", label: "Foreclosure Signal" };
  };

  const calcScore = (prop, estValue, askPrice) => {
    const rehab = 40000;
    const profit = estValue - askPrice - rehab;
    const roi = (profit / (askPrice + rehab)) * 100;
    const beds = prop.building?.rooms?.bathstotal || 0;
    let score = 45;
    if (profit > 0) score += 20;
    if (roi > 20) score += 15;
    else if (roi > 10) score += 8;
    if (beds >= 2) score += 10;
    if ((prop.summary?.yearbuilt || 2000) < 2000) score += 5;
    return Math.min(97, Math.max(38, Math.round(score)));
  };

  const scan = async () => {
    if (!f.zip || f.zip.length < 5) {
      setError("Please enter a valid 5-digit zip code.");
      return;
    }
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const res = await fetch(`/api/properties?zip=${f.zip}`);

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`API error ${res.status}: ${errText}`);
      }

      const data = await res.json();

      if (data.status?.code !== 0) {
        throw new Error(data.status?.msg || "ATTOM returned an error");
      }

      const properties = data.property || [];

      if (properties.length === 0) {
        setError("No properties found for that zip code. Try a different zip.");
        setLoading(false);
        return;
      }

      const processed = properties
        .filter(p => p.address?.line1)
        .map(p => {
          const assessedVal = p.assessment?.assessed?.assdTtlValue || 0;
          const estValue = assessedVal > 0 ? Math.round(assessedVal * 1.15) : 250000;
          const askPrice = Math.round(estValue * 0.80);
          const rehab = 40000;
          const profit = estValue - askPrice - rehab;
          const roi = Math.round((profit / (askPrice + rehab)) * 100);
          const { signal: sig, label } = assignSignal(p);
          const score = calcScore(p, estValue, askPrice);
          const beds = p.building?.rooms?.bathstotal || 0;
          const sqft = p.building?.size?.universalsize || 0;
          const yearBuilt = p.summary?.yearbuilt || 0;
          const propTypeRaw = p.summary?.proptype || p.summary?.propertyType || "SFR";

          // Apply filters
          if (f.propType !== "all" && !propTypeRaw.toUpperCase().includes(f.propType)) return null;
          if (askPrice > 0 && f.maxPrice > 0 && askPrice > f.maxPrice) return null;
          if (askPrice > 0 && f.minPrice > 0 && askPrice < f.minPrice) return null;
          if (f.minBeds > 0 && beds < f.minBeds) return null;

          return {
            address: p.address.line1,
            city: p.address.locality || "",
            state: p.address.countrySubd || "",
            zip: p.address.postal1 || f.zip,
            price: askPrice,
            arv: estValue,
            assessed: assessedVal,
            rehab,
            profit,
            roi,
            score,
            beds,
            sqft,
            yearBuilt,
            signal: sig,
            signalLabel: label,
            propType: propTypeRaw,
            attomId: p.identifier?.attomId,
          };
        })
        .filter(Boolean)
        .filter(p => signal === "all" || p.signal === signal)
        .sort((a, b) => b.score - a.score);

      setResults(processed);
    } catch (err) {
      console.error("ATTOM error:", err);
      setError(`Could not load properties: ${err.message}`);
    }
    setLoading(false);
  };

  const resetFilters = () => {
    setF({ zip: "85254", minPrice: 0, maxPrice: 900000, minBeds: 0, maxBeds: 10, propType: "all" });
    setSignal("all");
    setResults(null);
    setError(null);
  };

  return (
    <div>
      <p style={{ color: "#888", fontSize: 13, lineHeight: 1.7, marginBottom: 20 }}>
        Live property data powered by <strong style={{ color: O }}>ATTOM</strong> — real addresses, real signals, real deals. Search by zip code.
        {!isMember && <span style={{ color: O, fontWeight: "bold" }}> Free trial: top 3 results shown.</span>}
      </p>

      {/* Signal badges */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 10, marginBottom: 22 }}>
        {[
          { icon: "👤", title: "Absentee Owners", color: "#60a5fa" },
          { icon: "🏚", title: "Distressed Properties", color: "#f87171" },
          { icon: "⚠️", title: "Foreclosure Signals", color: "#fb923c" },
          { icon: "📈", title: "Market Appreciation", color: "#34d399" },
        ].map(s => (
          <div key={s.title} style={{ ...dCard2, borderLeft: `3px solid ${s.color}` }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 12, fontWeight: "bold", color: s.color }}>{s.title}</div>
          </div>
        ))}
      </div>

      {/* Zip code input — primary search */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 14 }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <label style={lbl2}>Zip Code <span style={{ color: O }}>*</span></label>
          <input
            value={f.zip}
            onChange={e => sf("zip", e.target.value)}
            style={{ ...inp2, fontSize: 18, fontWeight: "bold" }}
            placeholder="e.g. 85254"
            maxLength={5}
          />
          <div style={{ fontSize: 10, color: "#444", marginTop: 4 }}>ATTOM searches by zip code — enter any US zip</div>
        </div>
        <div style={{ flex: 1, minWidth: 150 }}>
          <label style={lbl2}>Min Price ($)</label>
          <input type="number" value={f.minPrice} onChange={e => sf("minPrice", +e.target.value)} style={inp2} />
        </div>
        <div style={{ flex: 1, minWidth: 150 }}>
          <label style={lbl2}>Max Price ($)</label>
          <input type="number" value={f.maxPrice} onChange={e => sf("maxPrice", +e.target.value)} style={inp2} />
        </div>
        <div style={{ flex: 1, minWidth: 140 }}>
          <label style={lbl2}>Property Type</label>
          <select value={f.propType} onChange={e => sf("propType", e.target.value)} style={inp2}>
            {propTypes.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
          </select>
        </div>
      </div>

      {/* Signal filter */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
        {signals.map(s => (
          <button key={s.key} onClick={() => setSignal(s.key)} style={{
            padding: "7px 14px", borderRadius: 20, border: "none", cursor: "pointer",
            fontSize: 12, background: signal === s.key ? O : "#2a2a2a",
            color: signal === s.key ? "#000" : "#888", fontWeight: "bold"
          }}>{s.label}</button>
        ))}
        <button onClick={resetFilters} style={{ padding: "7px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 12, background: "#1a1a1a", color: "#555" }}>↺ Reset</button>
      </div>

      <button onClick={scan} disabled={loading} style={{ background: O, color: "#000", border: "none", borderRadius: 8, padding: "13px 0", width: "100%", fontWeight: "bold", cursor: "pointer", fontSize: 14, fontFamily: "inherit", opacity: loading ? 0.8 : 1 }}>
        {loading ? "⚙️ Scanning live market data..." : "🔍 Scan Market"}
      </button>

      {/* Error */}
      {error && (
        <div style={{ marginTop: 16, background: "#ef444418", border: "1px solid #ef444444", borderRadius: 8, padding: "12px 16px", color: "#f87171", fontSize: 13 }}>
          ⚠️ {error}
        </div>
      )}

      {/* Results */}
      {results && !loading && !error && (
        <div style={{ marginTop: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontSize: 13, color: "#555" }}>
            <span>
              <span style={{ color: O, fontWeight: "bold" }}>{results.length} live properties</span> found in {f.zip}
              {!isMember && results.length > FREE_LIMIT && ` — showing top ${FREE_LIMIT} free`}
            </span>
            <span style={{ color: "#333", fontSize: 11 }}>Powered by ATTOM Data</span>
          </div>

          {results.length === 0 ? (
            <div style={{ ...dCard2, textAlign: "center", padding: 40 }}>
              <div style={{ fontSize: 32 }}>🔍</div>
              <div style={{ color: "#666", marginTop: 12 }}>No properties match your filters. Try adjusting or resetting.</div>
            </div>
          ) : (
            <>
              {results.slice(0, isMember ? results.length : FREE_LIMIT).map((p, i) => {
                const sc = signalColors[p.signal];
                return (
                  <div key={i} style={{ ...dCard2, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", marginBottom: 10, borderLeft: `3px solid ${sc}` }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: i === 0 ? O : "#1e1e1e", color: i === 0 ? "#000" : "#555", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: "bold", flexShrink: 0 }}>{i + 1}</div>
                    <div style={{ flex: 2, minWidth: 180 }}>
                      <div style={{ fontWeight: "bold", color: "white", marginBottom: 3 }}>{p.address}</div>
                      <div style={{ color: "#555", fontSize: 11, marginBottom: 5 }}>
                        {p.city}{p.city && p.state ? ", " : ""}{p.state} {p.zip}
                        {p.sqft > 0 ? ` · ${p.sqft.toLocaleString()} sqft` : ""}
                        {p.yearBuilt > 0 ? ` · Built ${p.yearBuilt}` : ""}
                      </div>
                      <div><Tag text={p.signalLabel} color={sc} /><Tag text={p.propType} color="#a78bfa" /></div>
                    </div>
                    {[
                      ["EST. ASK", p.price > 0 ? `$${(p.price / 1000).toFixed(0)}K` : "N/A", "white"],
                      ["AVM EST.", p.arv > 0 ? `$${(p.arv / 1000).toFixed(0)}K` : "N/A", "#aaa"],
                      ["EST. PROFIT", p.profit > 0 ? `$${p.profit.toLocaleString()}` : "TBD", "#22c55e"],
                      ["ROI", p.arv > 0 ? `${p.roi}%` : "TBD", O],
                    ].map(([label, val, color]) => (
                      <div key={label} style={{ textAlign: "center", minWidth: 60 }}>
                        <div style={{ fontSize: 9, color: "#444", marginBottom: 3, textTransform: "uppercase" }}>{label}</div>
                        <div style={{ color, fontWeight: "bold", fontSize: 14 }}>{val}</div>
                      </div>
                    ))}
                    <ScoreRing score={p.score} size={68} />
                  </div>
                );
              })}

              {/* Blurred locked results */}
              {!isMember && results.length > FREE_LIMIT && (
                <div style={{ position: "relative", borderRadius: 10, overflow: "hidden" }}>
                  {results.slice(FREE_LIMIT).map((p, i) => {
                    const sc = signalColors[p.signal];
                    return (
                      <div key={i} style={{ ...dCard2, display: "flex", alignItems: "center", gap: 14, marginBottom: 10, borderLeft: `3px solid ${sc}`, filter: "blur(4px)", userSelect: "none", pointerEvents: "none" }}>
                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#1e1e1e", color: "#555", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: "bold" }}>{i + FREE_LIMIT + 1}</div>
                        <div style={{ flex: 2 }}>
                          <div style={{ fontWeight: "bold", color: "white" }}>{p.address}</div>
                          <div style={{ color: "#555", fontSize: 11 }}>{p.city}, {p.state} · {p.sqft > 0 ? p.sqft.toLocaleString() + " sqft" : ""}</div>
                        </div>
                        {[["ASK", `$${(p.price / 1000).toFixed(0)}K`], ["PROFIT", "???"], ["ROI", "???"]].map(([label, val]) => (
                          <div key={label} style={{ textAlign: "center", minWidth: 60 }}>
                            <div style={{ fontSize: 9, color: "#444", marginBottom: 3 }}>{label}</div>
                            <div style={{ color: "white", fontWeight: "bold" }}>{val}</div>
                          </div>
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