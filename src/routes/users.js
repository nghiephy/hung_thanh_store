const express = require('express');
const router = express.Router();

const usersController = require('../app/controllers/UsersController');
const middlewareController = require('../app/controllers/MiddlewareController');

router.post('/register', usersController.registerUser);
router.post('/login', usersController.loginUser);
router.get('/welcome', usersController.welcomeUser);
router.get('/information', middlewareController.verifyToken, usersController.getInforUser);
router.get('/check_exits_user', usersController.checkExitsUser);

module.exports = router;
