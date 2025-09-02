import type { Request, Response } from "express";
import { supabase as supabaseAdmin } from "../config/supabase-admin.ts";

export const getCategories = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("categories")
      .select("*")
      .order("id", { ascending: true });

    if (error) throw error;

    res.json(data);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from("categories")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(data);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    const { data, error } = await supabaseAdmin
      .from("categories")
      .insert([{ name, description }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({data, message:"New category created successfully"});
  } catch {
    res.status(500).json({ error: "Server error" });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const { data, error } = await supabaseAdmin
      .from("categories")
      .update({ name, description })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json({data, message: "Category updated successfully"});
  } catch {
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) throw error;

    res.json({ message: "Category deleted successfully" });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
};
