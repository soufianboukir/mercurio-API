import { faker } from "@faker-js/faker";
import { supabase } from "../config/supabase-admin";
export async function seedProducts(count = 20) {
  const products = [];
  const { data: categories, error: catError } = await supabase.from("categories").select("id");
  if (catError) {
    console.error("Error fetching categories:", catError.message);
    return products;
  }
  if (!categories || categories.length === 0) {
    console.error("No categories found. Seed categories first.");
    return products;
  }
  for (let i = 0; i < count; i++) {
    const name = faker.commerce.productName();
    const description = faker.commerce.productDescription();
    const category_id = faker.helpers.arrayElement(categories).id;
    const price = parseFloat(faker.commerce.price({ min: 10, max: 500, dec: 2 }));
    const stock = faker.number.int({ min: 1, max: 100 });
    const created_at = new Date();
    const image = faker.image.urlLoremFlickr({ category: "product" });
    const { data, error } = await supabase
      .from("products")
      .insert([{ name, description, category_id, price, stock, image, created_at }])
      .select();
    if (error) {
      console.error("Error creating product:", error.message);
      continue;
    }
    const product = data[0];
    console.log(`Created product: ${product.name} (${product.price}$)`);
    products.push({
      id: product.id,
      name: product.name,
      description: product.description,
      category_id: product.category_id,
      price: product.price,
      stock: product.stock,
      image: product.image,
      created_at: product.created_at,
    });
  }
  return products;
}
