const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const nginx = require("./create-nginx-config");
const uuid = require("uuid");
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(morgan("dev"));

const PORT = process.env.PORT || 4000;

app.post("/create", async (req, res) => {
  const { domain, port } = req.body;
  try {
    await nginx.generateConfig(domain, port);
    res.json({ status: "success", message: "config created" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "fail", message: "config failed" });
  }
});

app.get("/uuid", async (req, res) => {
  let id = uuid.v4();
  while (!nginx.isDomainAvailable(id)) {
    id = uuid.v4();
  }
  res.json({ status: "success", message: "uuid created", data: { uuid: id } });
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
