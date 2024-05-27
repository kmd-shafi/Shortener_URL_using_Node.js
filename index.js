const express = require("express");
const path = require("path");
const app = express();
const port = 3000;
const Urlrouter = require("./routes/url");
const { connectToMongoDB } = require("./connection");
const URL = require("./model/url");
const static = require("./routes/static");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/url", Urlrouter);
app.use("/", static);

connectToMongoDB("mongodb://localhost:27017/short-url");

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.get("/url/:shortId", async (req, res) => {
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
