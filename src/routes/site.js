const express = require('express');
const router = express.Router();

const siteController = require('../app/controllers/SiteController');

router.get('/search', siteController.search);
router.get('/cart', siteController.cart);
router.get('/payment', siteController.payment);
router.get('/', siteController.index);

module.exports = router;
