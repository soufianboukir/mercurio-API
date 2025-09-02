import express from "express";
import authRoutes from "./routes/auth.ts";
import userRoutes from "./routes/user.ts";
import productRoutes from "./routes/products.ts";
import categorieRoutes from "./routes/categories.ts";

import path from "path";

const app = express();
app.use(express.json());

app.get("/docs", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public/docs/index.html"));
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categorieRoutes);

export default app;
