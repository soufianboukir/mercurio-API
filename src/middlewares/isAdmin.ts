import { supabase } from "../config/supabase.ts";
import type { NextFunction, Response } from "express";
import type authRequest from "../interfaces/authRequest.ts";

export async function isAdmin(req: authRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) return res.status(401).json({ error: "No token provided" });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) return res.status(401).json({ error: "Invalid token" });

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (profileError || !profile) {
    return res.status(401).json({ error: "Profile not found" });
  }

  if (profile.role !== "admin") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  req.user = user;
  next();
}
