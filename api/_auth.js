import bcrypt from "bcrypt";

export function parseBody(req) {
  return typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
}

export function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

export function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export function userPayload(row) {
  return {
    user_id: row.user_id,
    first_name: row.first_name,
    last_name: row.last_name,
    email: row.email,
    address: row.address,
    pickup_or_dropoff: row.pickup_or_dropoff,
  };
}
