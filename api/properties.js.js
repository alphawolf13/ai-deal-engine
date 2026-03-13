import https from "https";

export default function handler(req, res) {
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
  const path = "/propertyapi/v1.0.0/property/snapshot?city=" + city + "&state=" + state + "&pagesize=20&page=1";

  https.get({
    hostname: "api.developer.attomdata.com",
    path: path,
    headers: {
      "Accept": "application/json",
      "apikey": key
    }
  }, function(r) {
    var body = "";
    r.on("data", function(d) { body += d; });
    r.on("end", function() {
      try {
        res.status(r.statusCode).json(JSON.parse(body));
      } catch(e) {
        res.status(500).json({ error: "parse error", body: body.slice(0, 200) });
      }
    });
  }).on("error", function(e) {
    res.status(500).json({ error: e.message });
  });
}
