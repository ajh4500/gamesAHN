const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5001;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN;

app.use(express.json());

function isGithubPagesOrigin(origin) {
  if (typeof origin !== "string") return false;
  try {
    return /\.github\.io$/.test(new URL(origin).hostname);
  } catch {
    return false;
  }
}

app.use(cors({
  origin(origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:5500",
      "http://127.0.0.1:5500",
      "null"
    ];

    if (FRONTEND_ORIGIN) {
      allowedOrigins.push(FRONTEND_ORIGIN);
    }

    const isGithubPages = isGithubPagesOrigin(origin);

    if (!origin || allowedOrigins.includes(origin) || isGithubPages) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

// 🧠 SIMPLE IN-MEMORY DATABASE
const users = [];

app.get("/", (req, res) => {
  res.send("Backend is running.");
});

// SIGNUP
app.post("/signup", (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const exists = users.find(u => u.email === email);
  if (exists) {
    return res.status(400).json({ error: "Email already exists." });
  }

  const user = { id: Date.now(), username, email, password };
  users.push(user);

  res.json({
    message: "Signup successful.",
    user: {
      id: user.id,
      username,
      email
    }
  });
});

// LOGIN
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(400).json({ error: "Invalid email or password." });
  }

  res.json({
    message: "Login successful.",
    user: {
      id: user.id,
      username: user.username,
      email: user.email
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
