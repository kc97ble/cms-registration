import * as express from "express";

const app = express();

app.get("/", function (req, res) {
  res.send("Hello World");
});

app.listen(8038);