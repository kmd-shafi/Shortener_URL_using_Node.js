const express = require("express");
const app = express();
const port = 3000;
const Urlrouter = require("./routes/url");
const { connectToMongoDB } = require("./connection");
const URL = require("./model/url");

app.use(express.json());
app.use("/url", Urlrouter);

connectToMongoDB("mongodb://localhost:27017/short-url");

app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    { shortId },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  res.redirect(entry.redirectURL);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
