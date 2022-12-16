const express = require("express");
const port = 8080;
const app = express();
const jwt = require("jsonwebtoken");

const database = require("./Storage/Mysql");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("selam");
});

function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; //access token
    if (token == null) return res.sendStatus(401);
    const { username } = req.query;
    if (username === undefined) return res.sendStatus(406);

    database
      .authenticateToken(username)
      .then(({ secret_access_token, id }) => {
        jwt.verify(token, secret_access_token, (err, user) => {
          if (err) return res.sendStatus(403);
          user["id"] = id;
          req.user = user;
          next();
        });
      })
      .catch((error) => {
        res.send(error);
      });
  } catch (error) {
    res.sendStatus(400);
  }
}

app.get("/languages", authenticateToken, (req, res) => {
  res.send(database.getLanguages());
});

app.get("/chapters", authenticateToken, (req, res) => {
  database
    .getChapters(req.query.language)
    .then((chapters) => {
      res.json(chapters);
    })
    .catch((error) => {
      if (error.cause) return res.send(error.cause);
      res.sendStatus(400);
    });
});

app.get("/questions", authenticateToken, (req, res) => {
  try {
    const { language, chapter, on } = req.query;

    database
      .getQuestions(language, chapter, on, req.user.username)
      .then((bundle) => res.json(bundle))
      .catch((error) => {
        if (error.cause) return res.send(error.cause);
        res.sendStatus(400);
      });
  } catch (error) {
    res.sendStatus(400);
  }
});

app.get("/quiz", authenticateToken, (req, res) => {
  const { language, chapter, on } = req.query;
  if (on == undefined) return res.sendStatus(406);
  database
    .quiz(language, chapter, on)
    .then((payload) => res.json(payload))
    .catch((error) => {
      if (error.cause) return res.send(error.cause);
      res.sendStatus(400);
    });
});

app.post("/check", authenticateToken, (req, res) => {
  const { language, on } = req.query;
  const { answers } = req.body;
  if (on == undefined || answers == undefined) return res.sendStatus(406);

  try {
    database
      .getAnswers(language, on)
      .then((actualAnswers) => {
        actualAnswers.forEach((actual, index) => {
          const accuracy = answers[index] === actual.cevap.toLowerCase();
          database.logAnswerSolidition(
            accuracy,
            req.user.username,
            actual.cevap_id,
            language
          );
        });
        res.sendStatus(202);
      })
      .catch((error) => {
        if (error.cause) res.send(error.cause);
      });
  } catch (e) {
    res.sendStatus(400);
  }
});

app.get("/soliditions", authenticateToken, (req, res) => {
  const { language, on } = req.query;
  if (on == undefined) res.sendStatus(406);
  database
    .getSolves(req.user.username, language, on)
    .then((data) => {
      res.json({ solves: data });
    })
    .catch((error) => {
      if (error.cause) res.send(error.cause);
    });
});

app.listen(port, () => {
  console.log("Port " + port + " on fire 🔥🔥");
});
