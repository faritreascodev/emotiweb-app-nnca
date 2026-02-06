const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const gamesRoutes = require('./games');
const sessionsRoutes = require('./sessions');
const progressRoutes = require('./progress');
const parentRoutes = require('./parent');

router.use('/auth', authRoutes);
router.use('/games', gamesRoutes);
router.use('/sessions', sessionsRoutes);
router.use('/progress', progressRoutes);
router.use('/parent', parentRoutes);

router.get('/', (req, res) => {
    res.json({
        message: 'EmotiWeb API v1.0',
        endpoints: {
            auth: '/api/auth',
            games: '/api/games',
            sessions: '/api/sessions',
            progress: '/api/progress',
            parent: '/api/parent'
        }
    });
});

module.exports = router;
