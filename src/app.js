import express from "express"
import cors from "cors"
import authRoutes from "./routes/auth.js"

const app = express()

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
    credentials: true,
  })
)
app.use(express.json())

app.get("/logout", async (req, res) => {
  res.json({ message: "Logged out successfully" })
})

app.get("/unauthorized", async (req, res) => {
  res.status(401).json({ message: "Unauthorized" })
})

app.get("/", async (req, res) => {
  res.json({ message: "Hello from auth router" })
})

app.use("/auth", authRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
