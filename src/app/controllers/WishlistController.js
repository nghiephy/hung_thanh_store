const Wishlist = require('../models/Wishlist');
const User = require('../models/User');

class WishlistController {

    // [GET] /wishlist
    async show(req, res, next) {
        const userId = req.user.USER_ID;
        var data = null;
        const getInforPromise = new Promise((resolve, reject) => {
            if(req.user.USER_TYPE == 'customer') {
                User.getFullUserInfor(userId, 'customers', (userInfor) => {
                    resolve(userInfor[0]);
                })
            }else {
                User.getFullUserInfor(userId, 'employees', (userInfor) => {
                    resolve(userInfor[0]);
                })
            }
        });
        const getProductsPromise = new Promise((resolve, reject) => {
            Wishlist.getProductsWishList(userId, (listProduct) => {
                resolve(listProduct);
            });
        });

        data = await getInforPromise;
        var listProductResponse = await getProductsPromise;
        listProductResponse = Object.values(JSON.parse(JSON.stringify(listProductResponse[0])));
        console.log(listProductResponse);

        res.render('user/wishlist.hbs', {
            layout: 'account-main.hbs',
            data_contact: data,
            wishlist: 'active',
            listProduct: listProductResponse,
        })
    }

    // [POST] /cart/get-cart
    getWishList(req, res, next) {
        const user_id = req.user.USER_ID;
        Wishlist.getWishList(user_id, function(products) {
            var listProductId = Object.values(JSON.parse(JSON.stringify(products[0])));
            listProductId = listProductId.map(item => {
                return item.PRODUCT_ID;
            });
            res.status(200).json({
                dataWishlist: listProductId,
            });
        });
    }

    // [POST] /wishlist/add/:id
    addWishlist(req, res, next) {
        const user_id = req.user.USER_ID;
        const productId = req.params.id;

        Wishlist.addProduct(user_id, productId, function(response) {
            if(response.errno) {
                res.status(500).json({
                    message: 'fail',
                });
            }else {
                res.status(200).json({
                    message: 'success',
                });
            }
        });
    }

    // [DELETE] /wishlist/delete/:id
    deleteWishlist(req, res, next) {
        const user_id = req.user.USER_ID;
        const productId = req.params.id;

        Wishlist.deleteProduct(user_id, productId, function(response) {
            if(response.errno) {
                res.status(500).json({
                    message: 'fail',
                });
            }else {
                res.status(200).json({
                    message: 'success',
                });
            }
        });
    }


}

module.exports = new WishlistController();
