import type { User } from "@supabase/supabase-js";
import type { Request } from "express";

export default interface authRequest extends Request {
  user?: User;
}
