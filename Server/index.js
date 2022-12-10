const express = require("express");
const port = 8080;
const app = express();
const mysql = require("mysql");
require("dotenv").config();

app.use(express.json());

const connection = mysql.createConnection({
  host: `${process.env.MYSQL_HOST}`,
  user: `${process.env.MYSQL_USER}`,
  password: `${process.env.MYSQL_PASSWORD}`,
  database: `${process.env.MYSQL_DATABASE}`,
});

connection.connect((error) => {
  if (error) throw error;
  console.log("mysql connected");
});

app.get("/", (req, res) => {
  connection.query(
    "select * from vulpisconcept_english_words.chapter",
    (err, result) => {
      res.send(result);
    }
  );
});

app.listen(port, () => {
  console.log(port + " listening");
});
