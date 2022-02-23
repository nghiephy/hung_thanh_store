const siteRouter = require('./site');
const productsRouter = require('./products');

function routes(app) {
    app.use('/products', productsRouter);
    app.use('/', siteRouter);
}

module.exports = routes;
