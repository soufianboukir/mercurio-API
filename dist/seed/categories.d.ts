interface Category {
    id: string;
    name: string;
    description: string;
    created_at: Date;
}
export declare function seedCategories(count?: number): Promise<Category[]>;
export {};
