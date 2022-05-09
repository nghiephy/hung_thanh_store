var Categories = require('../models/Category');
var Products = require('../models/Product');
var Cart = require('../models/Cart');
var Address = require('../models/Address');
var Order = require('../models/Order');
const User = require('../models/User');
const moment = require('moment');

class OrdersController {
    // [GET] /manage-order
    async index(req, res, next) {
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
        const getOrderList = new Promise((resolve, reject) => {
            Order.getListOrder(userId, (orderList) => {
                resolve(orderList);
            });
        });
        

        data = await getInforPromise;
        var orderList = await getOrderList;
        orderList = Object.values(JSON.parse(JSON.stringify(orderList[0])));

        var i;
        for(i=0; i<orderList.length; i++) {
            orderList[i].INVOICE_DATE = moment.utc(orderList[i].INVOICE_DATE).format('YYYY-MM-DD');
            orderList[i].UPDATED_DATE = moment.utc(orderList[i].UPDATED_DATE).format('YYYY-MM-DD');

            const getNamesPromise = new Promise((resolve, reject) => {
                Order.getNameProductsOrder(userId,  orderList[i].ORDER_ID, (nameProducts) => {
                    resolve(nameProducts);
                });
            });
            const getNameResponse = await getNamesPromise;
            var listName = JSON.parse(JSON.stringify(getNameResponse[0]));
            listName = listName.map((element, index, array) => {
                return element.NAME;
            })
            orderList[i].NAME_PRODUCTS = listName;
        }

        console.log(orderList);

        res.render('user/order-list.hbs', {
            layout: 'account-main.hbs',
            data_contact: data,
            order: 'active',
            orderList
        });
    }
}

module.exports = new OrdersController();
