import { supabase } from "../config/supabase";
export async function isAuth(req, res, next) {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token)
        return res.status(401).json({ error: "No token provided" });
    const { data: { user }, error, } = await supabase.auth.getUser(token);
    if (error || !user)
        return res.status(401).json({ error: "Invalid token" });
    req.user = user;
    next();
}
