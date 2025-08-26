import { supabase } from "../config/supabase.ts";
import type { NextFunction, Response } from "express";
import type authRequest from "../interfaces/authRequest.ts";

export async function isAuth(req: authRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) return res.status(401).json({ error: "No token provided" });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) return res.status(401).json({ error: "Invalid token" });

  req.user = user;
  next();
}
