import type { Response } from "express";
import { supabase as supabaseAdmin } from "../config/supabase-admin.ts";
import type authRequest from "../interfaces/authRequest.ts";

export const getWishlist = async (req: authRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const { data, error } = await supabaseAdmin
      .from("wishlist")
      .select("id, product:products(*)")
      .eq("profile_id", userId);

    if (error) throw error;

    res.json(data);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
};

export const addToWishlist = async (req: authRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { product_id } = req.body;

    if (!product_id) {
      return res.status(400).json({ error: "Product ID required" });
    }

    const { data: existing, error: existingError } = await supabaseAdmin
      .from("wishlist")
      .select("id")
      .eq("profile_id", userId)
      .eq("product_id", product_id)
      .single();

    if (existingError && existingError.code !== "PGRST116") throw existingError;

    if (existing) {
      return res.status(409).json({ error: "Product already in wishlist" });
    }

    const { data, error } = await supabaseAdmin
      .from("wishlist")
      .insert([{ profile_id: userId, product_id }])
      .select("id, product:products(*)")
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
};

export const removeFromWishlist = async (req: authRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { itemId } = req.params;


    const { data: item, error: getError } = await supabaseAdmin
      .from("wishlist")
      .select("*")
      .eq("id", itemId)
      .single();

    if (getError) throw getError;
    if (!item) return res.status(404).json({ error: "Item not found" });
    if (item.profile_id !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const { error } = await supabaseAdmin
      .from("wishlist")
      .delete()
      .eq("id", itemId);

    if (error) throw error;

    res.json({ message: "Item removed from wishlist" });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
};
