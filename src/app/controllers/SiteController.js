var Categories = require('../models/Category');
var Products = require('../models/Product');
var Cart = require('../models/Cart');
var Address = require('../models/Address');
var Order = require('../models/Order');

class SiteController {
    // [GET] /
    index(req, res, next) {
        const getCatePromise = new Promise((resolve, reject) => {
            Categories.get_all(resolve);
        });
        const getProViaCatePromise = new Promise((resolve, reject) => {
            Products.get_pro_via_category("Đồ Dùng Học Sinh", resolve);
        });
        const getProViaCatePromise1 = new Promise((resolve, reject) => {
            Products.get_pro_via_category("Giấy In Ấn - Photo", resolve);
        });
        const getProViaCatePromise2 = new Promise((resolve, reject) => {
            Products.get_pro_via_category("Máy Tính Casio", resolve);
        });
        var homeObjectData = {};

        // getCatePromise
        //     .then((categories) => {
        //         homeObjectData.categories = categories;
        //         return getProViaCatePromise;
        //     })
        //     .then((products) => {
        //         products = Object.values(JSON.parse(JSON.stringify(products[0])));
        //         homeObjectData.products = products;
        //         console.log(products);
        //         res.render('home', {
        //             ...homeObjectData
        //         });
        //     })
        const loadProductAsync = async () => {
            const categories = await getCatePromise;
            homeObjectData.categories = categories;

            const products = [];
            var dodunghocsinh = await getProViaCatePromise;
            dodunghocsinh = Object.values(JSON.parse(JSON.stringify(dodunghocsinh[0])));
            products.push(dodunghocsinh);

            var inan = await getProViaCatePromise1;
            inan = Object.values(JSON.parse(JSON.stringify(inan[0])));
            products.push(inan);

            var casio = await getProViaCatePromise2;
            casio = Object.values(JSON.parse(JSON.stringify(casio[0])));
            products.push(casio);

            homeObjectData.products = products;
            // console.log(req.user);
            res.render('home', {
                ...homeObjectData,
                // user: req.user,
                cart: req.cart,
            });
        }
        loadProductAsync();
    }

    // [GET] /search
    search(req, res, next) {
        const user = req.user;

        Products.search_pro_by_name(req.query.q, function(products) {
            res.render('search', {
                products,
                keyword: req.query.q,
                user,
            });
        });

        
    }

    // [GET] /cart
    cart(req, res, next) {
        const user = req.user;
        res.render('cart', {
            user,
        });
    }

    // [GET] /payment
    async payment(req, res, next) {
        const user = req.user;
        var addressList = '';
        
        if(user) {
            const userId = user.USER_ID||null;
            const getAddressPromise = new Promise((resolve, reject) => {
                Address.getAddress(userId, (addressList) => {
                    resolve(addressList);
                });
            });
    
            addressList = await getAddressPromise;
            addressList = Object.values(JSON.parse(JSON.stringify(addressList)));
        }

        res.render('payment', {
            user,
            addressList,
        });
    }

    // [POST] /payment
    async handlePayment(req, res, next) {
        const user = req.user;
        const cur_status = 2;
        console.log("Check body =>>>>>");
        console.log(req.body);
        var dataOrder = [
            Number(req.body.address_id),
        ];
        var dataAddress = [];
        var cartOb = JSON.parse(req.body.cart);
        var dataCart = [];
        var invoiceOb = req.body.infor_invoice;
        var timestamp = '';
        let date_ob = new Date();
        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth()+1)).slice(-2);
        let year = date_ob.getFullYear();
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();

        timestamp = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;

        if(user) {
            dataOrder.push(user.USER_ID);
        }else {
            dataOrder.push(null);
            // Add address for anonymous user
            dataAddress = [
                null,
                req.body.name,
                req.body.phone,
                req.body.address,
                req.body.ward,
                req.body.district,
                req.body.city,
                false,
            ];
        }
        dataOrder.push(req.body.note_card);
        dataOrder.push(timestamp);
        dataOrder.push(Number(req.body.total_price));
        dataOrder.push(cur_status);
        if(invoiceOb) {
            invoiceOb = JSON.parse(invoiceOb);
            dataOrder.push(invoiceOb['invoice-name-company']);
            dataOrder.push(invoiceOb['invoice-tax-number']);
            dataOrder.push(invoiceOb['invoice-address']);
        }

        for(const obj of cartOb) {
            const {
                PRODUCT_ID,
                QUANTITY,
                TOTAL_PRICE,
            } = obj;
            const objSort = [
                PRODUCT_ID,
                QUANTITY,
                TOTAL_PRICE,
            ];
            const value = Object.values(objSort);
            dataCart.push(value);
        }

        if(!user) {
            const addAddressPromise = new Promise((resolve, reject) => {
                Address.addAddress(dataAddress, (result) => {
                    resolve(result);
                });
            });
            const addAddressResponse = await addAddressPromise;

            if(addAddressResponse.errno) {
                res.status(500).json({
                    message: 'fail',
                    err_message: addAddressResponse,
                });
            }else {
                dataOrder[0] = addAddressResponse.insertId;
            }
        }

        console.log(dataOrder);
        console.log(dataCart);
        const addOrderPromise = new Promise((resolve, reject) => {
            Order.addOrder(dataOrder, dataCart, (result) => {
                resolve(result);
            });
        });

        const dataResponse = await addOrderPromise;
        console.log(dataResponse);
       
        if(dataResponse.errno) {
            res.status(500).json({
                message: 'fail',
            });
        }else {
            if(user) {
                Cart.deleteCartList(user.USER_ID, (result) => {});
            }
            res.status(200).json({
                message: 'success',
            });
        };

    }
}

module.exports = new SiteController();
