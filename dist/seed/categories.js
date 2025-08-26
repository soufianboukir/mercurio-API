import { faker } from "@faker-js/faker";
import { supabase } from "../config/supabase-admin";
export async function seedCategories(count = 10) {
  const categories = [];
  const usedNames = new Set();
  while (categories.length < count) {
    let name = faker.commerce.department();
    while (usedNames.has(name)) {
      name = faker.commerce.department(); // reroll until unique
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
