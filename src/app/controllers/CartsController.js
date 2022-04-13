const Cart = require('../models/Cart');

class CartsController {
    // [POST] /cart/get-cart
    getCart(req, res, next) {
        const user_id = req.user.USER_ID;
        Cart.getCartList(user_id, function(products) {
            res.status(200).json({
                listProduct: products[0],
            });
        });
    }

    // [POST] /cart/delete-cart
    deleteCart(req, res, next) {
        const user_id = req.user.USER_ID;
        Cart.deleteCartList(user_id, function(result) {
            res.status(200).json({
                result
            });
        });
    }

    // [POST] /cart/delete-cart-item
    deleteCartItem(req, res, next) {
        const user_id = req.user.USER_ID;
        const product_id = req.body.product_id;

        Cart.deleteCartItem(user_id, product_id, function(result) {
            res.status(200).json({
                result
            });
        });
    }

    // [POST] /cart/update-cart-item
    updateCartItem(req, res, next) {
        const user_id = req.user.USER_ID;
        const product_id = req.body.product_id;
        const quantity = req.body.quantity;
        const total_price = req.body.total_price;

        Cart.updateCartItem(user_id, product_id, quantity, total_price, function(result) {
            res.status(200).json({
                result
            });
        });
    }

    // [POST] /cart/save-cart
    saveCart(req, res, next) {
        try {
            const user_id = req.user.USER_ID;
            const dataCart = JSON.parse(req.body.dataCart);
            const arrData = [];
            for(const obj of dataCart) {
                const {
                    PRODUCT_ID,
                    QUANTITY,
                    TOTAL_PRICE,
                    IMAGE,
                } = obj;
                const objSort = {
                    PRODUCT_ID,
                    QUANTITY,
                    TOTAL_PRICE,
                    IMAGE,
                }
                const value = Object.values(objSort);
                arrData.push(value);
            }
            // console.log(arrData);
            Cart.saveCartList(user_id, arrData, function(result) {
                res.status(200).json({
                    result
                });
            });
        }catch(err) {
            res.status(200).json({
                message: "You're not authenticated!",
            })
        }
    }

}

module.exports = new CartsController();
