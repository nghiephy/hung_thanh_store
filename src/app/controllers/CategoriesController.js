var Categories = require('../models/Category');

class CategoriesController {
    // [GET] /categories/:slug
    show(req, res, next) {
        const orderBy = req.query.orderBy;
        const getProViaSlugCatPromise = new Promise((resolve, reject) => {
            Categories.get_pro_via_slug_cat(req.params.slug, resolve);
        });

        const loadProductCategoryAsync = async() => {
            var products = await getProViaSlugCatPromise;
            products = Object.values(JSON.parse(JSON.stringify(products[0])));

            if(orderBy==='low') {
                products.sort(function compareFn(a, b) {
                    if(parseInt(a.PRICE_PER_UNIT) < parseInt(b.PRICE_PER_UNIT)) {
                        return -1;
                    }
                });
                res.render('categories/show', {
                    products,
                    active: 'low',
                });
            }else if(orderBy==='high') {
                products.sort(function compareFn(a, b) {
                    if(parseInt(a.PRICE_PER_UNIT) > parseInt(b.PRICE_PER_UNIT)) {
                        return -1;
                    }
                });
                res.render('categories/show', {
                    products,
                    active: 'high',
                });
            }else {
                res.render('categories/show', {
                    products,
                    active: 'popular',
                });
            }
        }
        
        loadProductCategoryAsync();
    }

}

module.exports = new CategoriesController();
