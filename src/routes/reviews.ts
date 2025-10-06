import { Router } from "express";
import { isAuth } from "../middlewares/isAuth.ts";
import { isAdmin } from "../middlewares/isAdmin.ts";
import { addProductReview, deleteReview, getProductReviews, updateReview } from "../controllers/reviews.ts";

const router = Router();

router.get("/:id", getProductReviews);
router.post("/add", isAuth, addProductReview);
router.put("/:id", isAuth, updateReview);
router.delete("/:id", isAdmin, deleteReview);

export default router;


