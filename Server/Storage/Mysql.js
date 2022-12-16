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

  getChapters(language) {
    return new Promise((resolve, reject) => {
      if (!this.languages.includes(language))
        return reject({ cause: `${language} mevcut bir dil seçeneği değil` });
      this.connection.query(
        `select chapter_ad from ${language}.chapter`,
        (error, result) => {
          resolve(result);
        }
      );
    });
  }

  getQuestions(language, chapter, on, username) {
    return new Promise((resolve, reject) => {
      try {
        if (!this.languages.includes(language))
          return reject({ cause: `${language} mevcut bir dil seçeneği değil` });

        //on (en son talep edilen soru id'si) üzerinden 60 adet soru bilgisi isteme
        this.connection.query(
          `select soru_id from ${language}.sorular fchapter_id where fchapter_id = (select chapter_id from ${language}.chapter where chapter_ad='${chapter}' limit 1) and soru_id > ${this.#sanitizateQuery(
            on
          )} limit 60`,
          (error, result) => {
            if (!result) return reject({ cause: "naptın sen !?" });

            //kullanıcının çözdüğü soruları alma
            this.connection.query(
              `select question_id, accuracy from ${language}.solves where user_id=(select id from user.user where username='${username}' limit 1) and  question_id < ${
                result[result.length - 1].soru_id
              } and question_id > ${result[0].soru_id}`,
              (errorSolves, resultSolves) => {
                var bundle = [];

                //çözülen soruların başarısını ekleme
                result.forEach((solves) => {
                  var bundleData = { id: solves.soru_id, accuracy: null };
                  const matchedSolve = resultSolves.filter(
                    (_solves) => _solves.question_id == solves.soru_id
                  );
                  if (matchedSolve.length)
                    bundleData.accuracy = matchedSolve[0].accuracy;
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
  quiz(language, chapter, on) {
    return new Promise((resolve, reject) => {
      try {
        if (!this.languages.includes(language))
          return reject({ cause: `${language} mevcut bir dil seçeneği değil` });

        //5 adet soru alma
        this.connection.query(
          `select * from ${language}.sorular where fchapter_id = (select chapter_id from ${language}.chapter where chapter_ad = '${this.#sanitizateQuery(
            chapter
          )}' limit 1) and soru_id > ${this.#sanitizateQuery(on)} limit 5`,
          (error_q, result_q) => {
            if (!result_q)
              return reject({ cause: "bir problem oluştu , sonra dene " });

            //alınan soruların cevaplarını alma
            this.connection.query(
              `select * from ${language}.cevaplar where cevap_id > ${this.#sanitizateQuery(
                on
              )} limit 5`,
              (error_a, result_a) => {
                const response = {
                  questions: result_q.map(
                    (q, i) => q.soru.toLowerCase().split(result_a[i].cevap) //cevabı bulunduran parça ayrıştırılır
                  ),
                  answers: [],
                };

                //rastgeleliği sağlama
                const length = result_a.length;
                for (var i = 0; i < length; i++) {
                  const randomAnswerQueue = Math.floor(
                    Math.random() * result_a.length
                  );
                  response.answers.push(
                    result_a[randomAnswerQueue].cevap.toLowerCase()
                  );
                  result_a.splice(randomAnswerQueue, 1);
                }

                resolve(response);
              }
            );
          }
        );
      } catch (error) {
        reject();
      }
    });
  }

  getAnswers(language, on) {
    return new Promise((resolve, reject) => {
      if (!this.languages.includes(language))
        return reject({ cause: `${language} mevcut bir dil seçeneği değil` });

      this.connection.query(
        `select cevap,cevap_id from ${language}.cevaplar where cevap_id > ${this.#sanitizateQuery(
          on
        )} limit 5`,
        (error, result) => {
          resolve(result);
        }
      );
    });
  }

  logAnswerSolidition(accuracy, username, id, language) {
    return new Promise((resolve) => {
      this.connection.query(
        `select count(*) as count from ${language}.solves where user_id = (select id from user.user where username='${username}' limit 1) and question_id = ${id}`,
        (error, result) => {
          //update
          if ((result[0].count = 1)) {
            return this.connection.query(
              `update ${language}.solves set accuracy = ${accuracy} where user_id = (select id from user.user where username='${username}' limit 1) and question_id = ${id}`
            );
          }
          //insert
          this.connection.query(
            `insert into ${language}.solves(user_id,question_id,accuracy) values((select id from user.user where username='${username}' limit 1),${id},${accuracy})`
          );
          resolve();
        }
      );
    });
  }
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
}

module.exports = new Mysql();
