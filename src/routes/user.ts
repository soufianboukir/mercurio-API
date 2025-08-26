import { Router } from "express";
import { isAdmin } from "../middlewares/isAdmin.ts";
import { deleteUser, getUserById, listUsers } from "../controllers/user.ts";

const router = Router();

router.get("/all", isAdmin, listUsers);
router.get("/:id", isAdmin, getUserById);
router.delete("/:id", isAdmin, deleteUser);

export default router;
