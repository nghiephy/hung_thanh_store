const express = require('express');
const router = express.Router();

const productsController = require('../app/controllers/ProductsController');
const middlewareController = require('../app/controllers/MiddlewareController');

router.get('/:slug', middlewareController.verifyUserLogin,  productsController.show);
router.post('/add-to-cart/:slug', productsController.addToCart);

module.exports = router;
