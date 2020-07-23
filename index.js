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
  connection.query("SELECT * FROM diver", (err, results) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.json(results);
    }
  });
});

app.post("/api/divers", (req, res) => {
  const formData = req.body;
  connection.query("INSERT INTO diver SET ?", formData, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send(err.message);
    } else {
      res.sendStatus(200);
    }
  });
});

app.get("/api/divers/:idDiver", (req, res) => {
  const idDiver = req.params.idDiver;
  connection.query(
    "SELECT * FROM diver WHERE id_diver = ?",
    idDiver,
    (err, result) => {
      if (err) {
        res.status(500).send(err.message);
      } else {
        res.json(result);
      }
    }
  );
});

app.get("/api/divers/redux/:login", (req, res) => {
  const login = req.params.login;
  connection.query(
    "SELECT id_diver, lastname, firstname, email FROM diver WHERE email = ?",
    login,
    (err, result) => {
      if (err || !result[0]) {
        res.status(500).send('login inexistant');
      } else {
        res.json(result);
      }
    }
  );
});

// LOGIN
app.post("/api/divers/login", (req, res) => {
  const { email, password } = req.body;
  connection.query(
    "SELECT * FROM diver WHERE email = ? AND password = ?",
    [email, password],
    (err, result) => {
      if (err || !result[0]) {
        res.status(500).send("Login ou Mot de passe erroné...");
      } else {
        res.send(result);
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
      res(result.data);
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
