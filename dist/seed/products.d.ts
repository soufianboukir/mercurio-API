interface Product {
  id: string;
  name: string;
  description: string;
  category_id: string;
  price: number;
  stock: number;
  image: string;
  created_at: Date;
}
export declare function seedProducts(count?: number): Promise<Product[]>;
export {};
