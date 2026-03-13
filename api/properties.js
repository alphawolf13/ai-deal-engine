export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const key = process.env.VITE_ATTOM_KEY;
  if (!key) {
    res.status(500).json({ error: "No API key" });
    return;
  }

  const city = encodeURIComponent(req.query.city || "Phoenix");
  const state = encodeURIComponent(req.query.state || "AZ");
  const url = `https://api.developer.attomdata.com/propertyapi/v1.0.0/property/snapshot?city=${city}&state=${state}&pagesize=20&page=1`;

  const response = await fetch(url, {
    headers: {
      "Accept": "application/json",
      "apikey": key
    }
  });

  const data = await response.json();
  res.status(response.status).json(data);
}
