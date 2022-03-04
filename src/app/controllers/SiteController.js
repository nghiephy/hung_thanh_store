class SiteController {
    // [GET] /
    index(req, res, next) {
        res.render('home');
    }

    // [GET] /search
    search(req, res, next) {
        res.send('search');
    }

    // [GET] /search
    cart(req, res, next) {
        res.render('cart');
    }
}

module.exports = new SiteController();
