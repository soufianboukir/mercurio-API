import { Router } from "express";
import { cancelOrder, createOrder, getOrderById, getOrders, updateOrderStatus } from "../controllers/orders.ts";
import { isAuth } from "../middlewares/isAuth.ts";
import { isAdmin } from "../middlewares/isAdmin.ts";

const router = Router();

router.post("/create", isAuth, createOrder);
router.get("/all", isAuth,getOrders);
router.get("/:id", isAuth,getOrderById);
router.put("/:id", isAdmin,updateOrderStatus);
router.delete("/:id", isAuth, cancelOrder);

export default router;
