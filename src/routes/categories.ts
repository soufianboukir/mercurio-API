import { Router } from "express";
import { isAdmin } from "../middlewares/isAdmin.ts";

const router = Router();

router.get("/all", getProducts);

export default router;
