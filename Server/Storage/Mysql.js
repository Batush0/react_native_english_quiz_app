const e = require("express");

require("dotenv").config();
class Mysql {
  constructor() {
    this.connection = null;
    this.#connect();
    // this.#sanitizateQuery = require("../utils/sanitizateQuery");
  }
  #connect() {
    this.connection = require("mysql2").createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      multipleStatements: true,
    });

    this.connection.connect((e) => {
      if (e) throw e;
      console.log(`database 'MYSQL' connected ⛓️⛓️`);
    });
  }
  #sanitizateQuery(query) {
    return query
      .toString()
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/'/g, "&#39;")
      .replace(/"/g, "&#34;");
  }
  register(userData) {
    return new Promise((resolve, reject) => {
      try {
        this.connection.query(
          `select count(*) as count from user.user where username='${this.#sanitizateQuery(
            userData.username
          )}'`,
          (error, result) => {
            if (error) throw error;
            if (result[0].count > 0)
              return reject({ cause: "kullanıcı adı kullanımda" });
            this.connection.query(
              `insert into user.user(username,password) values('${this.#sanitizateQuery(
                userData.username
              )}','${userData.encodedPassword}');
              insert into user.token(id,secret_access_token,secret_refresh_token,refresh_token) values(
                (select id from user.user where username='${this.#sanitizateQuery(
                  userData.username
                )}' limit 1),
                    '${this.#sanitizateQuery(userData.secret_access_token)}',
                    '${this.#sanitizateQuery(userData.secret_refresh_token)}',
                    '${this.#sanitizateQuery(userData.refresh_token)}'
              )`,
              (error) => {
                if (error) throw error;
                resolve();
              }
            );
          }
        );
      } catch (error) {
        reject();
      }
    });
  }
  login(userData) {
    return new Promise((resolve, reject) => {
      try {
        this.connection.query(
          `select password ,id from user.user where username='${this.#sanitizateQuery(
            userData.username
          )}'`,
          (error, result) => {
            if (!result[0])
              return reject({
                cause: `${userData.username} kullanıcı kaydı bulunmamakta`,
              });
            this.connection.query(
              `select secret_refresh_token,secret_access_token from user.token where id = ${result[0].id}`,
              (e, _result) => {
                resolve({
                  password: result[0].password,
                  username: result[0].username,
                  secret_access_token: _result[0].secret_access_token,
                  secret_refresh_token: _result[0].secret_refresh_token,
                  id: result[0].id,
                });
              }
            );
          }
        );
      } catch (error) {
        reject();
      }
    });
  }

  keepRefreshToken(refresh_token, id) {
    this.connection.query(
      `update user.token set refresh_token = '${refresh_token}' where id =${id};`
    );
  }

  logout(id) {
    return new Promise((resolve) => {
      this.connection.query(
        `update user.token set refresh_token = '' where id= ${id}`,
        (error) => {
          resolve();
        }
      );
    });
  }

  authenticateToken(username) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `select secret_access_token ,id from user.token where id=(select id from user.user where username='${this.#sanitizateQuery(
          username
        )}' limit 1)`,
        (e, result) => {
          if (result.length == 0) return reject({ cause: "sen kimsin !?" });
          resolve(result[0]);
        }
      );
    });
  }
  getSecretTokens(refresh_token) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `select secret_refresh_token ,secret_access_token ,id from user.token where refresh_token = '${this.#sanitizateQuery(
          refresh_token
        )}'`,
        (e, result) => {
          if (!result[0]) return reject();
          this.connection.query(
            `select username from user.user where id = ${result[0].id}`,
            (er, _result) => {
              resolve({
                secret_refresh_token: result[0].secret_refresh_token,
                username: _result[0].username,
                secret_access_token: result[0].secret_access_token,
              });
            }
          );
        }
      );
    });
  }

  languages = ["english"];

  getLanguages() {
    return this.languages;
  }

  getChapters(language, user_id) {
    return new Promise((resolve, reject) => {
      if (!this.languages.includes(language))
        return reject({ cause: `${language} mevcut bir dil seçeneği değil` });
      //chapter isimlerini alma
      this.connection.query(
        `select chapter_ad , chapter_id from ${language}.chapter`,
        (error, result) => {
          var sablon = "select";
          result.forEach((element, index) => {
            sablon += `${
              index == 0 ? "" : ","
            }(select count(*) from english.sorular where fchapter_id = ${
              element.chapter_id
            }) as q${index}`;
            sablon += `,(select count(*) from english.solves where user_id=${user_id} and  accuracy = 1 and question_id in (select soru_id from ${language}.sorular where fchapter_id = ${element.chapter_id})) as a${index}`;
          });
          this.connection.query(sablon, (e, resultCounting) => {
            result.forEach((element, index) => {
              result[index]["accuracy"] = resultCounting[0]["a" + index];
              result[index]["questionCount"] = resultCounting[0]["q" + index];
            });

            resolve(result);
          });
        }
      );
    });
  }

  getQuestions(language, chapter_id, on, user_id) {
    const questionCount = 300;
    return new Promise((resolve, reject) => {
      try {
        if (!this.languages.includes(language))
          return reject({ cause: `${language} mevcut bir dil seçeneği değil` });

        //on (en son talep edilen soru id'si) üzerinden 60 adet soru bilgisi isteme
        this.connection.query(
          `select soru_id from ${language}.sorular where fchapter_id = ${chapter_id} and soru_id > ${this.#sanitizateQuery(
            on
          )} limit ${questionCount}`,
          (error, result) => {
            if (!result) return reject({ cause: "naptın sen !?" });
            if (result.length <= 4) return reject({ cause: 204 });

            //kullanıcının çözdüğü soruları alma
            this.connection.query(
              `select question_id from ${language}.solves where user_id=${user_id} and  question_id < ${
                result[result.length - 1].soru_id
              } and question_id >= ${
                result[0].soru_id
              } and accuracy = 1 and question_id in (select soru_id from ${language}.sorular where fchapter_id = ${chapter_id})`,
              (errorSolves, resultSolves) => {
                var bundle = [];

                //çözülen soruların başarısını ekleme
                result.forEach((solves) => {
                  var bundleData = {
                    id: solves.soru_id,
                    accuracy: resultSolves.filter(
                      (_slv) => _slv.question_id == solves.soru_id
                    )[0]
                      ? true
                      : false,
                  };
                  bundle.push(bundleData);
                });
                resolve(bundle);
              }
            );
          }
        );
      } catch (error) {
        reject();
      }
    });
  }
  quiz(language, chapter, on, related) {
    const compareEquality = related ? ">" : ">=";
    return new Promise((resolve, reject) => {
      try {
        if (!this.languages.includes(language))
          return reject({ cause: `${language} mevcut bir dil seçeneği değil` });

        //5 adet soru alma
        this.connection.query(
          `select * from ${language}.sorular where fchapter_id = ${chapter} and soru_id ${compareEquality}
          ${this.#sanitizateQuery(on)} limit 5`,
          (error_q, result_q) => {
            if (!result_q || result_q.length < 5) return reject({ cause: 204 });

            //malesef ki cevapları doğru (chapter lara uygun) alabilmek için payload hazırlamak
            var selectPayload = "select ";
            result_q.forEach((question, index) => {
              selectPayload += `${
                index == 0 ? "" : ","
              }(select cevap from ${language}.cevaplar where cevap_id = ${
                question.soru_id
              }) as '${index}'`;
            });

            //alınan soruların cevaplarını alma
            this.connection.query(selectPayload, (error_a, result_a) => {
              const response = {
                questions: result_q.map(
                  (q, i) =>
                    q.soru.toLowerCase().split(result_a[0][i].toLowerCase()) //cevabı bulunduran parçadan bölünür
                ),
                answers: [],
                to: result_q[result_q.length - 1].soru_id,
                question_numbers: result_q.map((q) => q.soru_no),
              };

              //dev only
              console.log("-----------");
              console.log("answers", result_a[0]);
              console.log("questions", result_q);
              console.log("related", related, "\n\n\n");
              console.log("-----------\n");

              //rastgeleliği sağlama
              const usedQuesues = [];
              while (result_q.length !== response.answers.length) {
                const randomAnswerQueue = Math.floor(
                  Math.random() * result_q.length
                );
                if (usedQuesues.indexOf(randomAnswerQueue) !== -1) continue;
                response.answers.push(result_a[0][randomAnswerQueue]);

                console.log(result_a[0][randomAnswerQueue]);
                usedQuesues.push(randomAnswerQueue);
              }

              resolve(response);
            });
          }
        );
      } catch (error) {
        reject();
      }
    });
  }

  getAnswers(language, on, related) {
    const compareEquality = related ? ">" : ">=";
    return new Promise((resolve, reject) => {
      if (!this.languages.includes(language))
        return reject({ cause: `${language} mevcut bir dil seçeneği değil` });

      this.connection.query(
        `select * from ${language}.sorular where fchapter_id = (select fchapter_id from ${language}.sorular where soru_id = ${on}) and soru_id ${compareEquality}
          ${this.#sanitizateQuery(on)} limit 5`,
        (error_q, result_q) => {
          if (!result_q || result_q.length < 5) return reject({ cause: 204 });

          //malesef ki cevapları doğru (chapter lara uygun) alabilmek için payload hazırlamak
          var selectPayload = "select ";
          result_q.forEach((question, index) => {
            selectPayload += `${
              index == 0 ? "" : ","
            }(select cevap from ${language}.cevaplar where cevap_id = ${
              question.soru_id
            }) as '${question.soru_id}'`;
          });

          //alınan soruların cevaplarını alma
          this.connection.query(selectPayload, (error_a, result_a) => {
            console.log("\n---------------");
            console.log("result", result_a);
            resolve(result_a);
          });
        }
      );
    });
  }

  logAnswerSolidition(accuracy, user_id, question_id, language) {
    return new Promise((resolve) => {
      this.connection.query(
        //count(*) as count
        `select * from ${language}.solves where user_id = ${user_id} and question_id = ${question_id}`,
        (error, result) => {
          //console.log(result);
          //update
          if (result[0]) {
            //.count == 1
            console.log(question_id, "updated");
            return this.connection.query(
              `update ${language}.solves set accuracy = ${accuracy} where user_id = ${user_id} and question_id = ${question_id}`
            );
          }
          //insert
          console.log(question_id, " inserted");
          this.connection.query(
            `insert into ${language}.solves(user_id,question_id,accuracy) values(${user_id},${question_id},${accuracy})`
          );
          resolve();
        }
      );
    });
  }
  /**
  getSolves(username, language, on) {
    return new Promise((resolve, reject) => {
      if (!this.languages.includes(language))
        return reject({ cause: `${language} mevcut bir dil seçeneği değil` });

      this.connection.query(
        `select accuracy from ${language}.solves where user_id = (select id from user.user where username='${username}' limit 1) and question_id > ${this.#sanitizateQuery(
          on
        )} limit 5`,
        (e, result) => {
          resolve(result);
        }
      );
    });
  }
   */
}

module.exports = new Mysql();
