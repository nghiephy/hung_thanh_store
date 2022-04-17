
document.addEventListener('DOMContentLoaded', function() {
    CKEDITOR.replace('description-ckeditor', {
        extraPlugins: 'filebrowser',
        filebrowserBrowseUrl: '/list',
        filebrowserUploadMethod: 'form',
        filebrowserUploadUrl: '/admin/upload',
    });

    const test = document.querySelector("#test");

    // test.addEventListener('click', () => {
    //     var data = CKEDITOR.instances['description-ckeditor'].getData();
    //     console.log(data);
    // });

    // Validate form add new product
    validateFormAddProduct();

    function validateFormAddProduct() {
        Validator({
            form: '#add-product-body-form',
            formGroupSelector: '.form-group',
            errorSelector: '.form-message',
            onSubmit: function (dataForm) {
                var dataDescription = CKEDITOR.instances['description-ckeditor'].getData();
                console.log(dataDescription);
                var data = {
                    ...dataForm,
                    description: dataDescription,
                }
                console.log(data);
            },
            rules: [
                Validator.isRequired('#name_product', 'Vui lòng nhập tên sản phẩm'),
                Validator.isRequired('#images_product'),
                Validator.isRequired('#category_product'),
                Validator.isRequired('#basic_unit_product'),
                Validator.isRequired('#price_per_unit_product'),
            ]
        })
    }
    
});
