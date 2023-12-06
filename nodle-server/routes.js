const express = require('express');
const router = express.Router();
const authMiddleware = require('./authMiddleware');
const userController = require('./userController');

router.post('/register', userController.register);
router.post('/login', userController.login);

router.get('/getSecret/:userId', authMiddleware.authenticate, userController.getSecret);

router.post('/storeSecret/:userId', authMiddleware.authenticate, userController.storeSecret);

module.exports = router;
