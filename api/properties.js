module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const ATTOM_KEY = process.env.VITE_ATTOM_KEY;

  if (!ATTOM_KEY) {
    return res.status(500).json({ error: "Missing ATTOM API key" });
  }

  const params = new URLSearchParams(req.query);

  // Remove empty params
  for (const [k, v] of [...params]) {
    if (v === "" || v === "0" || v === "undefined") params.delete(k);
  }

  try {
    const attomRes = await fetch(
      `https://api.developer.attomdata.com/propertyapi/v1.0.0/property/snapshot?${params}`,
      {
        headers: {
          Accept: "application/json",
          apikey: ATTOM_KEY,
        },
      }
    );

    const data = await attomRes.json();

    if (!attomRes.ok) {
      console.error("ATTOM error:", JSON.stringify(data));
      return res.status(attomRes.status).json({ error: data });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("Proxy error:", err.message);
    return res.status(500).json({ error: err.message });
  }
};
