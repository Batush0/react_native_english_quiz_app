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
      var payload = [];
      this.connection.query(
        `select chapter_ad , chapter_id from ${language}.chapter`,
        (error, result) => {
          resolve(result);
          /**
          result.forEach((chapter, index) => {
            // for (var index = 0; index < result.length; index++) {
            // const chapter = result[index];
            //bölüm başına total soru sayısını bulma
            this.connection.query(
              `select count(*) as count from ${language}.sorular where fchapter_id = ${chapter.chapter_id}`,
              (e, resultQCount) => {
                
                //TODO : burada hata var =>> 

                //kullanıcının bölüm başına başarısını bulma
                this.connection.query(
                  `select count(*)*${
                    resultQCount[0].count / 10000
                  } as accuracy from ${language}.solves where user_id=${user_id} and  accuracy = 1 and question_id in (select soru_no from ${language}.sorular where fchapter_id = ${
                    chapter.chapter_id
                  })`,
                  (_e, resultAccuracy) => {
                    console.log(resultAccuracy);
                    payload.push({
                      accuracy: resultAccuracy[0].accuracy,
                      chapter: chapter.chapter_ad,
                    });
                    // if (index == result.length - 1) resolve(payload);
                  }
                );
              }
              
            );
            //bölüm başına total soru sayısını bulma
            /**
                this.connection.query(
                  `select count(*) as count from ${language}.sorular where fchapter_id = ${chapter.chapter_id}`,
                  (e, resultQCount) => {
                    //hesaplama
                    const accuracy =
                      resultAccuracy[0].count * (resultQCount[0].count / 100);
                    payload.push({
                      accuracy: accuracy,
                      chapter_ad: chapter.chapter_ad,
                    });
                    // console.log(result.length, index);
                    if (index == result.length - 1) resolve(payload);
                  }
                );
                
              });
              */
        }
      );
    });
  }

  getQuestions(language, chapter_id, on, username) {
    const questionCount = 180;
    return new Promise((resolve, reject) => {
      try {
        if (!this.languages.includes(language))
          return reject({ cause: `${language} mevcut bir dil seçeneği değil` });

        //on (en son talep edilen soru id'si) üzerinden 60 adet soru bilgisi isteme
        this.connection.query(
          `select soru_id from ${language}.sorular fchapter_id where fchapter_id = ${chapter_id} and soru_id > ${this.#sanitizateQuery(
            on
          )} limit ${questionCount}`,
          (error, result) => {
            if (!result) return reject({ cause: "naptın sen !?" });
            if (result.length <= 4)
              return reject({ cause: "daha fazla soru bulunmamakta" });

            /**
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
            ); */
            var bundle = [];
            result.forEach((question) => {
              bundle.push({ id: question.soru_id });
            });
            resolve(bundle);
          }
        );
      } catch (error) {
        reject();
      }
    });
  }
  quiz(language, chapter, on, related) {
    return new Promise((resolve, reject) => {
      try {
        if (!this.languages.includes(language))
          return reject({ cause: `${language} mevcut bir dil seçeneği değil` });

        //5 adet soru alma
        this.connection.query(
          `select * from ${language}.sorular where fchapter_id = ${chapter} and soru_id ${
            related ? ">" : ">="
          }
          ${this.#sanitizateQuery(on)} limit 5`,
          (error_q, result_q) => {
            if (!result_q.length)
              return reject({ cause: "bir problem oluştu , sonra dene " });

            //alınan soruların cevaplarını alma
            this.connection.query(
              `select * from ${language}.cevaplar where cevap_id 
              ${related ? ">" : ">="} ${this.#sanitizateQuery(on)} limit 5`,
              (error_a, result_a) => {
                const response = {
                  questions: result_q.map(
                    (q, i) => q.soru.toLowerCase().split(result_a[i].cevap) //cevabı bulunduran parça ayrıştırılır
                  ),
                  answers: [],
                  on: result_q[0].soru_id,
                };

                //
                console.log("-----------");
                console.log("answers", result_a);
                console.log("related", related, "\n\n\n");

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
        `select cevap,cevap_id from ${language}.cevaplar where cevap_id 
        >
         ${this.#sanitizateQuery(on)} limit 5`,
        (error, result) => {
          console.log("---------------");
          console.log("result", result);
          resolve(result);
        }
      );
    });
  }

  logAnswerSolidition(accuracy, user_id, id, language) {
    return new Promise((resolve) => {
      this.connection.query(
        `select count(*) as count from ${language}.solves where user_id = ${user_id} and question_id = ${id}`,
        (error, result) => {
          //update
          if (result[0].count == 1) {
            return this.connection.query(
              `update ${language}.solves set accuracy = ${accuracy} where user_id = ${user_id} and question_id = ${id}`
            );
          }
          //insert
          this.connection.query(
            `insert into ${language}.solves(user_id,question_id,accuracy) values(${user_id},${id},${accuracy})`
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
