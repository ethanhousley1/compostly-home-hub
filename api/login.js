import { getPool } from "./_db.js";
import { parseBody, comparePassword, userPayload } from "./_auth.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method not allowed." });
  }

  const { email, password } = parseBody(req);

  if (!email?.trim() || !password) {
    return res.status(400).json({
      message: "Email and password are required.",
    });
  }

  try {
    const pool = getPool();

    const result = await pool.query(
      `SELECT user_id, first_name, last_name, email, password, address, pickup_or_dropoff
       FROM user_account
       WHERE email = $1`,
      [email.trim().toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const user = result.rows[0];
    const passwordMatch = await comparePassword(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    return res.json({ user: userPayload(user) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unable to sign in." });
  }
}
