const express = require('express');
const router = express.Router();

const categoriesController = require('../app/controllers/categoriesController');
const middlewareController = require('../app/controllers/MiddlewareController');

router.get('/:slug', middlewareController.verifyUserLogin, categoriesController.show);

module.exports = router;
