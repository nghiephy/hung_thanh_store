const express = require('express');
const router = express.Router();

const cartsController = require('../app/controllers/CartsController');
const middlewareController = require('../app/controllers/MiddlewareController');

router.post('/get-cart', middlewareController.verifyUserLogin, cartsController.getCart);
router.post('/save-cart', middlewareController.verifyUserLogin, cartsController.saveCart);
router.post('/delete-cart', middlewareController.verifyUserLogin, cartsController.deleteCart);
router.post('/delete-cart-item', middlewareController.verifyUserLogin, cartsController.deleteCartItem);
router.post('/update-cart-item', middlewareController.verifyUserLogin, cartsController.updateCartItem);

module.exports = router;
