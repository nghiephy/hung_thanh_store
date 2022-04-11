const db = require('../../config/db');

const User = function(User) {
    this.user_id = User.user_id;
    this.username = User.username;
    this.password = User.password;
    this.active = User.active;
    this.user_type = User.user_type;
    this.created_date = User.created_date;
}

User.createUser = async function(username, password, timestamp, name, email, active=true, user_type='customer') {
    let stmt = `insert into users(USERNAME, PASSWORD, ACTIVE, USER_TYPE, CREATED_DATE) values (?,?,?,?,?) `;
    let dataUser = [username, password, active, user_type, timestamp];
    let stmtCustomer = `insert into customers(USER_ID, NAME, EMAIL) values (?,?,?) `;
    let dataUserCustomer = [name, email];

    const insertUserPromise = new Promise((resolve, reject) => {
        db.query(stmt, dataUser, (err, results, fields) => {
            if(err) {
                reject(err);
            }
            resolve(results);
        });
    });

    const insertCustomerPromise = (dataUserCustomer) => {
        return new Promise((resolve, reject) => {
            db.query(stmtCustomer, dataUserCustomer, (err, results, fields) => {
                if(err) {
                    reject(err);
                }
                resolve(results);
            });
        });
    }

    try {
        const response = await insertUserPromise;
        dataUserCustomer.unshift(response.insertId);

        // db.query(stmtCustomer, dataUserCustomer, (err, results, fields) => {
        //     if(err) {
        //         console.log(err);
        //     }
        // });
        const responseCustomer = await insertCustomerPromise(dataUserCustomer);

        return {
            status: "success",
        };
    }catch(err) {
        return {
            status: "error",
        };
    }
}

User.getListUsername = async function(result) {
    db.query(`SELECT USERNAME FROM USERS`, function(err, listUser) {
        if(err) {
            result(err);
        }else {
            listUser = Object.values(JSON.parse(JSON.stringify(listUser)));

            // Convert object array to string array
            arrayUser = listUser.map(item => {
                return item.USERNAME;
            })

            result(arrayUser);
        }
    });
}

User.getListEmail = async function(result) {
    db.query(`SELECT EMAIL FROM CUSTOMERS UNION SELECT EMAIL FROM EMPLOYEES`, function(err, listEmail) {
        if(err) {
            result(err);
        }else {
            listEmail = Object.values(JSON.parse(JSON.stringify(listEmail)));

            // Convert object array to string array
            arrayEmail = listEmail.map(item => {
                return item.EMAIL;
            })

            result(arrayEmail);
        }
    });
}

User.getListUser = async function(result) {
    const stmt = "select users.*, customers.name as NAME, customers.photo as PHOTO from users join customers on users.user_id = customers.user_id union select users.*, employees.name as NAME, employees.photo as PHOTO from users join employees on users.user_id = employees.user_id";

    db.query(stmt, function(err, listUser) {
        if(err) {
            result(err);
        }else {
            listUser = Object.values(JSON.parse(JSON.stringify(listUser)));

            result(listUser);
        }
    });
}

module.exports = User;
