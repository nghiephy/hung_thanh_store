import { initAxiosInstance } from '../modules/axios-module.js';

document.addEventListener('DOMContentLoaded', function() {
    CKEDITOR.replace('description-ckeditor', {
        extraPlugins: 'filebrowser',
        filebrowserBrowseUrl: '/list',
        filebrowserUploadMethod: 'form',
        filebrowserUploadUrl: '/admin/upload',
        entities_latin: false,
        entities_greek: false,
    });

    // Initial axios instance
    const instance = axios.create({
        baseURL: '/',
        timeout: 3*1000, 
        headers: {
            'Content-Type': 'application/json',
        }
    });
    
    instance.interceptors.request.use( async (config) => {
        if(config.url.indexOf('/user/login') >=0 || config.url.indexOf('/user/refresh') >=0) {
            return config;
        }
    
        const accessToken = getCookie('accessToken');
        let decodedToken;
        if(accessToken){
            decodedToken = jwt_decode(accessToken);
    
            if(decodedToken.exp < Date.now()/1000) {
                try {
                    console.log('AccessToken het han');
                    // const responseRefresh = (await instance.post('/user/refresh'));
    
                    // $.post("http://localhost:3000/user/refresh", function(data) {
                    //     location.reload();
                    // });
    
                    await instance.post('http://localhost:3000/user/refresh');
                    
                    return config;
                }catch(err) {
                    return Promise.reject(err);
                }
            }
        }
        return config;
    }, err => {
        return Promise.reject(err);
    });
    
    instance.interceptors.response.use( (response) => {
        console.log(response);
        return response;
    }, err => {
        return Promise.reject(err);
    })

    $('#add-product-body-form').submit(function() {
        var dataDescription = CKEDITOR.instances['description-ckeditor'].getData();
        $('<input/>').attr({type:'text',name:'description_product',value: dataDescription,style:'display: none;'}).appendTo('#add-product-body-form');

        return true;
    });

    // Validate form add new product
    validateFormAddProduct();

    function validateFormAddProduct() {
        Validator({
            form: '#add-product-body-form',
            formGroupSelector: '.form-group',
            errorSelector: '.form-message',
            // onSubmit: async function (dataForm) {
            //     var data = new FormData();
            //     var fileListArray = Array.from(dataForm.images_product);
            //     // fileListArray.forEach(item => {
            //     //     data.append('images_product', item);
            //     // });
            //     // data.append("a", 1);
            //     // console.log(data);
            //     var dataDescription = CKEDITOR.instances['description-ckeditor'].getData();
            //     dataForm.images_product = fileListArray;
            //     // const {images_product, ...other} = dataForm;
            //     data = {
            //         ...dataForm,
            //         description: dataDescription,
            //     }
            //     console.log(data);
            //     // const response = await instance.post('http://localhost:3000/admin/add-product', data);
            //     // console.log(response);
                // $.ajax({
                //     type: "POST",
                //     beforeSend: function(request) {
                //       request.setRequestHeader("Content-Type", "multipart/form-data");
                //     },
                //     url: "http://localhost:3000/admin/add-product",
                //     data: data,
                //     processData: false,
                //     success: function(msg) {
                //       alert("OK");
                //     }
                //   });
            // },
            rules: [
                Validator.isRequired('#name_product', 'Vui lòng nhập tên sản phẩm'),
                Validator.isRequired('#images_product'),
                Validator.isRequired('#category_product'),
                Validator.isRequired('#basic_unit_product'),
                Validator.isRequired('#price_per_unit_product'),
                Validator.isRequired('#quantity_product'),
            ]
        })
    }

    function getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
            c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
            }
        }
        return "";
    }
    
});
