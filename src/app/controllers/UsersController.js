
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const User = require('../models/User');

dotenv.config();

class UsersController {

    //[POST] /user/register
    async registerUser(req, res, next) {
        const backURL=req.header('Referer') || '/';
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(req.body.password, salt);

        const username = req.body.username;
        const name = req.body.name;
        const email = req.body.email;
        const password = hashed;
        var timestamp = '';

        let date_ob = new Date();
        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth()+1)).slice(-2);
        let year = date_ob.getFullYear();
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();

        timestamp = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;

        // User.createUser(username, password, timestamp);
        const response = User.createUser(username, password, timestamp, name, email);
        response
            .then((data) => {
                if(data.status === 'error') {
                    res.status(500).json({
                        Error: "Can not insert into database!!",
                    });
                }else{
                    res.render("user/welcome.hbs", {
                        username: username, 
                        email: email,
                        timestamp: timestamp,
                    });
                }
            })
            .catch((err) => {
                res.status(500).json({
                    Error: err,
                });
            })

        // if(response.status === 'error') {
        //     res.status(500).json({
        //         Error: "Can not insert into database!!",
        //     });
        // }else {
        //     res.render("user/welcome.hbs", {
        //         username: username, 
        //         email: email,
        //         timestamp: timestamp,
        //     });
        // }
    
    }

    // Generate access token
    generateAccessToken(dataUser) {
        return jwt.sign({
            ...dataUser
        },
        process.env.JWT_ACCESS_KEY,
        {expiresIn: "30s"}
        );
    } 

    // Generate refresh token
    generateRefreshToken(dataUser) {
        return jwt.sign({
            ...dataUser
        },
        process.env.JWT_REFRESH_KEY,
        {expiresIn: "365d"}
        );
    }

    //[POST] /user/login 
    async loginUser(req, res, next) {
        const backURL=req.header('Referer') || '/';
        const username = req.body.username;
        const password = req.body.password;

        const checkUserVliadPromise = new Promise((resolve, reject) => {
            User.getListUser(async (listUser) => {
                const data = {
                    isPasswordValid: false,
                };
                var userIndex = 0;

                if(listUser.some((user, index) => {
                    userIndex = index;
                    return user.USERNAME === username;
                })) {
                    data.isUsernameValid = true;

                    const isPass = await bcrypt.compare(
                        password,
                        listUser[userIndex].PASSWORD
                    );

                    if(isPass) {
                        data.isPasswordValid = true;

                        const {PASSWORD, ...other} = listUser[userIndex];
                        data.dataUser = other;
                    }
                }else {
                    data.isUsernameValid = false;
                }

                resolve(data);
            });
        });

        const userValid = await checkUserVliadPromise;

        console.log(userValid);

        if(userValid.isUsernameValid && userValid.isPasswordValid) {
            const controllerObj = new UsersController();
            const accessToken = controllerObj.generateAccessToken(userValid.dataUser);
            const refreshToken = controllerObj.generateRefreshToken(userValid.dataUser);

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict",
            });

            res.cookie("accessToken", accessToken, {
                httpOnly: false,
                secure: false,
                path: "/",
                sameSite: "strict",
            });

            // res.render('user/welcome');
            res.status(200).json({
                data: userValid.dataUser,
                status: 'success',
                backURL,
            });
        }else {
            const isUsernameValid = userValid.isUsernameValid;
            const isPasswordValid = userValid.isPasswordValid;
            res.status(401).json({data: {isUsernameValid, isPasswordValid}, status: 'fail'});
        }

    }

    //[POST] /user/logout
    async logoutUser(req, res, next) {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        res.redirect("/");
    }

    //[GET] /user/check_exits_user
    async checkExitsUser(req, res, next) {
        const username = req.query.username;
        const email = req.query.email;

        const getUsernamesPromise = new Promise((resolve, reject) => {
            User.getListUsername(function(listUser) {
                const isExits = listUser.includes(username);

                if(isExits) {
                    resolve({isExitsUsername: true});
                }else {
                    resolve({isExitsUsername: false});
                }
            });
        });

        const getEmailsPromise = new Promise((resolve, reject) => {
            User.getListEmail(function(listEmail) {
                const isExits = listEmail.includes(email);

                if(isExits) {
                    resolve({isExitsEmail: true});
                }else {
                    resolve({isExitsEmail: false});
                }
            });
        });

        const responseUsername = await getUsernamesPromise;
        const responseEmail = await getEmailsPromise;
        
        res.status(200).json({
            ...responseUsername,
            ...responseEmail
        });

        // User.getListUser(function(listUser) {
        //     const isExits = listUser.includes(username);

        //     if(isExits) {
        //         res.status(200).json({
        //             isExits: true,
        //         });
        //     }else {
        //         res.status(200).json({
        //             isExits: false,
        //         });
        //     }
        // })
    }

    //[GET] /user/welcome
    async welcomeUser(req, res, next) {
        console.log(req.headers);
        res.render('user/welcome.hbs');
    }

    //[GET] /user/information
    async getInforUser(req, res, next) {
        res.status(200).json({
            data: req.user,
        });
    }

    //[POST] /user/refresh
    requestRefreshToken(req, res, next) {
        //Take refresh token from user
        const refreshToken = req.cookies.refreshToken;

        if(!refreshToken) return res.status(401).json("You are not authenticated!");
        jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
            if(err) {
                return console.log(err);
            }
            const {iat, exp, ...dataUser} = user;
            // Create new accessToken and refreshToken
            const controllerObj = new UsersController();
            const newAccessToken = controllerObj.generateAccessToken(dataUser);
            const newRefreshToken = controllerObj.generateRefreshToken(dataUser);

            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict",
            });
            res.cookie("accessToken", newAccessToken, {
                httpOnly: false,
                secure: false,
                path: "/",
                sameSite: "strict",
            });

            res.status(200).json({accessToken: newAccessToken});
        });
    }
}

module.exports = new UsersController();
