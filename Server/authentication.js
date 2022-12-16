const port = 8081;
const express = require("express");
const app = express();
app.use(express.json());
const { verifyAuthentication, encodePassword } = require("./utils/crypto");
const jwt = require("jsonwebtoken");
const database = require("./Storage/Mysql");
const crypto = require("crypto");

function generateAccessToken(user, secret_access_token) {
  return jwt.sign(user, secret_access_token, {
    expiresIn: "5m",
  });
}

app.put("/register", async (req, res) => {
  try {
    //some conditions
    const { username, password } = req.query;
    if (username === null || password === null) return res.sendStatus(406);
    if (password.length < 8) return res.sendStatus(406);

    //token generation
    const secret_access_token = crypto.randomBytes(64).toString("hex");
    const secret_refresh_token = crypto.randomBytes(64).toString("hex");
    const user = {
      username: username,
    };
    const refresh_token = jwt.sign(user, secret_refresh_token);

    //encoding user's password
    const encodedPassword = await encodePassword(password);

    //storing user
    database
      .register({
        username,
        encodedPassword,
        secret_access_token,
        secret_refresh_token,
        refresh_token,
      })
      .then(() => {
        res.send({
          access_token: generateAccessToken(user, secret_access_token),
          refresh_token: refresh_token,
        });
      })
      .catch((error) => {
        if (error.cause) return res.send(error.cause);
        res.sendStatus(400);
      });
  } catch (error) {
    res.sendStatus(400);
  }
});

app.patch("/login", (req, res) => {
  try {
    //some conditions
    const { username, password } = req.query;
    if (username === undefined || password === undefined)
      return res.sendStatus(406);

    database
      .login({ username })
      .then(async (data) => {
        if (!(await verifyAuthentication(password, data.password)))
          return res.sendStatus(401);
        const user = { username: data.username };
        const accessToken = generateAccessToken(user, data.secret_access_token);
        const refresh_token = jwt.sign(user, data.secret_refresh_token);
        database.keepRefreshToken(refresh_token, data.id);
        res.send({
          access_token: accessToken,
          refresh_token: refresh_token,
        });
      })
      .catch((error) => {
        if (error.cause) return res.send({ cause: error.cause });
        res.sendStatus(400);
        console.log(error);
      });
  } catch (error) {
    res.sendStatus(400);
  }
});

app.delete("/logout", authenticateToken, (req, res) => {
  database
    .logout(req.user.id)
    .then(() => {
      res.sendStatus(202);
    })
    .catch(() => {
      res.sendStatus(400);
    });
});

app.patch("/token", (req, res) => {
  const { refresh_token } = req.body;
  if (refresh_token === undefined) return res.sendStatus(401);
  database
    .getSecretTokens(refresh_token)
    .then((tokenData) => {
      jwt.verify(refresh_token, tokenData.secret_refresh_token, (err, user) => {
        if (err) return res.sendStatus(403);
        const access_token = generateAccessToken(
          { username: tokenData.username },
          tokenData.secret_access_token
        );
        res.send({ access_token: access_token });
      });
    })
    .catch(() => {
      return res.send(403);
    });
});

function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; //access token
    if (token == null) return res.sendStatus(401);
    const { username } = req.body;
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

app.listen(port, () => {
  console.log(`port ${port} listening 🎧`);
});
