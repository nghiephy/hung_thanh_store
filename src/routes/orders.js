const express = require('express');
const router = express.Router();

const ordersController = require('../app/controllers/OrdersController');
const middlewareController = require('../app/controllers/MiddlewareController');

router.get('/', middlewareController.verifyUserLogin, ordersController.index);

module.exports = router;
