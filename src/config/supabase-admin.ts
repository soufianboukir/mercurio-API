import { createClient } from "@supabase/supabase-js";
import config from "./config.ts";

export const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_SERVICE_ROLE_KEY);
