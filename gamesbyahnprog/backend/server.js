const express = require("express");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcrypt");
const Redis = require("ioredis");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 5001;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN;
const REDIS_URL = process.env.REDIS_URL;
const DB_PATH = process.env.DB_PATH || path.join(__dirname, "users.db");
const SALT_ROUNDS = 10;
const db = new sqlite3.Database(DB_PATH);
const redis = REDIS_URL ? new Redis(REDIS_URL, { maxRetriesPerRequest: 3 }) : null;

app.use(express.json());

function normalizeOrigin(value) {
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

function isGithubPagesOrigin(origin) {
  if (typeof origin !== "string") {
    return false;
  }

  try {
    return /\.github\.io$/i.test(new URL(origin).hostname);
  } catch {
    return false;
  }
}

const configuredFrontendOrigin = normalizeOrigin(FRONTEND_ORIGIN);

app.use(cors({
  origin(origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:5500",
      "http://127.0.0.1:5500",
      "https://ajh4500.github.io",
      "null"
    ];

    if (configuredFrontendOrigin) {
      allowedOrigins.push(configuredFrontendOrigin);
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

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS game_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      game_name TEXT NOT NULL,
      result TEXT NOT NULL,
      played_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
});

function buildUserPublic(user) {
  return {
    id: user.id,
    username: user.username,
    email: user.email
  };
}

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(error) {
      if (error) {
        reject(error);
        return;
      }

      resolve(this);
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (error, row) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(row);
    });
  });
}

async function getUserByEmail(email) {
  if (redis) {
    const storedUser = await redis.get(`user:email:${email}`);
    return storedUser ? JSON.parse(storedUser) : null;
  }

  return get(
    "SELECT id, username, email, password_hash FROM users WHERE email = ?",
    [email]
  );
}

async function createUser(username, email, passwordHash) {
  if (redis) {
    const id = await redis.incr("users:next-id");
    const user = {
      id,
      username,
      email,
      password_hash: passwordHash
    };

    await redis.set(`user:email:${email}`, JSON.stringify(user));
    return user;
  }

  const result = await run(
    "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
    [username, email, passwordHash]
  );

  return {
    id: result.lastID,
    username,
    email,
    password_hash: passwordHash
  };
}

app.get("/", (req, res) => {
  res.send("Backend is running.");
});

app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  const trimmedUsername = typeof username === "string" ? username.trim() : "";
  const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

  if (!trimmedUsername || !normalizedEmail || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const existingUser = await getUserByEmail(normalizedEmail);

    if (existingUser) {
      return res.status(400).json({ error: "Email already exists." });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await createUser(trimmedUsername, normalizedEmail, passwordHash);

    return res.json({
      message: "Signup successful.",
      user: buildUserPublic(user)
    });
  } catch (error) {
    console.error("Signup failed:", error);
    return res.status(500).json({ error: "Could not create account." });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

  if (!normalizedEmail || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const user = await getUserByEmail(normalizedEmail);

    if (!user) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatches) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    return res.json({
      message: "Login successful.",
      user: buildUserPublic(user)
    });
  } catch (error) {
    console.error("Login failed:", error);
    return res.status(500).json({ error: "Could not log in." });
  }
});

app.get("/stats/:userId", async (req, res) => {
  const userId = req.params.userId;

  db.all(
    `
    SELECT game_name, result, COUNT(*) as count
    FROM game_results
    WHERE user_id = ?
    GROUP BY game_name, result
    `,
    [userId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: "Could not fetch stats." });
      }

      res.json(rows);
    }
  );
});

        app.post("/game-result", (req, res) => {
  const { userId, gameName, result } = req.body;

  db.run(
    `
    INSERT INTO game_results (user_id, game_name, result)
    VALUES (?, ?, ?)
    `,
    [userId, gameName, result],
    function (err) {
      if (err) {
        return res.status(500).json({ error: "Could not save result." });
      }

      res.json({ success: true });
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(redis ? "Using Render Key Value via REDIS_URL" : `Using SQLite database at ${DB_PATH}`);
  if (configuredFrontendOrigin) {
    console.log(`Allowed frontend origin: ${configuredFrontendOrigin}`);
  }
});
