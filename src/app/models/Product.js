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
    db.query("SELECT * FROM PRODUCTS WHERE PRODUCTS.DELETED = FALSE;", function(err, products) {
        if(err) {
            result(err);
        }else{
            result(products);
        }
    });
}

Product.get_trash = function (result) {
    db.query("SELECT PRODUCTS.*, CATEGORIES.NAME AS CAT_NAME FROM PRODUCTS JOIN CATEGORIES ON PRODUCTS.CATEGORY_ID = CATEGORIES.CATEGORY_ID WHERE PRODUCTS.DELETED = TRUE;", function(err, products) {
        if(err) {
            result(err);
        }else{
            result(products);
        }
    });
}

Product.soft_delete = function (idProduct, timestamp, result) {
    db.query(`UPDATE PRODUCTS SET DELETED = TRUE, DELETED_AT = '${timestamp}' WHERE PRODUCT_ID IN (?);`, [idProduct], function(err, data) {
        if(err) {
            result(err);
        }else{
            result(data);
        }
    });
}

Product.destroy_product = function (idProduct, result) {
    db.query(`call destroyProduct(${idProduct});`, function(err, data) {
        if(err) {
            result(err);
        }else{
            result(data);
        }
    });
}

Product.delete_images = function (idImage, result) {
    db.query(`DELETE FROM IMAGES WHERE IMAGES.IMAGE_ID IN (?);`, [idImage], function(err, data) {
        if(err) {
            result(err);
        }else{
            result(data);
        }
    });
}

Product.restore_product = function (idProduct, result) {
    db.query(`UPDATE PRODUCTS SET DELETED = FALSE, DELETED_AT = null WHERE PRODUCT_ID = ${idProduct};`, function(err, data) {
        if(err) {
            result(err);
        }else{
            result(data);
        }
    });
}

Product.get_all_for_ad = function (result) {
    db.query("SELECT PRODUCTS.*, CATEGORIES.NAME AS CAT_NAME FROM PRODUCTS JOIN CATEGORIES ON PRODUCTS.CATEGORY_ID = CATEGORIES.CATEGORY_ID WHERE PRODUCTS.DELETED = FALSE;", function(err, products) {
        if(err) {
            result(err);
        }else{
            result(products);
        }
    });
}

Product.get_pro_with_stock_ad = function (result) {
    db.query("SELECT PRODUCTS.*, CATEGORIES.NAME AS CAT_NAME, STOCK.STOCK_ID, STOCK.QUANTITY, STOCK.UPDATED_AT AS STOCK_UPDATED_AT FROM PRODUCTS JOIN CATEGORIES ON PRODUCTS.CATEGORY_ID = CATEGORIES.CATEGORY_ID JOIN STOCK ON STOCK.PRODUCT_ID = PRODUCTS.PRODUCT_ID WHERE PRODUCTS.DELETED = FALSE;", function(err, products) {
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
        db.query(`select images.IMAGE_ID AS IMAGE_ID, images.PATH as IMG_PATH, images.DESCRIPTION as IMG_DESCRIPTION from products join images on images.PRODUCT_ID = products.PRODUCT_ID where products.slug = '${slug}';`, function(err, images) {
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

Product.search_pro_by_name = function (productName, result) {
    db.query(`select products.*, images.PATH as IMAGE_PATH from products join categories on products.category_id = categories.category_id join images on products.product_id = images.product_id where products.name like '%${productName}%' and products.deleted = false group by product_id;`, function(err, products) {
        if(err) {
            result(err);
        }else{
            result(products);
        }
    });
}

Product.add_new = async function (data, result) {
    const dataProduct = [
        data.category_product,
        data.name_product,
        data.slug_product,
        data.description_product,
        data.basic_unit_product,
        data.price_per_unit_product,
        data.brand_product,
        data.origin_product,
    ];
    const dataImage = data.image_list;
    const dataStock = data.quantity_product;
    const insertProductPromise = new Promise((resolve, reject) => {
        db.query(`insert into products(CATEGORY_ID, NAME, SLUG, DESCRIPTION, BASIC_UNIT, PRICE_PER_UNIT, BRAND, ORIGIN) values (?,?,?,?,?,?,?,?);`, dataProduct, function(err, results, fields) {
            if(err) {
                reject(err);
            }else{
                resolve(results);
            }
        });
    });
    const addImage = (product_id) => {
        return new Promise((resolve, reject) => {
            if(dataImage.length>0) {
                dataImage.forEach(item => {
                    item.unshift(product_id);
                });
                db.query(`insert into images(PRODUCT_ID, PATH, DESCRIPTION) values ?`, [dataImage], function(err, results, fields) {
                    if(err) {
                        reject(err);
                    }else{
                        resolve(results);
                    }
                });
            }else {
                resolve("");
            }
        });
    };
    const addStock = (product_id) => {
        return new Promise((resolve, reject) => {
            if(dataStock) {
                dataStock.unshift(product_id);
                db.query(`insert into stock(PRODUCT_ID, QUANTITY, UPDATED_AT) values (?,?,?)`, dataStock, function(err, results, fields) {
                    if(err) {
                        reject(err);
                    }else{
                        resolve(results);
                    }
                });
            }else {
                resolve("");
            }
        });
    };

    const responseProduct = await insertProductPromise;
    const responseImage = await addImage(responseProduct.insertId);
    const responseStock = await addStock(responseProduct.insertId);
    // const responseImage = insertImagesPromise;

}

Product.update = async function (data, result) {
    const dataProduct = [
        data.id_product,
        data.category_product,
        data.name_product,
        data.slug_product,
        data.description_product,
        data.basic_unit_product,
        data.price_per_unit_product,
        data.brand_product,
        data.origin_product,
        data.updated_at,
    ];
    const dataImage = data.image_list;
    const updateProductPromise = new Promise((resolve, reject) => {
        db.query(`call updateProduct(?,?,?,?,?,?,?,?,?,?)`, dataProduct, function(err, results, fields) {
            if(err) {
                reject(err);
            }else{
                resolve(results);
            }
        });
    });
    const addImage = (product_id) => {
        return new Promise((resolve, reject) => {
            if(dataImage.length>0) {
                dataImage.forEach(item => {
                    item.unshift(product_id);
                });
                db.query(`insert into images(PRODUCT_ID, PATH, DESCRIPTION) values ?`, [dataImage], function(err, results, fields) {
                    if(err) {
                        reject(err);
                    }else{
                        resolve(results);
                    }
                });
            }else {
                resolve("");
            }
        });
    };

    const responseProduct = await updateProductPromise;
    // console.log("Checl response updated >>>>");
    // console.log(responseProduct);
    const responseImage = await addImage(data.id_product);

}

module.exports = Product;
