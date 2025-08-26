import express from "express";
import authRoutes from "./routes/auth.ts";
import userRoutes from "./routes/user.ts";
import path from "path";

const app = express();
app.use(express.json());

app.get("/docs", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public/docs/index.html"));
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

export default app;
