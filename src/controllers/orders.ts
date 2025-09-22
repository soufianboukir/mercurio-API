import type { Response } from "express";
import { supabase as supabaseAdmin } from "../config/supabase-admin.ts";
import type authRequest from "../interfaces/authRequest.ts";

export const createOrder = async (req: authRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Order items required" });
    }

    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert([{ profile_id: userId, status: "pending", total: totalPrice }])
      .select()
      .single();

    if (orderError) throw orderError;

    const orderItems = items.map(i => ({
      order_id: order.id,
      product_id: i.product_id,
      quantity: i.quantity,
      price: Math.round(i.price * 100),
    }));

    const { error: itemsError } = await supabaseAdmin.from("order_items").insert(orderItems);

    if (itemsError) throw itemsError;

    res.status(201).json({ ...order, items: orderItems });
  } catch (err) {
    console.log(err);

    res.status(500).json({ error: "Server error" + err });
  }
};

export const getOrders = async (req: authRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*, order_items(*, product:products(*))")
      .eq("profile_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
};

export const getOrderById = async (req: authRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*, order_items(*, product:products(*))")
      .eq("id", id)
      .single();

    if (error) throw error;

    if (data.profile_id !== userId && req.user?.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    res.json(data);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
};

export const updateOrderStatus = async (req: authRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const { data, error } = await supabaseAdmin
      .from("orders")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Order not found" });

    res.json(data);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
};

export const cancelOrder = async (req: authRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const { data: order, error: getError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (getError) throw getError;
    if (!order) return res.status(404).json({ error: "Order not found" });

    if (order.profile_id !== userId && req.user?.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const { error } = await supabaseAdmin
      .from("orders")
      .update({ status: "cancelled" })
      .eq("id", id);

    if (error) throw error;

    res.json({ message: "Order cancelled" });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
};
