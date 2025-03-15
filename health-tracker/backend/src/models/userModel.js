const pool = require("../config/db");

const createUser = async (username, email, hashedPassword) => {
  return pool.query(
    "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
    [username, email, hashedPassword]
  );
};

const getUserByEmail = async (email) => {
  return pool.query("SELECT * FROM users WHERE email = $1", [email]);
};

module.exports = { createUser, getUserByEmail };
