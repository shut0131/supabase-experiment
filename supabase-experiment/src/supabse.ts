import { createClient } from "@supabase/supabase-js";

export const client = createClient(
    import.meta.env.VITE_SUPABASE_PROJECT_URL,
    import.meta.env.VITE_SUPABASE_API_KEY
);