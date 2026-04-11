const express = require('express');
const z = require('zod');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');
const twilio = require('twilio');

const router = express.Router();

// Env variables checks
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://dummy-url.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_key';
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || '';
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || '';
const TWILIO_VERIFY_SERVICE_SID = process.env.TWILIO_VERIFY_SERVICE_SID || '';

// Initialize Supabase Admin Client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

// Initialize Twilio
let twilioClient;
if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
    twilioClient = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
}

// Schemas
const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    fullName: z.string().min(1)
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
});

const sendOtpSchema = z.object({
    phone: z.string().min(8), // simplified phone check validation
    method: z.enum(['sms', 'whatsapp'])
});

const verifyOtpSchema = z.object({
    phone: z.string().min(8),
    code: z.string().length(6)
});

const googleAuthSchema = z.object({
    idToken: z.string()
});

// Generate JWT Helper
const generateTokens = (userId) => {
    const accessToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId, type: 'refresh' }, JWT_SECRET, { expiresIn: '30d' });
    return { accessToken, refreshToken };
};

// Set Cookies
const setAuthCookies = (res, accessToken, refreshToken) => {
    res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000 // 15 mins
    });
    
    res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });
};

/* -----------------------------------------
   [POST] /api/auth/register
   Email/Password signup using bcrypt.
----------------------------------------- */
router.post('/register', async (req, res) => {
    try {
        const { email, password, fullName } = registerSchema.parse(req.body);

        // Check if user exists
        const { data: existingUser } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (existingUser) {
            return res.status(400).json({ error: 'User already exists with this email' });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 12);

        // Standard inserting, ignoring Supabase built-in auth to rely on our schema
        const { data: newUser, error } = await supabase
            .from('users')
            .insert([{ 
                email, 
                full_name: fullName, 
                provider: 'email',
                password_hash: passwordHash, // Note: Adding password_hash to our schema dynamically
                is_verified: false 
            }])
            .select()
            .single();

        if (error) throw error;

        // Generate Tokens
        const { accessToken, refreshToken } = generateTokens(newUser.id);
        
        // Save session
        const refreshHash = await bcrypt.hash(refreshToken, 10);
        await supabase
            .from('sessions')
            .insert([{
                user_id: newUser.id,
                refresh_token_hash: refreshHash,
                expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                user_agent: req.headers['user-agent'] || '',
                ip_address: req.ip || ''
            }]);

        setAuthCookies(res, accessToken, refreshToken);
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (err) {
        if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
        res.status(500).json({ error: err.message });
    }
});

/* -----------------------------------------
   [POST] /api/auth/login
   Standard email/password login
----------------------------------------- */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = loginSchema.parse(req.body);

        const { data: user } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (!user || user.provider !== 'email') {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Update last login
        await supabase.from('users').update({ last_login: new Date().toISOString() }).eq('id', user.id);

        const { accessToken, refreshToken } = generateTokens(user.id);
        
        // Save session
        const refreshHash = await bcrypt.hash(refreshToken, 10);
        await supabase
            .from('sessions')
            .insert([{
                user_id: user.id,
                refresh_token_hash: refreshHash,
                expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                user_agent: req.headers['user-agent'] || '',
                ip_address: req.ip || ''
            }]);

        setAuthCookies(res, accessToken, refreshToken);
        res.json({ message: 'Login successful', user });
    } catch (err) {
        if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
        res.status(500).json({ error: err.message });
    }
});

/* -----------------------------------------
   [POST] /api/auth/send-otp
   Send OTP via Twilio (MOCKED FOR DEV)
----------------------------------------- */
router.post('/send-otp', async (req, res) => {
    try {
        const { phone, method } = sendOtpSchema.parse(req.body);

        // DEV MOCK: We bypass Twilio entirely so you don't get blocked.
        console.log(`[DEV MODE] Faking ${method} OTP sent to ${phone}. Use code: 123456`);
        
        // Rate limit logic
        const ip = req.ip || 'unknown';
        const { data: blocks } = await supabase
            .from('otp_attempts')
            .select('*')
            .eq('ip_address', ip)
            .single();
            
        if (blocks && blocks.locked_until && new Date(blocks.locked_until) > new Date()) {
            return res.status(429).json({ error: 'Too many attempts. Try again later.' });
        }
            
        res.json({ message: 'OTP sent successfully (Dev Mode: Use 123456)', status: 'pending' });
    } catch (err) {
        if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
        res.status(500).json({ error: err.message });
    }
});

/* -----------------------------------------
   [POST] /api/auth/verify-otp
   Verify OTP (MOCKED FOR DEV)
----------------------------------------- */
router.post('/verify-otp', async (req, res) => {
    try {
        const { phone, code } = verifyOtpSchema.parse(req.body);

        // DEV MOCK: Only accept "123456"
        if (code !== '123456') {
            return res.status(400).json({ error: 'Invalid OTP. In dev mode, use 123456.' });
        }

        // Check if user exists with this phone
        let { data: user } = await supabase
            .from('users')
            .select('*')
            .eq('phone', phone)
            .single();

        if (!user) {
            // Upsert User
            const { data: newUser, error } = await supabase
                .from('users')
                .insert([{ phone, provider: 'phone', is_verified: true, full_name: 'New User' }])
                .select()
                .single();
            if (error) throw error;
            user = newUser;
        } else {
             await supabase.from('users').update({ last_login: new Date().toISOString() }).eq('id', user.id);
        }

        const { accessToken, refreshToken } = generateTokens(user.id);
        
        const refreshHash = await bcrypt.hash(refreshToken, 10);
        await supabase
            .from('sessions')
            .insert([{
                user_id: user.id,
                refresh_token_hash: refreshHash,
                expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                user_agent: req.headers['user-agent'] || '',
                ip_address: req.ip || ''
            }]);

        setAuthCookies(res, accessToken, refreshToken);
        res.json({ message: 'Login successful', user });
    } catch (err) {
        if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
        res.status(500).json({ error: err.message });
    }
});

/* -----------------------------------------
   [POST] /api/auth/google
   Parse Google idToken, Create/Login User
----------------------------------------- */
router.post('/google', async (req, res) => {
    try {
        const { OAuth2Client } = require('google-auth-library');
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        const { idToken } = googleAuthSchema.parse(req.body);

        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { email, name, picture } = payload;

        let { data: user } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (!user) {
            const { data: newUser, error } = await supabase
                .from('users')
                .insert([{ 
                    email, 
                    full_name: name, 
                    avatar_url: picture, 
                    provider: 'google', 
                    is_verified: true 
                }])
                .select().single();
            if (error) throw error;
            user = newUser;
        }

        const { accessToken, refreshToken } = generateTokens(user.id);
        const refreshHash = await bcrypt.hash(refreshToken, 10);
        await supabase
            .from('sessions')
            .insert([{
                user_id: user.id,
                refresh_token_hash: refreshHash,
                expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                user_agent: req.headers['user-agent'] || '',
                ip_address: req.ip || ''
            }]);

        setAuthCookies(res, accessToken, refreshToken);
        res.json({ message: 'Google auth successful', user });

    } catch (err) {
        res.status(400).json({ error: 'Google authentication failed' });
    }
});

/* -----------------------------------------
   [POST] /api/auth/logout
----------------------------------------- */
router.post('/logout', (req, res) => {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    res.json({ message: 'Logged out successfully' });
});

module.exports = router;
