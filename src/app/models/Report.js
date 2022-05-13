const db = require('../../config/db');

const Report = function() {
    
}

Report.reportCommon = async function(result) {
    const stmt = `call reportCommon();`;

    db.query(stmt, function(err, data) {
        if(err) {
            result(err);
        }else {
            data = Object.values(JSON.parse(JSON.stringify(data)));

            result(data);
        }
    });
}

module.exports = Report;
