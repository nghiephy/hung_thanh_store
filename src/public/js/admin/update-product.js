document.addEventListener('DOMContentLoaded', function()  {
    const afterLoginEle = document.querySelector('#admin-header-after-login');
    const imgEle = afterLoginEle.querySelector('.imgBox img');
    const usernameEle = afterLoginEle.querySelector('.username-user');
    const imageDeleteBtns = document.querySelectorAll('.images_product-item__delete');
    var deleteImageList = [];

    $(document).ready(function(){
        $(".owl-carousel.images_product-slider").owlCarousel({
            loop:true,
            margin:10,
            responsiveClass:true,
            dots: false,
            responsive:{
                0:{
                    items:1,
                    nav:true
                },
                600:{
                    items:3,
                    nav:true
                },
                1000:{
                    items:6,
                    nav:true,
                    loop:false
                }
            }
        });
    });
    
    CKEDITOR.replace('update-description-ckeditor', {
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

    const accessToken = getCookie('accessToken');
    let decodedToken = null;
    if(accessToken){
        decodedToken = jwt_decode(accessToken);
    }
    if(decodedToken !== null && decodedToken.ACTIVE===1) {
        imgEle.setAttribute("src", `${decodedToken.PHOTO!==null?decodedToken.PHOTO:'/img/avatar.jpg'}`);
        usernameEle.innerHTML = decodedToken.NAME;
    }
    
    instance.interceptors.request.use( 
        async (config) => {
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
       
                        const {accessToken} = (await instance.post('http://localhost:3000/user/refresh')).data;
                        // window.localStorage.setItem('accessToken', accessToken);
                        config.headers = {
                            'token': accessToken,
                        }
                        // location.reload();

                        return config;
                    }catch(err) {
                        return Promise.reject(err);
                    }
                }
            }

            return config;
        }, (err) => {
            return Promise.reject(err);
    });

    instance.interceptors.response.use( 
        async (response) => {
            console.log(response);

            return response;
        }, async (err) => {
            const originalConfig = err.config;
            if (err.response) {
                // Access Token was expired
                if (err.response.status === 401 && !originalConfig._retry) {
                    originalConfig._retry = true;
                    try {
                        const rs = await instance.post('http://localhost:3000/user/refresh');
                        const { accessToken } = rs.data;

                        return instance(originalConfig);
                    } catch (_error) {
                        if (_error.response && _error.response.data) {
                            return Promise.reject(_error.response.data);
                        }
                        return Promise.reject(_error);
                    }
                }
                if (err.response.status === 403 && err.response.data) {
                    return Promise.reject(err.response.data);
                  }
            }
            return Promise.reject(err);
    });

    // Hanlde get list image deleted
    imageDeleteBtns.forEach(imageDeleteBtn => {
        imageDeleteBtn.addEventListener('click', (e) => {
            const idImage = imageDeleteBtn.dataset.idImage;
            const imageItem = getParent(imageDeleteBtn, '.images_product-item');
            const imgEle = imageItem.querySelector('img');
            const imgPath = imgEle.getAttribute('src');
            const owlItem = getParent(imageItem, '.owl-item');
            deleteImageList.push({
                idImage,
                imgPath,
            });
            owlItem.classList.add('d-none');
        });
    });

    // Validate form add new product
    validateFormAddProduct();

    function validateFormAddProduct() {
        Validator({
            form: '#update-product-body-form',
            formGroupSelector: '.form-group',
            errorSelector: '.form-message',
            onSubmit: async function (dataForm) {
                var dataDescription = CKEDITOR.instances['update-description-ckeditor'].getData();
                var idProduct = $('#update_product_id').attr('value');
                $('<input/>').attr({type:'text',name:'description_product',value: dataDescription,style:'display: none;'}).appendTo('#update-product-body-form');
                const form = document.querySelector('#update-product-body-form');
                const formData = new FormData(form);
                formData.append('images_delete_list', JSON.stringify(deleteImageList));

                const dataResponse = await instance.put(`/admin/update-product/${idProduct}`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                console.log(dataResponse);
                if(dataResponse.data.message === 'success') {
                    // location.replace(dataResponse.request.responseURL);
                    const modal = document.querySelector('.my-modal');
                    const modalItemSuccess = document.querySelector('#modal-successful');
                    const closeBtn = modalItemSuccess.querySelector('.successful-body__button');
                    const titleModal = modalItemSuccess.querySelector('.successful-body__title h2');
                    const messageModal = modalItemSuccess.querySelector('.successful-body__message p');

                    titleModal.innerHTML = "Cập nhật sản phẩm thành công!";
                    messageModal.innerHTML = "Kiểm tra lại thông tin sau khi đã cập nhật!";

                    modal.classList.add('active');
                    modalItemSuccess.classList.add('active');
                    closeBtn.addEventListener('click', e => {
                        window.location.reload();
                    });
                }else {
                    alert("Them san pham that bai!");
                }
            },
            rules: [
                Validator.isRequired('#name_product', 'Vui lòng nhập tên sản phẩm'),
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

    function getParent (element, selector) {
        while (element.parentElement) {
            if(element.parentElement.matches(selector)) {
                return element.parentElement
            }
            element = element.parentElement
        }
    }

});