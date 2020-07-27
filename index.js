const express = require("express");
const connection = require("./conf");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const app = express();
const cors = require("cors");
const port = 8080;

const verifyPass = (userPassword, hashedPassword) => {
  return bcrypt.compareSync(userPassword, hashedPassword);
};

app.use(cors());
// Support JSON-encoded bodies
app.use(express.json());
// Support URL-encoded bodies
app.use(
  express.urlencoded({
    extended: true,
  })
);

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      session: false,
    },
    function (email, password, cb) {
      connection.query(
        "SELECT * FROM diver WHERE email = ?",
        email,
        (err, user) => {
          if (err) return cb(err);
          if (!user[0]) return cb(null, false, { error: "Login erroné" });
          if (!verifyPass(password, user[0].password))
            return cb(null, false, { error: "Mot de passe erroné" });
          return cb(null, user[0]);
        }
      );
    }
  )
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
        res.status(500).send("login inexistant");
      } else {
        res.json(result);
      }
    }
  );
});

// REGISTER
app.post("/api/divers/register", (req, res) => {
  const hashPass = bcrypt.hashSync(req.body.password, 10);
  connection.query(
    "INSERT INTO diver SET ?",
    { ...req.body, password: hashPass },
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send(err.message);
      } else {
        res.sendStatus(200);
      }
    }
  );
});

// LOGIN
app.post("/api/divers/login", (req, res) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return res.status(500).send(err);
    if (!user) return res.status(401).json(info);
    return res.status(200).json({ user });
  })(req, res);
});

// DIVING
app.get("/api/diving", (req, res) => {
  connection.query("SELECT * FROM diving", (err, result) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.json(result);
    }
  });
});

app.get("/api/diving/:idDiving", (req, res) => {
  const idDiving = req.params.idDiving;
  connection.query(
    "SELECT * FROM diving WHERE id_diving = ?",
    idDiving,
    (err, result) => {
      if (err) {
        res.status(500).send(err.message);
      } else {
        res.json(result);
      }
    }
  );
});

app.get("/api/diving/recup/:localisation/:date/:duree/:deep", (req, res) => {
  const localisation = req.params.localisation;
  const date = req.params.date;
  const duree = req.params.duree;
  const deep = req.params.deep;
  connection.query(
    "SELECT * FROM diving WHERE localisation = ? AND date_diving = ? AND duration = ? AND deep = ?",
    [localisation, date, duree, deep],
    (err, result) => {
      if (err) {
        res.status(500).send(err.message);
      } else {
        res.json(result);
      }
    }
  );
});

app.post("/api/diving", (req, res) => {
  const formData = req.body;
  connection.query("INSERT INTO diving SET ?", formData, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send(err.message);
    } else {
      res.sendStatus(200);
    }
  });
});

// BELONG_TO
app.post("/api/belong-to", (req, res) => {
  const formData = req.body;
  connection.query("INSERT INTO belong_to SET ?", formData, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send(err.message);
    } else {
      res.sendStatus(200);
    }
  });
});

// GET ALL DIVES OF A DIVER
app.get("/api/divers/:idDiver/dives", (req, res) => {
  const idDiver = req.params.idDiver;
  connection.query(
    "SELECT dr.id_diver, bg.diver_id, bg.diving_id,  DATE_FORMAT(dg.date_diving, '%d/%m/%Y') AS date, dg.hour_diving, dg.deep, dg.duration, dg.gas, dg.localisation FROM diver AS dr JOIN belong_to AS bg ON dr.id_diver=bg.diver_id JOIN diving AS dg ON dg.id_diving=bg.diving_id WHERE id_diver = ? ORDER BY Date DESC",
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

//SERVER LISTENING
app.listen(port, (err) => {
  if (err) {
    throw new Error("Something bad happened...");
  }
  console.log(`Server is listening on ${port}`);
});
