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
        console.log("Token" + token);
      
        console.log(token);
        if(token) {
            const accessToken = token.split(" ")[0];
            jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
                // console.log(user);
                if(err) {
                    req.user = null;
                    return next();
                }
                Cart.getCartList(user.USER_ID, (products) => {
                    productsCart = JSON.parse(JSON.stringify(products[0]))
                });
                req.user = user;
                next();
            });
        }else {
            next();
        }
    }
}

module.exports = new MiddlewareController();
