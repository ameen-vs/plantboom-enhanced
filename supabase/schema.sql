-- Enable the pgcrypto extension for secure random UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Create `users` table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE,
    phone TEXT UNIQUE,
    password_hash TEXT,
    full_name TEXT,
    country TEXT DEFAULT 'Morocco',
    city TEXT,
    postal_code TEXT,
    delivery_address TEXT,
    avatar_url TEXT,
    provider TEXT CHECK (provider IN ('google', 'phone', 'whatsapp', 'email')),
    created_at TIMESTAMPTZ DEFAULT now(),
    last_login TIMESTAMPTZ,
    is_verified BOOLEAN DEFAULT false
);

-- 2. Create `otp_attempts` table
CREATE TABLE IF NOT EXISTS public.otp_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_or_email TEXT NOT NULL,
    ip_address TEXT,
    attempt_count INT DEFAULT 0,
    locked_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create `sessions` table
CREATE TABLE IF NOT EXISTS public.sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    refresh_token_hash TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    user_agent TEXT,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS) on the tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.otp_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- 4. Set RLS Policies

-- Users Policy: Users can only read and update their own rows.
CREATE POLICY "Users can view own profile"
    ON public.users
    FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.users
    FOR UPDATE
    USING (auth.uid() = id);

-- Note: Since we are using our custom auth flow powered by the Express backend,
-- these RLS policies primarily apply if we connect via Supabase client on the frontend 
-- directly with an authenticated session. Our Express backend uses the `service_role` 
-- which bypasses RLS and handles authorization manually.

-- OTP Attempts Policy: Backend service role only (no direct public access).
CREATE POLICY "Service Role Only for OTP Attempts"
    ON public.otp_attempts
    FOR ALL
    USING (false); -- Deny all frontend access

-- Sessions Policy: Backend service role only.
CREATE POLICY "Service Role Only for Sessions"
    ON public.sessions
    FOR ALL
    USING (false); -- Deny all frontend access
