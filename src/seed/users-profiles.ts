import { faker } from "@faker-js/faker";
import { supabase } from "../config/supabase-admin";

interface UserWithProfile {
  id: string;
  full_name: string;
  image: string;
}

export async function seedUsersAndProfiles(count = 5): Promise<UserWithProfile[]> {
  const users: UserWithProfile[] = [];

  for (let i = 0; i < count; i++) {
    const email = faker.internet.email();
    const full_name = faker.person.fullName();
    const password = "123456";

    const image = `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 100)}.jpg`;

    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { full_name },
      email_confirm: true,
    });

    if (userError) {
      console.error("Error creating user:", userError.message);
      continue;
    }

    const { error: profileError } = await supabase.from("profiles").insert([
      {
        user_id: userData.user.id,
        full_name,
        role: "user",
        image,
        created_at: new Date(),
      },
    ]);

    if (profileError) {
      console.error("Error creating profile:", profileError.message);
      continue;
    }

    console.log(`Created user & profile: ${full_name}`);
    users.push({ id: userData.user.id, full_name, image });
  }

  return users;
}
