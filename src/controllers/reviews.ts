
import type { Response } from "express";
import { supabase as supabaseAdmin } from "../config/supabase-admin.ts";
import type authRequest from "../interfaces/authRequest.ts";


export const getProductReviews = async (req: authRequest, res: Response) => {
  try {
    const { id: productId } = req.params;

    const { data, error } = await supabaseAdmin
      .from("reviews")
      .select(`
        id,
        comment,
        rating,
        profile_id,
        created_at,
        profile:profiles(username, avatar_url)
      `)
      .eq("product_id", productId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
};

export const addProductReview = async (req: authRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id: productId } = req.params;
    const { comment, rating } = req.body;

    if (!comment || typeof rating !== "number") {
      return res.status(400).json({ error: "Comment and numeric rating required" });
    }

    const { data: existing, error: existingError } = await supabaseAdmin
      .from("reviews")
      .select("id")
      .eq("product_id", productId)
      .eq("profile_id", userId)
      .single();

    if (existingError && existingError.code !== "PGRST116") throw existingError;
    if (existing) {
      return res.status(409).json({ error: "You already reviewed this product" });
    }

    const { data, error } = await supabaseAdmin
      .from("reviews")
      .insert([
        { product_id: productId, profile_id: userId, comment, rating },
      ])
      .select("id, comment, rating, created_at, profile_id, product_id")
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
};


export const updateReview = async (req: authRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { comment, rating } = req.body;

    const { data: review, error: getError } = await supabaseAdmin
      .from("reviews")
      .select("*")
      .eq("id", id)
      .single();

    if (getError) throw getError;
    if (!review) return res.status(404).json({ error: "Review not found" });
    if (review.profile_id !== userId)
      return res.status(403).json({ error: "Forbidden" });

    const { data, error } = await supabaseAdmin
      .from("reviews")
      .update({ comment, rating })
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;

    res.json(data);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
};


export const deleteReview = async (req: authRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role; // assuming JWT payload includes role
    const { id } = req.params;

    const { data: review, error: getError } = await supabaseAdmin
      .from("reviews")
      .select("*")
      .eq("id", id)
      .single();

    if (getError) throw getError;
    if (!review) return res.status(404).json({ error: "Review not found" });

    if (review.profile_id !== userId && userRole !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const { error } = await supabaseAdmin.from("reviews").delete().eq("id", id);
    if (error) throw error;

    res.json({ message: "Review deleted successfully" });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
};
