export default async function handler(req, res) {
  // Allow CORS from your domain
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

  // Forward all query params to ATTOM
  const params = new URLSearchParams(req.query);

  try {
    const attomRes = await fetch(
      `https://api.developer.attomdata.com/propertyapi/v1.0.0/property/detail?${params}`,
      {
        headers: {
          Accept: "application/json",
          apikey: ATTOM_KEY,
        },
      }
    );

    const data = await attomRes.json();

    if (!attomRes.ok) {
      return res.status(attomRes.status).json({ error: data });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
