class SiteController {
    // [GET] /
    index(req, res, next) {
        res.render('home');
    }

    // [GET] /search
    search(req, res, next) {
        res.send('search');
    }
}

module.exports = new SiteController();
