const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
const slugify = require('slugify');

const adminController = require('../app/controllers/AdminController');
const middlewareController = require('../app/controllers/MiddlewareController');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './src/public/img/products');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        // Config your options
        const options = {
            replacement: '-', // replace spaces with replacement character, defaults to `-`
            remove: undefined, // remove characters that match regex, defaults to `undefined`
            lower: true, // convert to lower case, defaults to `false`
            strict: true, // strip special characters except replacement, defaults to `false`
            locale: 'vi', // language code of the locale to use
        };

        const name_image = slugify(file.originalname, options);
        cb(null, name_image + '-' + Date.now() + path.extname(file.originalname));
    }
});

const imageFilter = function(req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

let uploadMultiple = multer({ storage: storage, fileFilter: imageFilter }).array('images_product', 10);

router.get('/products', middlewareController.verifyAdminLogin, adminController.getProducts);
router.get('/get-product', middlewareController.verifyAdminLogin, adminController.getProductDetail);
router.get('/add-product', middlewareController.verifyAdminLogin, adminController.addProduct);
router.get('/trash', middlewareController.verifyAdminLogin, adminController.getTrash);
router.delete('/soft-delete/:id', middlewareController.verifyAdminLogin, adminController.softDelete);
router.get('/update-product/:slug', middlewareController.verifyAdminLogin, adminController.updateProduct);
router.post('/add-product', middlewareController.verifyAdminLogin, uploadMultiple, adminController.saveProduct);
router.post('/upload', multipartMiddleware, adminController.uploadImage);
router.get('/', middlewareController.verifyAdminLogin, adminController.index);

module.exports = router;
