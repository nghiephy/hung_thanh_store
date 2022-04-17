var Categories = require('../models/Category');
var Products = require('../models/Product');
var Carts = require('../models/Cart');
const multipart = require('connect-multiparty');
const fs = require('fs');
const path = require('path');

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

        var productList = await productListPromise;
        productList = Object.values(JSON.parse(JSON.stringify(productList)));

        res.render('admin/products.hbs', {
            layout: 'admin-main.hbs',
            products: productList,
            all_product: 'active',
        });
    }

    // [GET] /admin/add-product
    async addProduct(req, res, next) {

        res.render('admin/add-product.hbs', {
            layout: 'admin-main.hbs',
            add_product: 'active',
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
