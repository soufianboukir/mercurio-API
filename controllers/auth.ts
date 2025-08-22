import type { Request, Response } from "express";
import { supabase } from "../config/supabase.ts";
import config from "../config/config.ts";

export async function register(req: Request, res: Response) {
  const { email, password, name } = req.body;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
      emailRedirectTo: `${config.APP_BASE_URL}/verify`,
    },
  });

  if (error) return res.status(400).json({ error: error.message });
  if (!error && data.user) {
    await supabase.from("profiles").insert({
      user_id: data.user.id,
      full_name: data.user.user_metadata.name,
      role: "user",
      created_at: new Date(),
    });
  }

  res.json({ user: data.user });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return res.status(400).json({ error: error.message });
  res.json({ session: data.session, user: data.user });
}




export async function logout(req: Request,res: Response) {
  const { error } = await supabase.auth.signOut();
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Logged out successfully" });
}


export async function profile(req: Request, res: Response) {
  const token = req.headers.authorization?.replace("Bearer ", "");

  const { data: { user }, error: userError } = await supabase.auth.getUser(token);
  if (userError || !user) return res.status(401).json({ error: userError?.message || "Unauthorized" });

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (profileError) return res.status(400).json({ error: profileError.message });

  res.json({ user, profile });
}



export async function forgotPassword(req: Request, res: Response) {
  const { email } = req.body;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${config.APP_BASE_URL}/reset-password`,
  });

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Password reset email sent" });
}




export async function resetPassword(req: Request, res: Response) {
  const { access_token, newPassword } = req.body;

  const { error } = await supabase.auth.updateUser(
    { password: newPassword },
    { accessToken: access_token }
  );
    
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Password updated successfully" });
}
