import { Router } from "express";
import { cancelOrder, createOrder, getOrderById, getOrders, updateOrderStatus } from "../controllers/orders";
import { isAuth } from "../middlewares/isAuth";
import { isAdmin } from "../middlewares/isAdmin";

const router = Router();

router.post("/orders", isAuth, createOrder);
router.get("/orders", isAuth,getOrders);
router.get("/orders/:id", isAuth,getOrderById);
router.put("/orders/:id", isAdmin,updateOrderStatus);
router.delete("/orders/:id", isAuth, cancelOrder);

export default router;
