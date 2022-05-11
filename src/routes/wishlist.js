const express = require('express');
const router = express.Router();

const wishlistController = require('../app/controllers/wishlistController');
const middlewareController = require('../app/controllers/MiddlewareController');

router.get('/', middlewareController.verifyUserLogin, wishlistController.show);
router.post('/get-wishlist', middlewareController.verifyUserLogin, wishlistController.getWishList);
router.post('/add/:id', middlewareController.verifyUserLogin, wishlistController.addWishlist);
router.delete('/delete/:id', middlewareController.verifyUserLogin, wishlistController.deleteWishlist);

module.exports = router;
