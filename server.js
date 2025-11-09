




import express from "express";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const __dirname = path.resolve();
const USERS_FILE = path.join(__dirname, "users.json");

// Ensure file exists
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([]));
}

// Register user
app.post("/register", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Missing fields" });

  const users = JSON.parse(fs.readFileSync(USERS_FILE));
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: "User already exists" });
  }

  users.push({ email, password });
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

  res.json({ message: "Account created successfully" });
});

// Login user
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const users = JSON.parse(fs.readFileSync(USERS_FILE));
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  res.json({ message: "Login successful", user });
});

app.get("/", (req, res) => {
  res.send("Broker auth backend is live 🚀");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));