const express = require('express');
const router = express.Router();

const usersController = require('../app/controllers/UsersController');

router.post('/register', usersController.registerUser);
router.get('/welcome', usersController.welcomeUser);
router.get('/check_exits_user', usersController.checkExitsUser);

module.exports = router;
