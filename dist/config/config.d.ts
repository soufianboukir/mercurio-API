interface Config {
    port: number;
    nodeEnv: string;
    SUPABASE_URL: string;
    SUPABASE_KEY: string;
    APP_BASE_URL: string;
    SUPABASE_SERVICE_ROLE_KEY: string;
}
declare const config: Config;
export default config;
