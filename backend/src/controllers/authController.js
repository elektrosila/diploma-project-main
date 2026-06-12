const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

exports.register = async (req, res) => {
  console.log(">> POST /api/auth/register, body:", req.body);
  const { username, email, password } = req.body;
  try {
    const exists = await pool.query(
      "SELECT id FROM users WHERE email=$1 OR username=$2",
      [email, username]
    );
    console.log(">> exists.rows.length =", exists.rows.length);

    if (exists.rows.length) {
      console.log(">> Registration failed: email/username taken");
      return res.status(400).json({ message: "Email или имя занято" });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (username, email, password_hash)
       VALUES ($1, $2, $3) RETURNING id, username, email`,
      [username, email, password_hash]
    );
    console.log(">> New user inserted:", result.rows[0]);
    const token = jwt.sign({ userId: result.rows[0].id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({ user: result.rows[0], token });
  } catch (err) {
    console.error(">> Registration error on server:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (!result.rows.length) {
      return res.status(400).json({ message: "Неверный email или пароль" });
    }
    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(400).json({ message: "Неверный email или пароль" });
    }
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({
      user: { id: user.id, username: user.username, email: user.email },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, username, email, created_at FROM users WHERE id = $1",
      [req.userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};
