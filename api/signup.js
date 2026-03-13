import { getPool } from "./_db.js";
import { parseBody, hashPassword, userPayload } from "./_auth.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method not allowed." });
  }

  const { firstName, lastName, email, password, address, pickupOrDropoff } =
    parseBody(req);

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
    const hashedPassword = await hashPassword(password);
    const pool = getPool();

    const result = await pool.query(
      `INSERT INTO user_account (first_name, last_name, email, password, address, pickup_or_dropoff)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING user_id, first_name, last_name, email, address, pickup_or_dropoff`,
      [
        firstName.trim(),
        lastName.trim(),
        email.trim().toLowerCase(),
        hashedPassword,
        address?.trim() || null,
        pickupOrDropoff?.trim() || null,
      ]
    );

    return res.status(201).json({ user: userPayload(result.rows[0]) });
  } catch (err) {
    if (err.code === "23505") {
      return res
        .status(409)
        .json({ message: "An account with this email already exists." });
    }
    console.error(err);
    return res
      .status(500)
      .json({ message: "Unable to create account. Please try again." });
  }
}
