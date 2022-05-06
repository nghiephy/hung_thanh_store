const db = require('../../config/db');

const Cart = function (cart) {
    this.cart_id = cart.cart_id;
    this.user_id = cart.user_id;
    this.update_date = cart.update_date;
}

Cart.getCartList = function(userId, result) {
    db.query(`call getCartList('${userId}');`, function(err, products) {
        if(err) {
            result(err);
        }else{
            result(products);
        }
    });
}

Cart.findCartId = function(userId, result) {
    db.query(`select CART_ID from carts where USER_ID = ${userId}`, function(err, cartId) {
        if(err) {
            result(err);
        }else{
            result(cartId);
        }
    });
}

Cart.deleteCartList = function(userId, result) {
    Cart.findCartId(userId, (cartId) => {
        cartId = Object.values(JSON.parse(JSON.stringify(cartId[0])));
        db.query(`call deleteCartList(${cartId[0]});`, function(err, data) {
            if(err) {
                result(err);
            }else{
                result(data);
            }
        });
    });
}

Cart.deleteCartItem = function(userId, productId, result) {
    Cart.findCartId(userId, (cartId) => {
        cartId = Object.values(JSON.parse(JSON.stringify(cartId[0])));
        cartId = cartId[0];
        db.query(`delete from carts_products where carts_products.cart_id = ${cartId} and carts_products.product_id = ${productId};`, function(err, data) {
            if(err) {
                result(err);
            }else{
                result(data);
            }
        });
    });
}

Cart.updateCartItem = function(userId, productId, quantity, totalPrice, result) {
    Cart.findCartId(userId, (cartId) => {
        cartId = Object.values(JSON.parse(JSON.stringify(cartId[0])));
        cartId = cartId[0];
        db.query(`update carts_products set quantity = ${quantity}, total_price = ${totalPrice} where carts_products.cart_id = ${cartId} and carts_products.product_id = ${productId};`, function(err, data) {
            if(err) {
                result(err);
            }else{
                result(data);
            }
        });
    });
}

Cart.saveCartList = function(userId, dataCart, result) {
    Cart.findCartId(userId, (cartId) => {
        const stmt = `insert into carts_products(cart_id, product_id, quantity, total_price, image) values ? `;
        cartId = Object.values(JSON.parse(JSON.stringify(cartId[0])));
        // console.log(cartId);
        dataCart.forEach(item => {
            item.unshift(cartId);
        });

        db.query(stmt, [dataCart], function(err, results, fields) {
            if(err) {
                result(err);
            }else{
                result(results);
            }
        });
    });
}


module.exports = Cart;
