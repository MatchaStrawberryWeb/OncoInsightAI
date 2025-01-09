const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth'); // Middleware to verify token
const { User } = require('../models'); // Assuming Sequelize or similar ORM

router.get('/api/get-user', verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({ where: { id: req.user.id } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ username: user.username });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
