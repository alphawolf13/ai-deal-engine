const https = require("https");

module.exports = function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const ATTOM_KEY = process.env.VITE_ATTOM_KEY;

  if (!ATTOM_KEY) {
    console.error("ERROR: VITE_ATTOM_KEY is not set");
    res.status(500).json({ error: "Missing ATTOM API key in environment" });
    return;
  }

  // Build clean params - only include what ATTOM needs
  const city = req.query.city || "Phoenix";
  const state = req.query.state || "AZ";
  const pageSize = req.query.pageSize || "10";
  const page = req.query.page || "1";

  // Build query string manually to avoid any encoding issues
  let queryParts = [
    `city=${encodeURIComponent(city)}`,
    `state=${encodeURIComponent(state)}`,
    `pagesize=${pageSize}`,
    `page=${page}`,
  ];

  if (req.query.postalCode) queryParts.push(`postalCode=${req.query.postalCode}`);
  if (req.query.propertyType && req.query.propertyType !== "all") queryParts.push(`propertyType=${req.query.propertyType}`);
  if (req.query.minBedrooms && req.query.minBedrooms !== "0") queryParts.push(`minBedrooms=${req.query.minBedrooms}`);
  if (req.query.maxBedrooms && req.query.maxBedrooms !== "10") queryParts.push(`maxBedrooms=${req.query.maxBedrooms}`);

  const queryString = queryParts.join("&");
  const path = `/propertyapi/v1.0.0/property/snapshot?${queryString}`;

  console.log("ATTOM request path:", path);
  console.log("Using key ending in:", ATTOM_KEY.slice(-6));

  const options = {
    hostname: "api.developer.attomdata.com",
    path,
    method: "GET",
    headers: {
      "Accept": "application/json",
      "apikey": ATTOM_KEY,
    },
  };

  const request = https.request(options, (response) => {
    let data = "";
    response.on("data", (chunk) => { data += chunk; });
    response.on("end", () => {
      console.log("ATTOM status:", response.statusCode);
      console.log("ATTOM response preview:", data.slice(0, 300));
      try {
        const parsed = JSON.parse(data);
        res.status(response.statusCode).json(parsed);
      } catch (e) {
        console.error("JSON parse error:", e.message);
        res.status(500).json({ error: "Failed to parse response", raw: data.slice(0, 200) });
      }
    });
  });

  request.on("error", (err) => {
    console.error("HTTPS request error:", err.message);
    res.status(500).json({ error: err.message });
  });

  request.end();
};
