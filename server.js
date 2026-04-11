require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Static File Serving - Serve the root directory
app.use(express.static(path.join(__dirname, '/')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Fallback to index.html for unknown routes if building a SPA, but since it's multi-page:
// We just let static middleware handle normal pages.

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});

// Required for Vercel Serverless deployment
module.exports = app;
