const db = require('../../config/db');
const Product = function (product) {
    this.product_id = product.product_id;
    this.category_id = product.category_id;
    this.name = product.name;
    this.slug = product.slug;
    this.description = product.description;
    this.basic_unit = product.basic_unit;
    this.price_per_unit = product.price_per_unit;
    this.brand = product.brand;
    this.origin = product.origin;
}

Product.get_all = function (result) {
    db.query("SELECT * FROM PRODUCTS", function(err, products) {
        if(err) {
            result(err);
        }else{
            result(products);
        }
    });
}

Product.get_pro_via_category = function (categoryName, result) {
    db.query(`call getProductViaCategory ('${categoryName}');`, function(err, products) {
        if(err) {
            result(err);
        }else{
            result(products);
        }
    });
}

module.exports = Product;
