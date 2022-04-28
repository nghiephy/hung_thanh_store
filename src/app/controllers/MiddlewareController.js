const jwt = require('jsonwebtoken');
const Cart = require('../models/Cart');

class MiddlewareController {

    // Verify token
    verifyToken(req, res, next) {
        const token = req.headers.accessToken;

        if(token) {
            const accessToken = token.split(" ")[1];
            jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
                if(err) {
                    res.status(403).json("Token is not valid");
                }
                req.user = user;
                console.log(req.user);
                next();
            });
        }else {
            res.status(401).json("You're not authenticated");
        }
    }

    // Verify user login or not 
    verifyUserLogin(req, res, next) {
        const token = req.headers.token || req.cookies.accessToken;
        var productsCart=null;
      
        // console.log("Middleware check >>>");
        // console.log(req.headers);
        if(token) {
            const accessToken = token.split(" ")[0];
            jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
                console.log(user);
                if(err) {
                    req.user = null;
                    return next();
                    // res.status(401).json({
                    //     message: "You're not authenticated!",
                    // });
                }
                
                Cart.getCartList(user.USER_ID, (products) => {
                    productsCart = JSON.parse(JSON.stringify(products[0]))
                });
                req.user = user;
                // if(user.USER_TYPE === 'admin' && req.originalUrl !== '/user/account') {
                //     console.log('OK');
                //     res.redirect('/admin');
                //     return;
                // }
                next();
            });
        }else {
            next();
        }
    }

    // Verify admin login
    verifyAdminLogin(req, res, next) {
        const token = req.headers.token || req.cookies.accessToken;
        var productsCart=null;
      
        if(token) {
            const accessToken = token.split(" ")[0];
            jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
                // console.log(user);
                if(err || user.USER_TYPE !== 'admin') {
                    res.status(401).json({
                        message: "You're not authenticated!",
                    });
                }
                Cart.getCartList(user.USER_ID, (products) => {
                    productsCart = JSON.parse(JSON.stringify(products[0]))
                });
                req.user = user;
                next();
            });
        }else {
            res.status(401).json({
                message: "You're not authenticated!",
            });
        }
    }
}

module.exports = new MiddlewareController();
