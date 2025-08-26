import type { Request, Response } from "express";
import { supabase } from "../config/supabase.ts";
import { supabase as supabaseAdmin } from "../config/supabase-admin.ts";

export async function listUsers(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = 10;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const {
      data: profiles,
      error: profileError,
      count,
    } = await supabase
      .from("profiles")
      .select("user_id, full_name, image, role, created_at", { count: "exact" })
      .neq("role", "admin")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (profileError) {
      return res.status(500).json({ error: profileError.message });
    }

    const userIds = profiles.map(p => p.user_id);

    const { data: allAuthUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();

    if (authError) {
      return res.status(500).json({ error: authError.message });
    }

    const authUsers = allAuthUsers.users.filter(u => userIds.includes(u.id));

    const merged = profiles.map(profile => {
      const authUser = authUsers.find(u => u.id === profile.user_id);
      return {
        user_id: profile.user_id,
        email: authUser?.email || null,
        user_created_at: authUser?.created_at || null,
        full_name: profile.full_name,
        role: profile.role,
        image: profile.image,
        profile_created_at: profile.created_at,
      };
    });

    const totalPages = Math.ceil((count || 0) / pageSize);

    res.json({
      page,
      pageSize,
      totalPages,
      totalUsers: count || 0,
      users: merged,
    });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
}

export async function getUserById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(id);

    if (userError || !userData?.user) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = userData.user;

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("full_name, role, created_at, image")
      .eq("user_id", id)
      .single();

    if (profileError && profileError.code !== "PGRST116") {
      return res.status(500).json({ error: profileError.message });
    }

    res.json({
      user_id: user.id,
      email: user.email,
      user_created_at: user.created_at,
      full_name: profile?.full_name || null,
      role: profile?.role || null,
      image: profile?.image || null,
      profile_created_at: profile?.created_at || null,
    });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const { error: profileError } = await supabase.from("profiles").delete().eq("user_id", id);

    if (profileError) {
      return res.status(500).json({ error: profileError.message });
    }

    const { error: userError } = await supabaseAdmin.auth.admin.deleteUser(id);

    if (userError) {
      return res.status(500).json({ error: userError.message });
    }

    res.json({ message: "User and profile deleted successfully" });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
}
