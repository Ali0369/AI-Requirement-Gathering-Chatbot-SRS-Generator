// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from "url";
// import fetch from "node-fetch";

// dotenv.config();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Serve frontend
// app.use(express.static(__dirname));
// app.get("/", (req, res) => res.sendFile(path.join(__dirname, "landing.html")));

// // Hugging Face Deepseek API
// const HF_TOKEN = process.env.HF_TOKEN;
// const MODEL = "deepseek-ai/DeepSeek-V3-0324"; // Free chat model

// // Ask AI function
// async function askAI(message) {
//   try {
//     const response = await fetch(`https://router.huggingface.co/v1/chat/completions`, {
//       method: "POST",
//       headers: {
//         "Authorization": `Bearer ${HF_TOKEN}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         model: MODEL,
//         messages: [
//           {
//             role: "user",
//             content: `
// You are a professional requirement-gathering chatbot.
// Instructions:
// - Ask only **one short question at a time**.
// - Wait for the stakeholder's answer before asking the next question.
// - Clarify conflicts immediately if answers are ambiguous or conflicting.
// - Categorize each response automatically as Functional, Non-Functional, or Constraint.
// - Respond in plain text only, no Markdown or special symbols.
// - Keep your tone professional and concise.

// Stakeholder input: "${message}"`
//           }
//         ],
//       }),
//     });

//     const data = await response.json();

//     if (data.error) return "⚠️ AI Error: " + data.error;
//     return data.choices?.[0]?.message?.content || "⚠️ No response from AI";

//   } catch (err) {
//     console.error(err);
//     return "⚠️ Error connecting to AI.";
//   }
// }

// // API endpoint
// app.post("/ask", async (req, res) => {
//   const { message } = req.body;
//   const reply = await askAI(message);
//   res.json({ reply });
// });

// const PORT = 3000;
// app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));




import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend
app.use(express.static(__dirname));
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "landing.html")));

// Hugging Face Deepseek API
const HF_TOKEN = process.env.HF_TOKEN;
const MODEL = "deepseek-ai/DeepSeek-V3-0324"; // Free chat model

// Ask AI function
async function askAI(message) {
  try {
    const response = await fetch(`https://router.huggingface.co/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "user",
            content: `
You are a professional requirement-gathering chatbot.
Instructions:
- Ask only **one short question at a time**.
- Wait for the stakeholder's answer before asking the next question.
- Clarify conflicts immediately if answers are ambiguous or conflicting.
- Categorize each response automatically as Functional, Non-Functional, or Constraint.
- Respond in plain text only, no Markdown or special symbols.
- Keep your tone professional and concise.

Stakeholder input: "${message}"`,
          },
        ],
      }),
    });

    const data = await response.json();

    if (data.error) return "⚠️ AI Error: " + data.error;
    return data.choices?.[0]?.message?.content || "⚠️ No response from AI";

  } catch (err) {
    console.error(err);
    return "⚠️ Error connecting to AI.";
  }
}

// Initialize SQLite database
async function initDB() {
  const db = await open({
    filename: path.join(__dirname, "database", "users.db"),
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      security_answer TEXT
    )
  `);

  console.log("✅ SQLite database initialized with users table");
  return db;
}

// API endpoints for login/register/forgot
app.post("/api/register", async (req, res) => {
  const { email, password, securityAnswer } = req.body;
  try {
    const db = await initDB();
    await db.run(
      "INSERT INTO users (email, password, security_answer) VALUES (?, ?, ?)",
      [email, password, securityAnswer]
    );
    await db.close();
    res.json({ success: true, message: "Registration successful!" });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Email already exists or error occurred." });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const db = await initDB();
    const user = await db.get("SELECT * FROM users WHERE email = ? AND password = ?", [email, password]);
    await db.close();
    if (user) {
      res.json({ success: true, message: "Login successful!" });
    } else {
      res.json({ success: false, message: "Invalid email or password." });
    }
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Error during login." });
  }
});

app.post("/api/forgot", async (req, res) => {
  const { email, securityAnswer, newPassword } = req.body;
  try {
    const db = await initDB();
    const user = await db.get("SELECT * FROM users WHERE email = ? AND security_answer = ?", [email, securityAnswer]);
    if (user) {
      await db.run("UPDATE users SET password = ? WHERE email = ?", [newPassword, email]);
      await db.close();
      res.json({ success: true, message: "Password reset successful!" });
    } else {
      await db.close();
      res.json({ success: false, message: "Invalid email or security answer." });
    }
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Error during password reset." });
  }
});

// Hugging Face AI endpoint
app.post("/ask", async (req, res) => {
  const { message } = req.body;
  const reply = await askAI(message);
  res.json({ reply });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
