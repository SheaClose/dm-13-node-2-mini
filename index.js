require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const massive = require("massive");

const app = express();

massive(process.env.CONNECTION_STRING)
  .then(dbInstance => {
    app.set("db", dbInstance);
    dbInstance.airplanes();
    dbInstance.new_planes();
  })
  .catch(console.log);

app.use(bodyParser.json());
app.use(cors());

app.get("/api/planes", (req, res) => {
  req.app
    .get("db")
    .get_planes()
    .then(planes => res.status(200).json(planes));
});

app.get("/api/plane/:id", (req, res) => {
  req.app
    .get("db")
    .run("select * from airplanes where plane_id = $1", [req.params.id])
    .then(planes => res.status(200).json(planes));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
