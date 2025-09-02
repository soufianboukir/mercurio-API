import { Router } from "express";
import { isAdmin } from "../middlewares/isAdmin.ts";
import { createCategory, deleteCategory, getCategories, getCategoryById, updateCategory } from "../controllers/categories.ts";

const router = Router();

router.get("/all", getCategories);
router.get("/:id", getCategoryById);
router.post("/create", isAdmin, createCategory);
router.put("/:id", isAdmin, updateCategory);
router.delete("/:id", isAdmin, deleteCategory);

export default router;
