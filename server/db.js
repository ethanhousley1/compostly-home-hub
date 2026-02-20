import pg from "pg";

const { Pool } = pg;

let pool;

export function getPool() {
  if (!pool) {
    pool = new Pool({
      host: process.env.PGHOST || "localhost",
      port: Number(process.env.PGPORT) || 5432,
      database: process.env.PGDATABASE || "compostly",
      user: process.env.PGUSER || "postgres",
      password: process.env.PGPASSWORD,
    });
  }
  return pool;
}
