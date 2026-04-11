const express = require('express');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');
const z = require('zod');

const router = express.Router();

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
});

const profileUpdateSchema = z.object({
    full_name: z.string().optional(),
    country: z.string().optional(),
    city: z.string().optional(),
    postal_code: z.string().optional(),
    delivery_address: z.string().optional(),
    phone: z.string().optional(),
    avatar_url: z.string().optional()
});

// Middleware to protect routes
const requireAuth = async (req, res, next) => {
    const token = req.cookies.access_token || req.headers.authorization?.split(' ')[1];
    
    if (!token) return res.status(401).json({ error: 'Unauthorized: No token provided' });
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};

/* -----------------------------------------
   [GET] /api/user/profile
----------------------------------------- */
router.get('/profile', requireAuth, async (req, res) => {
    try {
        const { data: user, error } = await supabase
            .from('users')
            .select('id, email, phone, full_name, country, city, postal_code, delivery_address, avatar_url, provider, created_at, is_verified')
            .eq('id', req.userId)
            .single();

        if (error || !user) return res.status(404).json({ error: 'User not found' });
        
        res.json({ user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* -----------------------------------------
   [PUT] /api/user/profile
----------------------------------------- */
router.put('/profile', requireAuth, async (req, res) => {
    try {
        const updates = profileUpdateSchema.parse(req.body);

        const { data: user, error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', req.userId)
            .select('id, email, phone, full_name, country, city, postal_code, delivery_address, avatar_url, provider, created_at, is_verified')
            .single();

        if (error) throw error;
        
        res.json({ message: 'Profile updated successfully', user });
    } catch (err) {
        if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
