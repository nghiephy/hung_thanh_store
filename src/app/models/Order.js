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
    const addOrderPromise = new Promise((resolve, reject) => {
        if(dataOrder.length === 5) {
            db.query(`INSERT INTO ORDERS(ADDRESS_ID, BUYER_ID, NOTE, INVOICE_DATE, TOTAL_PRICE) VALUES(?)`,[dataOrder], function(err, results, fields) {
                if(err) {
                    result(err);
                    return;
                }else{
                    resolve(results);
                }
            });
        }else {
            db.query(`INSERT INTO ORDERS(ADDRESS_ID, BUYER_ID, NOTE, INVOICE_DATE, TOTAL_PRICE, COMPANY_NAME, COM_TAX_NUMBER, COM_ADDRESS) VALUES(?)`,[dataOrder], function(err, results, fields) {
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

    const addOrderResponse = await addOrderPromise;
    const addOrderProductResponse = await addOrdersProductsPromise(addOrderResponse.insertId, dataProducts);
    const addHistoryOrderResponse = await addHistoryOrderPromise(addOrderResponse.insertId, time_update);
    result(addOrderProductResponse);

}

module.exports = Order;
