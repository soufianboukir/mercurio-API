import { Router } from "express";
import { addToCart, getCart, removeCartItem, updateCartItem } from "../controllers/cart.ts";
import { isAuth } from "../middlewares/isAuth.ts";

const router = Router();

router.get("/all", isAuth, getCart);
router.post("/create", isAuth, addToCart);
router.put("/:itemId", isAuth, updateCartItem);
router.delete("/:itemId", isAuth, removeCartItem);

export default router;
