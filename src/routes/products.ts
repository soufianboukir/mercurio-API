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

// - `GET /products` → List all products
// - `GET /products/:id` → Get product details
// - `POST /products` → Create product (admin only)
// - `PUT /products/:id` → Update product (admin only)
// - `DELETE /products/:id` → Delete product (admin only)
// - `GET /products/category/:categoryId` → List products by category
// - `GET /products/search?query=keyword` → Search products by name or keyword

router.get("/all", getProducts);
router.get("/:id", getProductById);
router.post("/create", isAdmin, createProduct);
router.put("/:id", isAdmin, updateProduct);
router.delete("/:id", isAdmin, deleteProduct);
router.get("/category/:categoryId", getProductsByCategory);
router.get("/search/withQuery", searchProducts);

export default router;
