import type { Response } from "express";
import { supabase as supabaseAdmin } from "../config/supabase-admin.ts";
import authRequest from "../interfaces/authRequest.ts";

export const getCart = async (req: authRequest, res: Response) => {
  try {
    const userId = req.user?.id; 
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { data, error } = await supabaseAdmin
      .from("cart_items")
      .select("id, quantity, product:products(*)")
      .eq("profile_id", userId);

    if (error) throw error;

    res.json({ cart: data });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
};

export const addToCart = async (req: authRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { product_id, quantity } = req.body;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    if (!product_id || !quantity) return res.status(400).json({ error: "Missing fields" });

    const { data: existing } = await supabaseAdmin
      .from("cart_items")
      .select("*")
      .eq("profile_id", userId)
      .eq("product_id", product_id)
      .single();

    if (existing) {
      const { data, error } = await supabaseAdmin
        .from("cart_items")
        .update({ quantity: existing.quantity + quantity })
        .eq("id", existing.id)
        .select()
        .single();

      if (error) throw error;
      return res.json(data);
    }

    const { data, error } = await supabaseAdmin
      .from("cart_items")
      .insert([{ profile_id: userId, product_id, quantity }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
};

export const updateCartItem = async (req: authRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { data, error } = await supabaseAdmin
      .from("cart_items")
      .update({ quantity })
      .eq("id", itemId)
      .eq("profile_id", userId)
      .select()
      .single();

    if (error) throw error;

    if (!data) return res.status(404).json({ error: "Item not found" });

    res.json(data);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
};

export const removeCartItem = async (req: authRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { itemId } = req.params;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { error } = await supabaseAdmin
      .from("cart_items")
      .delete()
      .eq("id", itemId)
      .eq("profile_id", userId);

    if (error) throw error;

    res.json({ message: "Item removed from cart" });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
};
