import pool from "../database.js"

export const findUserByUsername = async (username) => {
  const result = await pool.query("SELECT * FROM users WHERE username = $1", [
    username,
  ])
  return result.rows[0] || null
}

export const ensureUsersTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(255) PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      role VARCHAR(50) NOT NULL,
      password TEXT NOT NULL,
      password_last_changed TIMESTAMP NOT NULL,
      password_expired BOOLEAN NOT NULL
    )
  `)
}

export const createUser = async (user) => {
  const {
    id,
    username,
    email,
    role,
    password,
    passwordLastChanged,
    passwordExpired,
  } = user

  // Ensure table exists before inserting
  await ensureUsersTable()

  await pool.query(
    `INSERT INTO users (id, username, email, role, password, password_last_changed, password_expired)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [id, username, email, role, password, passwordLastChanged, passwordExpired]
  )
}
