interface UserWithProfile {
  id: string;
  full_name: string;
  image: string;
}
export declare function seedUsersAndProfiles(count?: number): Promise<UserWithProfile[]>;
export {};
