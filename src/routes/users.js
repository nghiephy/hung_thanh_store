const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const slugify = require('slugify');

const usersController = require('../app/controllers/UsersController');
const middlewareController = require('../app/controllers/MiddlewareController');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './src/public/img/users');
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

        const name_avatar = slugify(file.originalname, options);
        cb(null, name_avatar + '-' + Date.now() + path.extname(file.originalname));
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

let uploadSingle = multer({ storage: storage, fileFilter: imageFilter }).single('avatar_account');

router.post('/register', usersController.registerUser);
router.post('/login', usersController.loginUser);
router.post('/logout', usersController.logoutUser);
router.post('/refresh', usersController.requestRefreshToken);
router.post('/add-address', middlewareController.verifyUserLogin, usersController.addAddressUser);
router.get('/welcome', usersController.welcomeUser);
router.get('/account', middlewareController.verifyUserLogin, usersController.getAccountUser);
router.get('/address', middlewareController.verifyUserLogin, usersController.getAddressUser);
router.get('/address/:id', middlewareController.verifyUserLogin, usersController.getAddressViaId);
router.put('/update-account', middlewareController.verifyUserLogin, uploadSingle, usersController.updateAccountUser);
router.put('/update-address/:id', middlewareController.verifyUserLogin, usersController.updateAddress);
router.get('/information', middlewareController.verifyUserLogin, usersController.getInforUser);
router.get('/check_exits_user', usersController.checkExitsUser);
router.delete('/delete-address/:id', usersController.deleteAddress);

module.exports = router;
