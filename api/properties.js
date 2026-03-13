const https = require("https");

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const ATTOM_KEY = process.env.VITE_ATTOM_KEY;
  if (!ATTOM_KEY) return res.status(500).json({ error: "Missing ATTOM API key" });

  const params = new URLSearchParams(req.query);
  for (const [k, v] of [...params]) {
    if (!v || v === "0" || v === "undefined" || v === "all") params.delete(k);
  }

  const path = `/propertyapi/v1.0.0/property/snapshot?${params}`;

  return new Promise((resolve) => {
    const options = {
      hostname: "api.developer.attomdata.com",
      path,
      method: "GET",
      headers: {
        Accept: "application/json",
        apikey: ATTOM_KEY,
      },
    };

    const attomReq = https.request(options, (attomRes) => {
      let body = "";
      attomRes.on("data", (chunk) => { body += chunk; });
      attomRes.on("end", () => {
        try {
          const data = JSON.parse(body);
          res.status(attomRes.statusCode).json(data);
        } catch (e) {
          res.status(500).json({ error: "Failed to parse ATTOM response", raw: body.slice(0, 200) });
        }
        resolve();
      });
    });

    attomReq.on("error", (err) => {
      res.status(500).json({ error: err.message });
      resolve();
    });

    attomReq.end();
  });
};
