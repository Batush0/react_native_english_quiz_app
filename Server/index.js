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
  res.send("selam");
});

app.get("/chapter", (req, res) => {
  if (req.query.id === undefined) return res.sendStatus(406);
  connection.query(
    `select soru_no from sorular where fchapter_id = ${req.query.id}`,
    (e, result) => {
      if (!result.length) return res.sendStatus(204);
      res.json(result);
    }
  );
});
app.get("/chapters", (req, res) => {
  connection.query(`select * from chapter`, (e, result) => {
    res.json(result);
  });
});

const numOfchoice = 4;

app.get("/question", (req, res) => {
  if (req.query.chapter_id === undefined || req.query.question_id === undefined)
    res.sendStatus(406);

  //soruyu seçme
  connection.query(
    `select soru,soru_id from sorular where fchapter_id = ${req.query.chapter_id} and  soru_id = ${req.query.question_id}`,
    (e, result) => {
      if (!result.length) return res.sendStatus(204);

      //asıl cevabı seçme
      connection.query(
        `select cevap from cevaplar where fsoru_id = ${result[0].soru_id}`,
        (error, _result) => {
          if (!_result.length) return res.sendStatus(204);

          //tüm soruları alma
          connection.query(
            `select cevap from cevaplar where fsoru_id <> ${result[0].soru_id}`,
            (er, result_) => {
              //asıl cevabı cevapların arasına kaynaştırma
              const actualAnswerQueue = Math.floor(Math.random() * numOfchoice);
              var answers = [];

              //rastgele cevaplar seçme
              for (i = 0; i < numOfchoice; i++) {
                if (i == actualAnswerQueue) {
                  answers.push(_result[0].cevap);
                  continue;
                }
                const selected_id = Math.floor(Math.random() * result_.length);
                const selected_answer = result_[selected_id].cevap;
                if (answers.includes(selected_answer)) {
                  i--;
                  continue;
                }
                answers.push(selected_answer);
              }
              const question = result[0].soru.split(`${_result[0].cevap}`);
              res.json({
                question: question,
                choices: answers,
              });
            }
          );
        }
      );
    }
  );
});

app.patch("/checkAnswer", (req, res) => {
  if (
    req.query.chapter_id === undefined ||
    req.query.question_id === undefined ||
    req.query.choice === undefined
  )
    res.sendStatus(406);

  connection.query(
    `select cevap from cevaplar where cevap_id = ${req.query.question_id}`,
    (e, result) => {
      if (!result.length) return res.sendStatus(204);
      if (result[0].cevap != req.query.choice) return res.send({ state: 0 }); //incorrect
      res.send({ state: 1 }); //correct
      //TODO: sonuçları saklama
    }
  );
});

app.listen(port, () => {
  console.log(port + " listening");
});
