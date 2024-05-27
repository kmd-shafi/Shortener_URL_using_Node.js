const shortId = require("shortid");
const URL = require("../model/url");

async function handleGenerateShortUrl(req, res) {
  const body = req.body;

  if (!body.url)
    return res.status(400).json({ error: "Please provide the URL" });

  const shortID = shortId();

  await URL.create({
    shortId: shortID,
    redirectURL: body.url,
    visitHistory: [],
  });
  return res.render("home", { id: shortID });
  // return res.json({ id: shortID });
}

async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;
  const result = await URL.findOne({ shortId });
  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}

module.exports = { handleGenerateShortUrl, handleGetAnalytics };
