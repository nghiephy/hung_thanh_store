const jwt = require('jsonwebtoken');

class MiddlewareController {

    // Verify token
    verifyToken(req, res, next) {
        const token = req.headers.token;

        console.log(token);
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
}

module.exports = new MiddlewareController();
