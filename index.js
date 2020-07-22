const express = require("express");
const connection = require("./conf");
const app = express();
const cors = require("cors");
const port = 8080;

app.use(cors());

// Support JSON-encoded bodies
app.use(express.json());
// Support URL-encoded bodies
app.use(
  express.urlencoded({
    extended: true,
  })
);

// DIVERS
app.get("/api/divers", (req, res) => {
  connection.query("SELECT * FROM diver", (err, result) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.json(results);
    }
  });
});

app.get("/api/divers/:idDiver", (req, res) => {
  const idDiver = req.params.idDiver;
  connection.query(
    "SELECT * FROM diver WHERE id = ?",
    idDiver,
    (err, result) => {
      if (err) {
        res.status(500).send(err.message);
      } else {
        res.json(results);
      }
    }
  );
});

// DIVING
app.get("/api/diving", (req, res) => {
  connection.query("SELECT * FROM diving", (err, result) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.json(results);
    }
  });
});

app.get("/api/diving/:idDiving", (req, res) => {
  const idDiving = req.params.idDiving;
  connection.query(
    "SELECT * FROM diving WHERE id = ?",
    idDiving,
    (err, result) => {
      if (err) {
        res.status(500).send(err.message);
      } else {
        res.json(results);
      }
    }
  );
});

//SERVER LISTENING
app.listen(port, (err) => {
  if (err) {
    throw new Error("Something bad happened...");
  }
  console.log(`Server is listening on ${port}`);
});
