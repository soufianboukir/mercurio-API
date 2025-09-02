import { Router } from "express";
import { isAdmin } from "../middlewares/isAdmin.ts";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  getProductsByCategory,
  searchProducts,
  updateProduct,
} from "../controllers/products.ts";

const router = Router();

router.get("/all", getProducts);
router.get("/:id", getProductById);
router.post("/create", isAdmin, createProduct);
router.put("/:id", isAdmin, updateProduct);
router.delete("/:id", isAdmin, deleteProduct);
router.get("/category/:categoryId", getProductsByCategory);
router.get("/search/withQuery", searchProducts);

export default router;
