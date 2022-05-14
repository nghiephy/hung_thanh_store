
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const moment = require('moment');
const User = require('../models/User');
const Address = require('../models/Address');
const fs = require('fs');
const path = require('path');

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
        {expiresIn: "3d"}
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

        // console.log(userValid);

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

        res.json({
            status: 'success',
        });
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
        const userId = req.user.USER_ID;
        var data = null;

        const getInforPromise = new Promise((resolve, reject) => {
            if(req.user.USER_TYPE == 'customer') {
                User.getFullUserInfor(userId, 'customers', (userInfor) => {
                    resolve(userInfor[0]);
                })
            }else {
                User.getFullUserInfor(userId, 'employees', (userInfor) => {
                    resolve(userInfor[0]);
                })
            }
        });
        
        data = await getInforPromise;
        const newBirthday = moment.utc(data.BIRTHDAY).format('YYYY-MM-DD');
        data.BIRTHDAY = newBirthday;
        res.status(200).json({
            user: data,
        });
    }

    //[GET] /user/address/:id
    async getAddressViaId(req, res, next) {
        const userId = req.user.USER_ID;
        const addressId = req.params.id;
 
        const getAddressPromise = new Promise((resolve, reject) => {
            Address.getAddressViaId(addressId, (addressInfor) => {
                resolve(addressInfor);
            });
        });

        try {
            var addressInfor = await getAddressPromise;
            addressInfor = Object.values(JSON.parse(JSON.stringify(addressInfor)));

            res.status(200).json({
                data: addressInfor[0],
            });
        }catch(err) {
            res.status(500).json({
                message: 'fail',
            })
        }
    }

    //[GET] /user/address
    async getAddressUser(req, res, next) {
        const userId = req.user.USER_ID;
        var data = null;
        const getInforPromise = new Promise((resolve, reject) => {
            if(req.user.USER_TYPE == 'customer') {
                User.getFullUserInfor(userId, 'customers', (userInfor) => {
                    resolve(userInfor[0]);
                })
            }else {
                User.getFullUserInfor(userId, 'employees', (userInfor) => {
                    resolve(userInfor[0]);
                })
            }
        });
        const getAddressPromise = new Promise((resolve, reject) => {
            Address.getAddress(userId, (addressList) => {
                resolve(addressList);
            });
        });

        data = await getInforPromise;
        var addressList = await getAddressPromise;
        addressList = Object.values(JSON.parse(JSON.stringify(addressList)));

        res.render('user/address.hbs', {
            layout: 'account-main.hbs',
            data_contact: data,
            address: 'active',
            addressList: addressList,
        });
    }

    //[POST] /user/add-address
    async addAddressUser(req, res, next) {
        const userId = req.user.USER_ID;
        var data = req.body;
        console.log(req.body);
        const isDefault = data.default!==''?true:false;
        var dataAddress = [
            userId,
            data.name,
            data.phone,
            data.address,
            data.ward,
            data.district,
            data.city,
            Boolean(isDefault),
        ];

        const addAddressPromise = new Promise((resolve, reject) => {
            Address.addAddress(dataAddress, (result) => {
                resolve(result);
            });
        });

        const dataResponse = await addAddressPromise;
        console.log(dataResponse);

        if(dataResponse.errno) {
            res.status(500).json({
                message: 'fail',
            });
        }else {
            res.status(200).json({
                message: 'success',
            });
        }
    }

    //[GET] /user/account
    async getAccountUser(req, res, next) {
        const userId = req.user.USER_ID;
        var data = null;
        
        const getInforPromise = new Promise((resolve, reject) => {
            if(req.user.USER_TYPE == 'customer') {
                User.getFullUserInfor(userId, 'customers', (userInfor) => {
                    resolve(userInfor[0]);
                })
            }else {
                User.getFullUserInfor(userId, 'employees', (userInfor) => {
                    resolve(userInfor[0]);
                })
            }
        });

        data = await getInforPromise;
        const newBirthday = moment.utc(data.BIRTHDAY).format('YYYY-MM-DD')
        data.BIRTHDAY = newBirthday;
        console.log(data);
        res.render('user/account.hbs', {
            layout: 'account-main.hbs',
            data_contact: data,
            account: 'active',
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

    //[PUT] /user/update-account
    async updateAccountUser(req, res, next) {
        var avatarPath = '';
        const dataPayload = req.body;
        var dataUser = [];
        var pathOldAvatar = path.resolve(__dirname, '../../public') + dataPayload.path_old_avatar;
        dataUser.push(req.user.USER_ID);

        var timestamp = '';
        let date_ob = new Date();
        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth()+1)).slice(-2);
        let year = date_ob.getFullYear();
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();

        timestamp = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;

        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.file) {
            avatarPath = dataPayload.path_old_avatar;
        }else{
            avatarPath = "/img/users/" + req.file.filename;

            fs.unlink(pathOldAvatar, (err) => {
                if (err) {
                console.error(err);
                return;
                }
            });
        }

        if(req.user.USER_TYPE === 'customer') {
            dataUser.push('customers');
        }else {
            dataUser.push('employees');
        }

        const dataCustomer = [
            dataPayload.name_account,
            dataPayload.birthday_account,
            dataPayload.email_account,
            Boolean(dataPayload.gender_account),
            avatarPath,
            dataPayload.phone_account,
            dataPayload.company_name_account,
            dataPayload.tax_number_account,
            dataPayload.address_invoice_account,
            timestamp
        ];
        dataUser = dataUser.concat(dataCustomer);

        console.log("Check data account >>>>");
        console.log(req.body);
        console.log("Check data user >>>>");
        console.log(dataUser);
        
        try {
            User.updateCustomerInfor(dataUser, (response) => {
                console.log(response);
            });

            res.status(200).json({
                message: 'success',
            });
        }catch(err) {
            res.status(500).json({
                message: 'fail',
            });
        }
    }

    //[PUT] /user/update-address/:id
    async updateAddress(req, res, next) {
        const addressId = req.params.id;
        const data = req.body;
        var timestamp = '';
        let date_ob = new Date();
        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth()+1)).slice(-2);
        let year = date_ob.getFullYear();
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();

        timestamp = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;

        var dataAddress = [
            addressId,
            data.name,
            data.phone,
            data.address,
            data.ward,
            data.district,
            data.city,
            Boolean(data.default!==''?true:false),
            timestamp,
        ];

        const updateAddressPromise = new Promise((resolve, reject) => {
            Address.updateAddress(dataAddress, function(result) {
                resolve(result);
            })
        });

        const dataResponse = await updateAddressPromise;

        if (dataResponse.errno) {
            res.status(500).json({
                message: 'fail',
            });
        }else {
            res.status(200).json({
                message: 'success',
            });
        }
    }

    //[DELETE] /user/delete-address/:id
    async deleteAddress(req, res, next) {
        const addressId = req.params.id;
        
        const deleteAddressPromise = new Promise((resolve, reject) => {
            Address.deleteAddress(addressId, function(result) {
                resolve(result);
            })
        });

        const dataResponse = await deleteAddressPromise;

        if (dataResponse.errno) {
            res.status(500).json({
                message: 'fail',
            });
        }else {
            res.status(200).json({
                message: 'success',
            });
        }
    }
}

module.exports = new UsersController();
