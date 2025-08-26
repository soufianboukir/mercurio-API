import { seedCategories } from "./categories";
import { seedProducts } from "./products";
import { seedUsersAndProfiles } from "./users-profiles";
// command used to seed db
// npx ts-node seed/main.ts
async function main() {
  console.log("Seeding users and profiles...");
  await seedUsersAndProfiles(20);
  console.log("Seeding categories");
  await seedCategories(10);
  console.log("Seeding products...");
  await seedProducts(20);
  console.log("Seeding complete!");
}
main();
