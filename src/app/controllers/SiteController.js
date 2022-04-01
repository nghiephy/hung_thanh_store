var Categories = require('../models/Category');
var Products = require('../models/Product');

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
            // console.log(products);
            res.render('home', {
                ...homeObjectData
            });
        }
        loadProductAsync();
    }

    // [GET] /search
    search(req, res, next) {
        res.send('search');
    }

    // [GET] /search
    cart(req, res, next) {
        res.render('cart');
    }

    // [GET] /search
    payment(req, res, next) {
        res.render('payment');
    }
}

module.exports = new SiteController();
