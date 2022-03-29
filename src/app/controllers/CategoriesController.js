var Categories = require('../models/Category');

class CategoriesController {
    // [GET] /categories/:slug
    show(req, res, next) {
        const getProViaSlugCatPromise = new Promise((resolve, reject) => {
            Categories.get_pro_via_slug_cat(req.params.slug, resolve);
        });

        const loadProductCategoryAsync = async() => {
            var products = await getProViaSlugCatPromise;
            products = Object.values(JSON.parse(JSON.stringify(products[0])));
            
            res.render('categories/show', {
                products
            });
        }
        
        loadProductCategoryAsync();
    }

}

module.exports = new CategoriesController();
