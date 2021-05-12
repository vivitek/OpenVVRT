const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { generateConfig } = require("./create-nginx-config");
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(morgan("dev"));

const PORT = process.env.PORT || 4000;

app.post("/create", async (req, res) => {
  const { domain, port } = req.body;
  try {
    await generateConfig(domain, port);
    res.json({ status: "success", message: "config created" });
  } catch (error) {
    res.status(500).json({ status: "fail", message: "config failed" });
  }
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
