const express = require('express');
const router = express.Router();
const multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

const adminController = require('../app/controllers/AdminController');
const middlewareController = require('../app/controllers/MiddlewareController');

router.get('/products', middlewareController.verifyAdminLogin, adminController.getProducts);
router.get('/add-product', middlewareController.verifyAdminLogin, adminController.addProduct);
router.post('/upload', multipartMiddleware, adminController.uploadImage);
router.get('/', middlewareController.verifyAdminLogin, adminController.index);

module.exports = router;
