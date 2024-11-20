import express from "express"
import { findUserByUsername, createUser } from "../model/User.js"
import { hashPassword, validatePassword } from "../utils/passwordValidation.js"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

const router = express.Router()

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body
  const hashedPassword = await hashPassword(password)

  await createUser({
    id: String(Date.now()),
    username,
    email,
    role: "user",
    password: hashedPassword,
    passwordLastChanged: new Date(),
    passwordExpired: false,
  })

  res.status(201).json({ message: "User registered successfully" })
})

router.post("/login", async (req, res) => {
  const { username, password } = req.body
  const user = await findUserByUsername(username)

  if (!user || !(await validatePassword(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" })
  }

  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  )
  res.json({ token })
})

router.get("/me", async (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  const token = authHeader.split(" ")[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    res.json(decoded)
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" })
  }
})

router.get("/refresh", async (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  const token = authHeader.split(" ")[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const newToken = jwt.sign(
      { id: decoded.id, username: decoded.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    )
    res.json({ token: newToken })
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" })
  }
})

export default router
