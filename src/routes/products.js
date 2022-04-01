const express = require('express');
const router = express.Router();

const productsController = require('../app/controllers/ProductsController');

router.get('/:slug', productsController.show);
router.post('/add-to-cart/:slug', productsController.addToCart);

module.exports = router;
