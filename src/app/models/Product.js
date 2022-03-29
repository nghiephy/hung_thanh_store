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

Product.get_pro_via_slug = function (slug, result) {
    var data = {};

    const getDataProductPromise = new Promise((resolve, reject) => {
        db.query(`select * from products where products.slug = '${slug}';`, function(err, product) {
            if(err) {
                reject(err);
            }else{
                data.product = product;
                resolve(product);
            }
        });
    });
    const getImagesListPromise = new Promise((resolve, reject) => {
        db.query(`select images.PATH as IMG_PATH, images.DESCRIPTION as IMG_DESCRIPTION from products join images on images.PRODUCT_ID = products.PRODUCT_ID where products.slug = '${slug}';`, function(err, images) {
            if(err) {
                reject(err);
            }else{
                resolve(images);
            }
        });
    });

    getDataProductPromise
        .then(product => {
            data.product = product[0];
            return getImagesListPromise;
        })
        .then(images => {
            data.images = images;
            result(data);
        })
        .catch(err => {
            result(err);
        })

}

module.exports = Product;
