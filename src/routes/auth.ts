import { Router } from "express";
import {
  forgotPassword,
  login,
  logout,
  profile,
  register,
  resetPassword,
  updateProfile,
} from "../controllers/auth.ts";
import { isAuth } from "../middlewares/isAuth.ts";

const router = Router();

router.post("/signup", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", isAuth, profile);
router.put("/profile", isAuth, updateProfile);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password", resetPassword);

export default router;
