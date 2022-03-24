const db = require('../../config/db');
const Category = function (category) {
    this.category_id = category.category_id;
    this.cat_category_id = category.cat_category_id;
    this.name = category.name;
    this.image = category.image;
    this.description = category.description;
}

Category.get_all = function (result) {
    db.query("SELECT * FROM CATEGORIES", function(err, categories) {
        if(err) {
            result(err);
        }else{
            result(categories);
        }
    });
}

module.exports = Category;
