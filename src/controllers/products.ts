import type { Request, Response } from "express";
import { supabase as supabaseAdmin } from "../config/supabase-admin.ts";

const PAGE_SIZE = 10;

export const getProducts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data, error, count } = await supabaseAdmin
      .from("products")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    res.json({
      page,
      totalProducts: count,
      totalPages: Math.ceil((count || 0) / PAGE_SIZE),
      products: data,
    });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin.from("products").select("*").eq("id", id).single();

    if (error) throw error;

    if (!data) return res.status(404).json({ error: "Product not found" });

    res.json(data);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, stock, category_id, image } = req.body;

    const { data, error } = await supabaseAdmin
      .from("products")
      .insert([{ name, description, price, stock, category_id, image }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from("products")
      .update(req.body)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    if (!data) return res.status(404).json({ error: "Product not found" });

    res.json(data);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin.from("products").delete().eq("id", id);

    if (error) throw error;

    res.status(200).json({ message: "Product deleted successfully" });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
};

export const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    const page = parseInt(req.query.page as string, 10) || 1;
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data, error, count } = await supabaseAdmin
      .from("products")
      .select("*", { count: "exact" })
      .eq("category_id", categoryId)
      .range(from, to);

    if (error) throw error;

    res.json({
      page,
      totalProducts: count,
      totalPages: Math.ceil((count || 0) / PAGE_SIZE),
      products: data,
    });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
};

export const searchProducts = async (req: Request, res: Response) => {
  try {
    const query = (req.query.query as string) || "";
    const page = parseInt(req.query.page as string, 10) || 1;
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data, error, count } = await supabaseAdmin
      .from("products")
      .select("*", { count: "exact" })
      .ilike("name", `%${query}%`)
      .range(from, to);

    if (error) throw error;

    res.json({
      page,
      totalProducts: count,
      totalPages: Math.ceil((count || 0) / PAGE_SIZE),
      products: data,
    });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
};
