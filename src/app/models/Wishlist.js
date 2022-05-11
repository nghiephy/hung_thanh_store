const db = require('../../config/db');

const Wishlist = function (wishlist) {
    this.wishlist_id = wishlist.wishlist_id;
    this.user_id = wishlist.user_id;
    this.update_date = wishlist.update_date;
}

Wishlist.getWishList = function(userId, result) {
    db.query(`call getWishList('${userId}');`, function(err, products) {
        if(err) {
            result(err);
        }else{
            result(products);
        }
    });
}

Wishlist.getProductsWishList = function(userId, result) {
    db.query(`call getProductsWishList('${userId}');`, function(err, listProduct) {
        if(err) {
            result(err);
        }else{
            result(listProduct);
        }
    });
}

Wishlist.findWishlistId = function(userId, result) {
    db.query(`select WISHLIST_ID from WISHLIST where USER_ID = ${userId}`, function(err, wishlistId) {
        if(err) {
            result(err);
        }else{
            result(wishlistId);
        }
    });
}

Wishlist.addProduct = function(userId, productId, result) {

    Wishlist.findWishlistId(userId, (wishlistId) => {
        wishlistId = Object.values(JSON.parse(JSON.stringify(wishlistId[0])));
        wishlistId = wishlistId[0];

        db.query(`INSERT INTO WISHLIST_PRODUCTS VALUES(${wishlistId},${productId})`, function(err, results, fields) {
            if(err) {
                result(err);
            }else{
                result(results);
            }
        });
    });
    
}

Wishlist.deleteProduct = function(userId, productId, result) {

    Wishlist.findWishlistId(userId, (wishlistId) => {
        wishlistId = Object.values(JSON.parse(JSON.stringify(wishlistId[0])));
        wishlistId = wishlistId[0];
        
        db.query(`DELETE FROM WISHLIST_PRODUCTS WHERE WISHLIST_ID = ${wishlistId} AND PRODUCT_ID = ${productId}`, function(err, results, fields) {
            if(err) {
                result(err);
            }else{
                result(results);
            }
        });
    });
    
}


module.exports = Wishlist;
