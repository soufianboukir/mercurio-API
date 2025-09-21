import { Router } from "express";
import { addToCart, getCart, removeCartItem, updateCartItem } from "../controllers/cart.ts";
import { isAuth } from "../middlewares/isAuth.ts";


const router = Router();

router.get("/cart", isAuth, getCart);
router.post("/cart", isAuth, addToCart);
router.put("/cart/:itemId", isAuth, updateCartItem);
router.delete("/cart/:itemId", isAuth, removeCartItem);

export default router;
