const db = require('../../config/db');

const Order = function (Order) {
    this.order_id = Order.order_id;
    this.employee_id = Order.employee_id;
    this.address_id = Order.address_id;
    this.buyer_id = Order.buyer_id;
    this.note = Order.note;
    this.invoice_date = Order.invoice_date;
    this.delivery_date = Order.delivery_date;
    this.total_discount = Order.total_discount;
    this.total_tax = Order.total_tax;
    this.total_price = Order.total_price;
    this.company_name = Order.company_name;
    this.com_tax_number = Order.com_tax_number;
    this.com_address = Order.com_address;
}

Order.addOrder = async function(dataOrder, dataProducts, result) {
    const time_update = dataOrder[3];
    var dataQuantityBuy = [];
    dataProducts.forEach(item => {
        const quantityItem = [
            item[0],
            item[1],
        ];
        dataQuantityBuy.push(quantityItem);
    });
    const addOrderPromise = new Promise((resolve, reject) => {
        if(dataOrder.length === 6) {
            db.query(`INSERT INTO ORDERS(ADDRESS_ID, BUYER_ID, NOTE, INVOICE_DATE, TOTAL_PRICE, CUR_STATUS) VALUES(?)`,[dataOrder], function(err, results, fields) {
                if(err) {
                    result(err);
                    return;
                }else{
                    resolve(results);
                }
            });
        }else {
            db.query(`INSERT INTO ORDERS(ADDRESS_ID, BUYER_ID, NOTE, INVOICE_DATE, TOTAL_PRICE, CUR_STATUS, COMPANY_NAME, COM_TAX_NUMBER, COM_ADDRESS) VALUES(?)`,[dataOrder], function(err, results, fields) {
                if(err) {
                    result(err);
                    return;
                }else{
                    resolve(results);
                }
            });
        }
    });

    const addOrdersProductsPromise = function(order_id, dataProducts) {
        dataProducts.forEach(item => {
            item.unshift(order_id);
        });
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO ORDERS_PRODUCTS(ORDER_ID, PRODUCT_ID, QUANTITY, PRICE) VALUES ?`,[dataProducts], function(err, results, fields) {
                if(err) {
                    result(err);
                    return;
                }else{
                    resolve(results);
                }
            });
        });
    }

    const addHistoryOrderPromise = function(order_id, time_update) {
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO ORDER_STATUS_HISTORY(ORDER_ID, ORDER_STATUS_ID, UPDATED_DATE) VALUES (${order_id}, 2, '${time_update}');`, function(err, results, fields) {
                if(err) {
                    result(err);
                    return;
                }else{
                    resolve(results);
                }
            });
        });
    }

    const updateStockPromise = new Promise((resolve, reject) => {
        var callProcedures = '';
        dataQuantityBuy.forEach(item => {
            callProcedures = callProcedures + `call updateStockAfterBuying(${item[0]},${item[1]});`;
        });
        db.query(callProcedures, function(err, results, fields) {
            if(err) {
                result(err);
                return;
            }else{
                resolve(results);
            }
        });
    });

    const addOrderResponse = await addOrderPromise;
    const addOrderProductResponse = await addOrdersProductsPromise(addOrderResponse.insertId, dataProducts);
    const addHistoryOrderResponse = await addHistoryOrderPromise(addOrderResponse.insertId, time_update);
    const updateStockResponse = await updateStockPromise;
    result(addOrderProductResponse);

}

Order.getListOrder = async function(userId, result) {
    db.query(`call getOrderList(${userId});`, function(err, orderList) {
        if(err) {
            result(err);
            return;
        }else{
            result(orderList);
        }
    });
}

Order.getAllListOrder = async function(result) {
    db.query(`call getAllOrderList();`, function(err, orderList) {
        if(err) {
            result(err);
            return;
        }else{
            result(orderList);
        }
    });
}

Order.updateStatusOrder = async function(dataUpdate, result) {
    db.query(`call updateStatusOrder(?);`,[dataUpdate], function(err, results, fields) {
        if(err) {
            result(err);
            return;
        }else{
            result(results);
        }
    });
}

Order.getNameProductsOrder = async function(userId, orderId, result) {
    db.query(`call getNameProductsOrder(${userId}, ${orderId});`, function(err, nameProducts) {
        if(err) {
            result(err);
            return;
        }else{
            result(nameProducts);
        }
    });
}

module.exports = Order;
