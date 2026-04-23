import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// create express app instance
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// serve static frontend assets
app.use(express.static(path.join(__dirname, "dist")));

app.get(/.*/, (req, res) => {
  res.sendFile(path.resolve("dist", "index.html"));
});

// start app on port 3001
app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
