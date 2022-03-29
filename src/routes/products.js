const express = require('express');
const router = express.Router();

const productsController = require('../app/controllers/ProductsController');

router.get('/:slug', productsController.show);

module.exports = router;
