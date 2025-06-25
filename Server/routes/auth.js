const express = require('express');
const router = express.Router();

const {login} = require('../controllers/Auth');
const { auth } = require('../middlewares/auth');

router.post('/login', login);
router.get('/verify', auth, (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Token is valid'
    })
});

module.exports = router;