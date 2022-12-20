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
    .getChapters(req.query.language, req.user.id)
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
    if (!on) return res.sendStatus(406);

    database
      .getQuestions(language, chapter, on, req.user.id) //a1
      .then((bundle) => {
        res.json({ bundle: bundle });
      })
      .catch((error) => {
        if (error) return res.send(error);
        res.sendStatus(400);
      });
  } catch (error) {
    res.sendStatus(400);
  }
});

app.get("/quiz", authenticateToken, (req, res) => {
  const { language, chapter, on, related } = req.query;
  if (on == undefined) return res.sendStatus(406);
  database
    .quiz(language, chapter, on, related)
    .then((payload) => res.json(payload))
    .catch((error) => {
      if (error.cause) return res.send(error);
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
        var accuracyArray = [];
        actualAnswers.forEach((actual, index) => {
          const accuracy = answers[index] === actual.cevap.toLowerCase();
          accuracyArray.push(accuracy);
          database.logAnswerSolidition(
            accuracy,
            req.user.id,
            actual.cevap_id,
            language
          );
        });

        // res.sendStatus(202);
        const accuracy = accuracyArray.indexOf(false) == -1;
        res.json({
          accuracy: accuracy,
          lastIndex: actualAnswers[actualAnswers.length - 1].cevap_id,
        });
      })
      .catch((error) => {
        if (error.cause) res.json(error);
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
