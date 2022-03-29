const db = require('../../config/db');
const Category = function (category) {
    this.category_id = category.category_id;
    this.cat_category_id = category.cat_category_id;
    this.name = category.name;
    this.image = category.image;
    this.description = category.description;
}

Category.get_all = function (result) {
    db.query("SELECT * FROM CATEGORIES", function(err, categories) {
        if(err) {
            result(err);
        }else{
            result(categories);
        }
    });
}

Category.get_banner = function (categoryName, result) {
    db.query(`SELECT BANNER FROM CATEGORIES where CATEGORIES.NAME = '${categoryName}';`, function(err, banner) {
        if(err) {
            result(err);
        }else{
            result(banner);
        }
    });
}

Category.get_pro_via_slug_cat = function (categorySlug, result) {
    db.query(`call getProductViaSlugCat ('${categorySlug}');`, function(err, products) {
        if(err) {
            result(err);
        }else{
            result(products);
        }
    });
}

module.exports = Category;
