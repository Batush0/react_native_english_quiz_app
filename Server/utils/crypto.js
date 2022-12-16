const crypto = require("crypto");
const argon2 = require("argon2");

const verifyAuthentication = async (pw, hash) => {
  return await argon2.verify(hash, pw, {
    parallelism: 1,
    memoryCost: 64000,
    timeCost: 3,
  });
};

const encodePassword = async (password) => {
  const salt = crypto.randomBytes(16);
  return await argon2.hash(password, {
    parallelism: 1,
    memoryCost: 64000, // 64 mb
    timeCost: 3,
    salt,
  });
};

module.exports = {
  verifyAuthentication,
  encodePassword,
};
