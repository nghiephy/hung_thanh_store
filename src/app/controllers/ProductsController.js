var Products = require('../models/Product');

class ProductsController {
    // [GET] /products/:slug
    show(req, res, next) {
        const getProViaSlugPromise = new Promise((resolve, reject) => {
            Products.get_pro_via_slug(req.params.slug, resolve);
        });
        const loadProInforAsync = async () => {
            var inforProduct = await getProViaSlugPromise;
            // inforProduct = Object.values(JSON.parse(JSON.stringify(inforProduct)));
            // console.log(inforProduct);
            res.render('products/show', inforProduct);
        }
        loadProInforAsync();
    }

    // [POST] /products/:slug
    addToCart(req, res, next) {
        const quantity = req.body.quantity;
        const slug = req.body.slug;

        console.log(slug);
        res.redirect(`/products/${slug}`);
    }

}

module.exports = new ProductsController();
