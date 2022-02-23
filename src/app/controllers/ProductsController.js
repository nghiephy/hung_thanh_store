class ProductsController {
    // [GET] /
    show(req, res, next) {
        res.render('products/show');
    }

}

module.exports = new ProductsController();
