import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { signupRouter } from "./routes/signup.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: true }));
app.use(express.json());

app.use("/api", signupRouter);

// Our docs and educational content
app.use("/docs", express.static(path.resolve(__dirname, "../docs/dist")));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
