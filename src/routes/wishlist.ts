import { Router } from "express";
import { addToWishlist, getWishlist, removeFromWishlist } from "../controllers/wishlist.ts";
import { isAuth } from "../middlewares/isAuth.ts";

const router = Router();

router.get("/all", isAuth,getWishlist);
router.post("/create", isAuth,addToWishlist);
router.delete("/:itemId", isAuth,removeFromWishlist)

export default router;