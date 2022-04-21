var Categories = require('../models/Category');
var Products = require('../models/Product');
var Carts = require('../models/Cart');
var Stock = require('../models/Stock');
const multipart = require('connect-multiparty');
const fs = require('fs');
const path = require('path');
const slugify = require('slugify');

class AdminController {
    // [GET] /admin/index
    index(req, res, next) {
        res.render('admin/index.hbs', {
            layout: 'admin-main.hbs',
            dashboard: 'active',
        });
    }

    // [GET] /admin/products
    async getProducts(req, res, next) {
        const productListPromise = new Promise((resolve, reject) => {
            Products.get_all_for_ad((productList) => {
                resolve(productList);
            });
        });
        const getCategoryPromise = new Promise((resolve, reject) => {
            Categories.get_all((categoryList) => {
                resolve(categoryList);
            });
        });

        var categoryList = await getCategoryPromise;
        categoryList = Object.values(JSON.parse(JSON.stringify(categoryList)));

        var productList = await productListPromise;
        productList = Object.values(JSON.parse(JSON.stringify(productList)));

        res.render('admin/products.hbs', {
            layout: 'admin-main.hbs',
            products: productList,
            categories: categoryList,
            all_product: 'active',
        });
    }

    // [GET] /admin/trash
    async getTrash(req, res, next) {
        const trashListPromise = new Promise((resolve, reject) => {
            Products.get_trash((trashList) => {
                resolve(trashList);
            });
        });

        var trashList = await trashListPromise;
        trashList = Object.values(JSON.parse(JSON.stringify(trashList)));

        res.render('admin/trash.hbs', {
            layout: 'admin-main.hbs',
            all_product: 'active',
            trash_list: trashList,
        });
    }

    // [GET] /admin/soft-delete
    async softDelete(req, res, next) {
        const idProduct = req.params.id;
        let date_ob = new Date();
        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth()+1)).slice(-2);
        let year = date_ob.getFullYear();
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();

        const timestamp = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;

        const softDeletePromise = new Promise((resolve, reject) => {
            Products.soft_delete(idProduct, timestamp, (data) => {
                resolve(data);
            });
        });
        const data = await softDeletePromise;

        if(data.errno) {
            res.status(200).json({
                message: 'fail',
            });
        }else {
            // res.status(200).json({
            //     message: 'success',
            // });
            res.redirect('back');
        }
    }

    // [GET] /admin/get-product
    async getProductDetail(req, res, next) {
        const productListPromise = new Promise((resolve, reject) => {
            Products.get_all_for_ad((productList) => {
                resolve(productList);
            });
        });
        const getCategoryPromise = new Promise((resolve, reject) => {
            Categories.get_all((categoryList) => {
                resolve(categoryList);
            });
        });
        const getStockPromise = (idProduct) => {
            return new Promise((resolve, reject) => {
                Stock.getStockViaId(idProduct, (stock) => {
                    resolve(stock);
                })
            });
        }

        var categoryList = await getCategoryPromise;
        categoryList = Object.values(JSON.parse(JSON.stringify(categoryList)));

        var productList = await productListPromise;
        productList = Object.values(JSON.parse(JSON.stringify(productList)));

        res.render('admin/products.hbs', {
            layout: 'admin-main.hbs',
            products: productList,
            categories: categoryList,
            all_product: 'active',
        });
    }

    // [GET] /admin/add-product
    async addProduct(req, res, next) {
        const getCategoryPromise = new Promise((resolve, reject) => {
            Categories.get_all((categoryList) => {
                resolve(categoryList);
            });
        });
        var categoryList = await getCategoryPromise;
        categoryList = Object.values(JSON.parse(JSON.stringify(categoryList)));

        res.render('admin/add-product.hbs', {
            layout: 'admin-main.hbs',
            add_product: 'active',
            categories: categoryList,
        });
    }

    // [GET] /admin/update-product/:slug
    async updateProduct(req, res, next) {
        const slug = req.params.slug;
        
        const getCategoryPromise = new Promise((resolve, reject) => {
            Categories.get_all((categoryList) => {
                resolve(categoryList);
            });
        });
        const getProductPromise = new Promise((resolve, reject) => {
            Products.get_pro_via_slug(slug, (product) => {
                resolve(product);
            });
        });
        const getStockPromise = (idProduct) => {
            return new Promise((resolve, reject) => {
                Stock.getStockViaId(idProduct, (stock) => {
                    resolve(stock);
                })
            });
        }
        var categoryList = await getCategoryPromise;
        categoryList = Object.values(JSON.parse(JSON.stringify(categoryList)));
        var product = await getProductPromise;
        product = Object.values(JSON.parse(JSON.stringify(product)));
        console.log(product);
        var stock = await getStockPromise(product[0].PRODUCT_ID);
        console.log(stock);
        res.render('admin/update-product.hbs', {
            layout: 'admin-main.hbs',
            all_product: 'active',
            categories: categoryList,
            product,
            stock: stock[0],
        });
    }

    // [POST] /admin/add-product
    async saveProduct(req, res, next) {
        const backURL=req.header('Referer') || '/';
        const data = req.body;
        var timestamp = '';
        let date_ob = new Date();
        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth()+1)).slice(-2);
        let year = date_ob.getFullYear();
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();

        timestamp = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
        data.quantity_product = [data.quantity_product, timestamp];
        // Config your options
        const options = {
            replacement: '-', // replace spaces with replacement character, defaults to `-`
            remove: undefined, // remove characters that match regex, defaults to `undefined`
            lower: true, // convert to lower case, defaults to `false`
            strict: true, // strip special characters except replacement, defaults to `false`
            locale: 'vi', // language code of the locale to use
        };

        const slug_product = slugify(req.body.name_product, options);
        data.slug_product = slug_product;

        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.files) {
            return res.send('Please select an image to upload');
        }

        const files = req.files;
        const image_list = [];
        let index, len;

        // Loop through all the uploaded images and display them on frontend
        for (index = 0, len = files.length; index < len; ++index) {
            const item = [];
            item.push(`/img/products/${files[index].filename}`);
            item.push(data.name_product);
            image_list.push(item);
        }
        data.image_list = image_list;
        console.log(data);

        const getCategoryPromise = new Promise((resolve, reject) => {
            Categories.get_all((categoryList) => {
                resolve(categoryList);
            });
        });
        var categoryList = await getCategoryPromise;
        categoryList = Object.values(JSON.parse(JSON.stringify(categoryList)));

        Products.add_new(data, function(response) {

        });
        res.render('admin/add-product.hbs', {
            layout: 'admin-main.hbs',
            add_product: 'active',
            categories: categoryList,
            save_product_status: 'success',
        });
    }

    // [POST] /admin/upload
    async uploadImage(req, res, next) {
        try {
            fs.readFile(req.files.upload.path, function(err, data) {
                var newPath = path.resolve(__dirname, '../../public') + '/img/description/' + req.files.upload.name;

                fs.writeFile(newPath, data, function(err) {
                    if(err) {
                    }else {
                        let fileName = req.files.upload.name;
                        let url = '/img/description/' + fileName;
                        let msg = 'Upload successfully';
                        let funcNum = req.query.CKEditorFuncNum;
                        // console.log(url, msg, funcNum);

                        res.status(201).send("<script>window.parent.CKEDITOR.tools.callFunction('"+funcNum+"','"+url+"', '"+msg+"');</script>");
                    }
                })
            })
        }catch(err) {
            console.log(err);
        }
    }

    
}

module.exports = new AdminController();
