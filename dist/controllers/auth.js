import { supabase } from "../config/supabase";
import config from "../config/config";
export async function register(req, res) {
    const { email, password, name } = req.body;
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { name },
            emailRedirectTo: `${config.APP_BASE_URL}/verify`,
        },
    });
    if (error)
        return res.status(400).json({ error: error.message });
    if (!error && data.user) {
        await supabase.from("profiles").insert({
            user_id: data.user.id,
            full_name: data.user.user_metadata.name,
            role: "user",
            created_at: new Date(),
        });
    }
    res.json({ user: data.user });
}
export async function login(req, res) {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (error)
        return res.status(400).json({ error: error.message });
    res.json({ session: data.session, user: data.user });
}
export async function logout(req, res) {
    const { error } = await supabase.auth.signOut();
    if (error)
        return res.status(400).json({ error: error.message });
    res.json({ message: "Logged out successfully" });
}
export async function profile(req, res) {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const { data: { user }, error: userError, } = await supabase.auth.getUser(token);
    if (userError || !user)
        return res.status(401).json({ error: userError?.message || "Unauthorized" });
    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
    if (profileError)
        return res.status(400).json({ error: profileError.message });
    res.json({ user, profile });
}
export async function updateProfile(req, res) {
    try {
        const { full_name } = req.body;
        if (!full_name) {
            return res.status(400).json({ error: "full_name is required" });
        }
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .update({ full_name })
            .eq("user_id", userId)
            .select();
        if (profileError) {
            return res.status(400).json({ error: profileError.message });
        }
        return res.json({
            message: "Profile updated successfully",
            profile: profileData[0],
        });
    }
    catch {
        return res.status(500).json({ error: "Internal server error" });
    }
}
export async function forgotPassword(req, res) {
    const { email } = req.body;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${config.APP_BASE_URL}/reset-password`,
    });
    if (error)
        return res.status(400).json({ error: error.message });
    res.json({ message: "If an account with this email exists, you will receive a reset link." });
}
export async function resetPassword(req, res) {
    const { newPassword } = req.body;
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error)
        return res.status(400).json({ error: error.message });
    res.json({ message: "Password updated successfully" });
}
