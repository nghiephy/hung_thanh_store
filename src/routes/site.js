const express = require('express');
const router = express.Router();

const siteController = require('../app/controllers/SiteController');
const middlewareController = require('../app/controllers/MiddlewareController');

router.get('/search', middlewareController.verifyUserLogin, siteController.search);
router.get('/cart', middlewareController.verifyUserLogin, siteController.cart);
router.get('/payment', middlewareController.verifyUserLogin, siteController.payment);
router.post('/payment', middlewareController.verifyUserLogin, siteController.handlePayment);
router.get('/', middlewareController.verifyUserLogin, siteController.index);

module.exports = router;
