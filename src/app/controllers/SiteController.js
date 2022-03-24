var Categories = require('../models/Category');

class SiteController {
    // [GET] /
    index(req, res, next) {
        Categories.get_all(function(categories) {
            // var resultArray = Object.values(JSON.parse(JSON.stringify(categories)));
            // console.log(categories);
            res.render('home', {
                categories: categories,
            });
        })
    }

    // [GET] /search
    search(req, res, next) {
        res.send('search');
    }

    // [GET] /search
    cart(req, res, next) {
        res.render('cart');
    }

    // [GET] /search
    payment(req, res, next) {
        res.render('payment');
    }
}

module.exports = new SiteController();
