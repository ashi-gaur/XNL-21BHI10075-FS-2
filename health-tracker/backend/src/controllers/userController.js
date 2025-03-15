const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createUser, getUserByEmail } = require("../models/userModel");

exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser(username, email, hashedPassword);
    res.json(newUser.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "User registration failed" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await getUserByEmail(email);
    if (user.rows.length === 0) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, user: user.rows[0] });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
};
