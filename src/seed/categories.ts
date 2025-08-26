import { faker } from "@faker-js/faker";
import { supabase } from "../config/supabase-admin";

interface Category {
  id: string;
  name: string;
  description: string;
  created_at: Date;
}

export async function seedCategories(count = 10): Promise<Category[]> {
  const categories: Category[] = [];
  const usedNames = new Set<string>();

  while (categories.length < count) {
    let name = faker.commerce.department();
    while (usedNames.has(name)) {
      name = faker.commerce.department();
    }
    usedNames.add(name);

    const description = faker.commerce.productDescription();
    const created_at = new Date();

    const { data, error } = await supabase
      .from("categories")
      .insert([{ name, description, created_at }])
      .select();

    if (error) {
      console.error("Error creating category:", error.message);
      continue;
    }

    const category = data[0];
    console.log(`Created category: ${category.name}`);

    categories.push({
      id: category.id,
      name: category.name,
      description: category.description,
      created_at: category.created_at,
    });
  }

  return categories;
}
