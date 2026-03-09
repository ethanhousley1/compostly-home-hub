import { Router } from "express";
import bcrypt from "bcrypt";
import { getPool } from "../db.js";

const router = Router();

router.post("/signup", async (req, res) => {
  const pool = getPool();
  const { firstName, lastName, email, password } = req.body || {};

  if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !password) {
    return res.status(400).json({
      message: "First name, last name, email, and password are required.",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters.",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO user_account (first_name, last_name, email, password)
       VALUES ($1, $2, $3, $4)
       RETURNING user_id, first_name, last_name, email`,
      [firstName.trim(), lastName.trim(), email.trim().toLowerCase(), hashedPassword]
    );

    const row = result.rows[0];
    const user = {
      user_id: row.user_id,
      first_name: row.first_name,
      last_name: row.last_name,
      email: row.email,
    };

    res.status(201).json({ user });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ message: "An account with this email already exists." });
    }
    console.error(err);
    res.status(500).json({ message: "Unable to create account. Please try again." });
  }
});

router.post("/login", async (req, res) => {
  const pool = getPool();
  const { email, password } = req.body || {};

  if (!email?.trim() || !password) {
    return res.status(400).json({
      message: "Email and password are required.",
    });
  }

  try {
    const result = await pool.query(
      `SELECT user_id, first_name, last_name, email, password
       FROM user_account
       WHERE email = $1`,
      [email.trim().toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const user = result.rows[0];

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    res.json({
      user: {
        user_id: user.user_id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        address: null,
        pickup_or_dropoff: null
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Unable to sign in." });
  }
});

export { router as signupRouter };
