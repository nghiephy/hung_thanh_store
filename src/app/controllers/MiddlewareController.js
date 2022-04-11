const jwt = require('jsonwebtoken');

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
        const token = req.cookies.accessToken;

        if(token) {
            const accessToken = token.split(" ")[0];
            jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
                if(err) {
                    req.user = null;
                    return next();
                }
                req.user = user;
                next();
            });
        }else {
            next();
        }
    }
}

module.exports = new MiddlewareController();
