const https = require("https");

module.exports = function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const key = process.env.VITE_ATTOM_KEY || "";
  const city = (req.query.city || "Phoenix").replace(/ /g, "%20");
  const state = req.query.state || "AZ";
  const url = `/propertyapi/v1.0.0/property/snapshot?city=${city}&state=${state}&pagesize=20&page=1`;

  const options = {
    hostname: "api.developer.attomdata.com",
    path: url,
    method: "GET",
    headers: {
      "Accept": "application/json",
      "apikey": key,
    },
  };

  const req2 = https.request(options, function(resp) {
    var body = "";
    resp.on("data", function(c) { body += c; });
    resp.on("end", function() {
      try {
        res.status(resp.statusCode).json(JSON.parse(body));
      } catch(e) {
        res.status(500).json({ error: "parse error", raw: body.slice(0, 300) });
      }
    });
  });

  req2.on("error", function(e) {
    res.status(500).json({ error: e.message });
  });

  req2.end();
};
