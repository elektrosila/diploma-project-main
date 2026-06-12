const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const envCandidates = [
  path.resolve(__dirname, ".env"),
  path.resolve(__dirname, "../.env"),
  path.resolve(__dirname, "../../.env"),
  path.resolve(process.cwd(), ".env"),
];

const loadedEnvPath = envCandidates.find((envPath) => fs.existsSync(envPath));

if (loadedEnvPath) {
  require("dotenv").config({ path: loadedEnvPath });
  console.log(">> Loaded env from:", loadedEnvPath);
} else {
  require("dotenv").config();
  console.log(">> Loaded env from process environment");
}

const pool = require("./config/db");
const apiRouter = require("./routes");

const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());
console.log(">> Using DATABASE_URL:", process.env.DATABASE_URL);

app.use(express.static(path.join(__dirname, "../../frontend/dist")));
app.use("/images", express.static(path.join(__dirname, "../public/uploads")));

app.use("/api", apiRouter);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist", "index.html"));
});

async function startServer() {
  try {
    await pool.ensureRequiredTables();
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to initialize database structure:", error);
    process.exit(1);
  }
}

startServer();
