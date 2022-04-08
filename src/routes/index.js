const siteRouter = require('./site');
const productsRouter = require('./products');
const categoriesRouter = require('./categories');
const usersRouter = require('./users')

function routes(app) {
    app.use('/products', productsRouter);
    app.use('/categories', categoriesRouter);
    app.use('/user', usersRouter);
    app.use('/', siteRouter);
}

module.exports = routes;
