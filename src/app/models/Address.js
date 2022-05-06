const db = require('../../config/db');

const Address = function(Address) {
    this.address_id = Address.address_id;
    this.user_id = Address.user_id;
    this.name = Address.name;
    this.phone = Address.phone;
    this.address = Address.address;
    this.ward = Address.ward;
    this.district = Address.district;
    this.city = Address.city;
    this.update = Address.update;
}

Address.addAddress = async function(dataAddress, result) {
    if(dataAddress[dataAddress.length-1] === true) {
        db.query(`update address set address.ISDEFAULT = false where address.ISDEFAULT = true;`, function(err, results, fields) {
        if(err) {
            result(err);
        }
    });
    }

    db.query(`insert into address(user_id, name, phone, address, ward, district, city, isdefault)
                values(?,?,?,?,?,?,?,?)`,dataAddress, function(err, results, fields) {
        if(err) {
            result(err);
        }else {
            result(results);
        }
    });
}

Address.getAddress = async function(userId, result) {
    db.query(`select * from address where user_id = ${userId} order by isdefault desc;`, function(err, addressList) {
        if(err) {
            result(err);
        }else {
            result(addressList);
        }
    });
}

Address.getAddressViaId = async function(addressId, result) {
    db.query(`select * from address where address_id = ${addressId};`, function(err, addressInfor) {
        if(err) {
            result(err);
        }else {
            result(addressInfor);
        }
    });
}

Address.updateAddress = async function(dataAddress, result) {
    if(dataAddress[dataAddress.length-2] === true) {
        db.query(`update address set address.ISDEFAULT = false where address.ISDEFAULT = true;`, function(err, results, fields) {
        if(err) {
            result(err);
        }
    });
    }

    db.query('call updateAddress(?)', [dataAddress], function(err, results, fields) {
        if(err) {
            result(err);
        }else {
            result(results);
        }
    });
}

Address.deleteAddress = async function(addressId, result) {
    db.query('delete from address where address.address_id = ?', addressId, function(err, results, fields) {
        if(err) {
            result(err);
        }else {
            result(results);
        }
    });
}


module.exports = Address;
