const siteRouter = require('./site');
const productsRouter = require('./products');
const categoriesRouter = require('./categories');
const usersRouter = require('./users');
const adminRouter = require('./admin');
const cartsRouter = require('./carts');
const wishlistRouter = require('./wishlist');
const ordersRouter = require('./orders');

function routes(app) {
    app.use('/products', productsRouter);
    app.use('/categories', categoriesRouter);
    app.use('/user', usersRouter);
    app.use('/manage-order', ordersRouter);
    app.use('/cart', cartsRouter);
    app.use('/wishlist', wishlistRouter);
    app.use('/admin', adminRouter);
    app.use('/', siteRouter);
}

module.exports = routes;
