const express = require('express');
const router = express.Router();

const categoriesController = require('../app/controllers/categoriesController');

router.get('/:slug', categoriesController.show);

module.exports = router;
