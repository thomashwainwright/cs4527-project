import { Pool } from "pg";

export const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "workload_manager",
  password: "password",
  port: 5432,
});
