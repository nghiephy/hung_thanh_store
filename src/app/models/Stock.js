const db = require('../../config/db');

const Stock = function(Stock) {
    this.stock_id = Stock.stock_id;
    this.product_id = Stock.product_id;
    this.quantity = Stock.quantity;
    this.created_at = Stock.created_at;
    this.modified_at = Stock.modified_at;
    this.deleted_at = Stock.deleted_at;
}

Stock.getStockViaId = async function(idProduct, result) {
    const stmt = `select stock.* from stock join products on stock.product_id = products.product_id where stock.product_id=${idProduct}`;

    db.query(stmt, function(err, stock) {
        if(err) {
            result(err);
        }else {
            stock = Object.values(JSON.parse(JSON.stringify(stock)));

            result(stock);
        }
    });
}

Stock.importStock = async function(stockId, quantity, updatedAt, result) {
    const stmt = `update stock set stock.QUANTITY = stock.QUANTITY + ${quantity}, stock.UPDATED_AT = '${updatedAt}' WHERE stock.STOCK_ID = ${stockId};`;

    db.query(stmt, function(err, results, fields) {
        if(err) {
            result(err);
        }else {
            result(results);
        }
    });
}

module.exports = Stock;
