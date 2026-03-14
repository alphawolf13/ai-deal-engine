export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const key = process.env.ATTOM_KEY;
  if (!key) {
    res.status(500).json({ error: "No API key" });
    return;
  }

  const zip = req.query.zip || "85001";
  const url = `https://api.gateway.attomdata.com/propertyapi/v1.0.0/property/snapshot?postalcode=${zip}&pagesize=20&page=1`;

  const response = await fetch(url, {
    headers: {
      "Accept": "application/json",
      "apikey": key
    }
  });

  const data = await response.json();
  res.status(response.status).json(data);
}