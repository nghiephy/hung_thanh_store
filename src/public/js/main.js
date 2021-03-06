import { loadCartHeader,loadCartListHeader, deleteCarProHeader } from './modules/header-module.js';

document.addEventListener('DOMContentLoaded', async function() {
    const instance = axios.create({
        baseURL: '/',
        timeout: 3*1000, 
        headers: {
            'Content-Type': 'application/json',
        }
    });

    handleModal();
    // deleteCarProHeader();
    formValidate();
    // loadDataHeader();
    handleClick();

    // Handle header UI when scroll
    document.addEventListener('scroll', (e) => {
        const headerTopWrapEle = document.querySelector('.header-top-wrap');
        if(window.scrollY > 0) {
            headerTopWrapEle.classList.add('d-none');
        }else{
            headerTopWrapEle.classList.remove('d-none');
        }

    })

    const accessToken = getCookie('accessToken');
    let decodedToken = null;
    if(accessToken){
        decodedToken = jwt_decode(accessToken);
    }
    
    const beforeLoginEle = document.querySelector('#header-top-config-before-login');
    const afterLoginEle = document.querySelector('#header-top-config-after-login');
    const imgEle = afterLoginEle.querySelector('.imgBox img');
    const usernameEle = afterLoginEle.querySelector('.username-user');

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
    }, err => {
        return Promise.reject(err);
    });

    instance.interceptors.response.use( (response) => {
      
        return response;
    }, err => {
        return Promise.reject(err);
    })

    // request to load page "/" first
    await instance.get('/');

    // request to load data cart & infor user if user authenticated
    if(accessToken) {
        // request to get information of user
        // display it into views
        const dataUser = await instance.get('/user/information');
        console.log(dataUser);
        if(dataUser.status === 200) {
            beforeLoginEle.classList.add('d-none');
            afterLoginEle.classList.remove('d-none');
            imgEle.setAttribute("src", `${dataUser.data.user.PHOTO!==null?dataUser.data.user.PHOTO:'/img/avatar.jpg'}`);
            usernameEle.innerHTML = dataUser.data.user.NAME;
            if(dataUser.data.user.POSITION === 'admin') {
                const manageBtn = document.querySelector("#header-top-config-item-manage");
                manageBtn.addEventListener('click', (e) => {
                    window.location.replace("/admin");
                });
            }
        }

        // request to get cart's data of user
        // store it into localStorage
        const cartResponse = await instance.post('http://localhost:3000/cart/get-cart');
        if(cartResponse.data.listProduct){
            window.localStorage.setItem('cart', JSON.stringify(cartResponse.data.listProduct));
        }
        else{
            window.localStorage.setItem('cart', JSON.stringify([]));
        }

        // request to get wishlist's data of user
        // store it into localStorage
        const wishlistResponse = await instance.post('http://localhost:3000/wishlist/get-wishlist');
        console.log(wishlistResponse);
        if(wishlistResponse.data.dataWishlist){
            window.localStorage.setItem('wishlist', JSON.stringify(wishlistResponse.data.dataWishlist));
        }
        else{
            window.localStorage.setItem('wishlist', JSON.stringify([]));
        }
        
    }

    //Update header data when login successful
    loadDataHeader();

    //Load data wishlist for user
    loadDataWishlist();

    // Listen event click delete product in header cart after get-cart-list stored in localStorage
    deleteCarProHeader();

    // Handle add product to wishlist
    handleAddWishlist();

    //Handle submit form logout button
    const buttonLogout = document.querySelector('#header-top-config-item-logout');
    buttonLogout.addEventListener('click', async (e) => {
        window.localStorage.removeItem('cart');
        window.localStorage.removeItem('wishlist');
        window.localStorage.removeItem('accessToken');
        await instance.post('http://localhost:3000/user/logout');
        window.location.replace("/");
    })

    // Load data into header layout
    function loadDataHeader() {
        loadCartHeader();
        loadCartListHeader();

        //hidden admin mode button
        if(accessToken) {
            if(decodedToken.USER_TYPE !== 'admin') {
                const adminModeBtn = document.querySelector('#header-top-config-item-manage');
                adminModeBtn.classList.add('d-none');
            }
        }
    }

    function loadDataWishlist() {
        const homeLikeBtns = document.querySelectorAll('.item-info__price-origin .like');
        const productLikeBtns = document.querySelectorAll('.like-btn');
        var wishlist = localStorage.getItem('wishlist');
        
        wishlist = JSON.parse(wishlist);
        homeLikeBtns.forEach(item => {
            const currentId = item.dataset.idProduct;
            if(wishlist.includes(Number(currentId))) {
                item.classList.add('active');
            }
        });
        if(productLikeBtns) {
            productLikeBtns.forEach(item => {
                const currentId = item.dataset.idProduct;
                if(wishlist.includes(Number(currentId))) {
                    item.classList.add('active');
                }
            });
        }
    }

    // Function handleAddWishlist
    function handleAddWishlist() {
        const heartBtns = document.querySelectorAll(".item-info__price-origin .like");
        const productLikeBtns = document.querySelectorAll('.like-btn');
        const deleteWishlistBtns = document.querySelectorAll('.wishlist-item-exit');

        heartBtns.forEach((item) => {
            item.addEventListener('click', async () => {
                if(accessToken) {
                    item.classList.toggle('active');

                    if(item.classList.contains('active')) {
                        const productId = item.dataset.idProduct;
                        const addResponse = await instance.post(`/wishlist/add/${productId}`);

                        if(addResponse.data.message === 'success') {
                            // alert("Thanh cong!");
                        }else {
                            alert("Them that bai!");
                        }
                    }else {
                        const productId = item.dataset.idProduct;
                        const deleteResponse = await instance.delete(`/wishlist/delete/${productId}`);

                        if(deleteResponse.data.message === 'success') {
                            // alert("Xoa thanh cong!");
                        }else {
                            alert("Them that bai!");
                        }
                    }
                }else {
                    alert('????ng nh???p ????? th???c hi???n ch???c n??ng n??y!');
                }
            })
        });

        productLikeBtns.forEach((item) => {
            item.addEventListener('click', async () => {
                if(accessToken) {
                    item.classList.toggle('active');

                    if(item.classList.contains('active')) {
                        const productId = item.dataset.idProduct;
                        const addResponse = await instance.post(`/wishlist/add/${productId}`);

                        if(addResponse.data.message === 'success') {
                            // alert("Thanh cong!");
                        }else {
                            alert("Them that bai!");
                        }
                    }else {
                        const productId = item.dataset.idProduct;
                        const deleteResponse = await instance.delete(`/wishlist/delete/${productId}`);

                        if(deleteResponse.data.message === 'success') {
                            // alert("Xoa thanh cong!");
                        }else {
                            alert("Them that bai!");
                        }
                    }
                }else {
                    alert('????ng nh???p ????? th???c hi???n ch???c n??ng n??y!');
                }
            })
        });

        deleteWishlistBtns.forEach(item => {
            item.addEventListener('click', async (e) => {
                const productId = item.dataset.idProduct;
                const deleteResponse = await instance.delete(`/wishlist/delete/${productId}`);

                if(deleteResponse.data.message === 'success') {
                    window.location.reload();
                }else {
                    alert("Them that bai!");
                }
            });
        });

    }

    // Handle modal display
    function handleModal() {
        const modalOverlayEle = document.querySelector('.modal__overlay');
        const modalEle = document.querySelector('.my-modal');
        const modalExitBtns = document.querySelectorAll('.modal__theme-exit');
        const modalExitBtnsBottom = document.querySelectorAll('.modal__theme-exit-button');
        const modalLabelList = document.querySelectorAll('.modal-label');
        const closeSuccessModalBtn = document.querySelector('.successful-body__button button');
        let modalItem;
        
        modalLabelList.forEach(modalLabel => {
            modalLabel.addEventListener('click', (e) => {
                const modalItemList = document.querySelectorAll('.modal__item');
                modalItem = document.getElementById(modalLabel.dataset.modalId);

                // Hidden all modal item before display new modal
                modalItemList.forEach(item => {
                    item.classList.remove('active');
                })

                modalItem.classList.add('active');
                modalEle.classList.add('active');
            })
        })

        modalOverlayEle.addEventListener('click', () => {
            modalItem.classList.remove('active');
            modalEle.classList.remove('active');
        })

        modalExitBtns.forEach(modalExitBtn => {
            modalExitBtn.addEventListener('click', () => {
                modalItem.classList.remove('active');
                modalEle.classList.remove('active');
            }) 
        })

        modalExitBtnsBottom.forEach(item => {
            item.addEventListener('click', () => {
                modalItem.classList.remove('active');
                modalEle.classList.remove('active');
            }) 
        })

        closeSuccessModalBtn.addEventListener('click', (e) => {
            modalItem.classList.remove('active');
            modalEle.classList.remove('active');
            window.location.replace("/");
        })

    }

    // Hanlde event click UI in main layout
    function handleClick() {
        const userButton = document.querySelector('#header-top-config-item-user');
        const userOptionsPopup = userButton.querySelector('.user-options-popup');

        document.addEventListener('click', (e) => {
            let targetElement = e.target;

            do {
                if(targetElement == userButton) {
                    userOptionsPopup.classList.toggle('active');
                    return;
                }
                targetElement = targetElement.parentNode;
            }while(targetElement);
            
            userOptionsPopup.classList.remove('active');
        });
    }

    function formValidate() {

        // Validate form register
        Validator({
            form: '#modal-register-form',
            formGroupSelector: '.form-group',
            errorSelector: '.form-message',
            onSubmit: function (dataForm) {
                const username = dataForm.username;
                const email = dataForm.email;

                // function check new account is exits in DB or not
                $.get(`http://localhost:3000/user/check_exits_user?username=${username}&email=${email}`, function(data, status) {
                    if(status==='success') {
                        if(data.isExitsUsername === true || data.isExitsEmail === true) {
                            if(data.isExitsUsername === true) {
                                const usernameEle = document.querySelector('#username_register');              // it's mean User's account is exits in DB
                                const inputParent = getParent(usernameEle, '.form-group');
                                const formMessageUsername = inputParent.querySelector('.form-message');
    
                                inputParent.classList.add('invalid');
                                formMessageUsername.innerHTML = "T??i kho???n ???? t???n t???i!";
                            }

                            if(data.isExitsEmail === true) {
                                const emailEle = document.querySelector('#email_register');              // it's mean User's account is exits in DB
                                const inputParent = getParent(emailEle, '.form-group');
                                const formMessageEmail = inputParent.querySelector('.form-message');
    
                                inputParent.classList.add('invalid');
                                formMessageEmail.innerHTML = "Email ???? ???????c li??n k???t v???i m???t t??i kho???n kh??c!";
                            }

                        }else {
                            $.post("http://localhost:3000/user/register", dataForm, function(data, status) {
                                if(status==='success') {
                                    window.location.replace('user/welcome');    // it's mean User's account is not exits in DB
                                }   
                            });                                             
                        }
                    }else {
                        alert("Sorry! Something went wrong!");
                    }
                });

            },
            rules: [
                Validator.isRequired('#name_register', 'Vui l??ng nh???p t??n ?????y ????? c???a b???n'),
                Validator.isRequired('#email_register'),
                Validator.isEmail('#email_register'),
                Validator.isRequired('#username_register'),
                Validator.minLength('#password_register', 6),
                Validator.isRequired('#re_password_register'),
                Validator.isConfirmed('#re_password_register', function () {
                    return document.querySelector('#modal-register-form #password_register').value
                }, 'M???t kh???u nh???p l???i kh??ng ????ng')
            ]
        })

        // Validate form login 
        Validator({
            form: '#modal-login-form',
            formGroupSelector: '.form-group',
            errorSelector: '.form-message',
            onSubmit: async function (dataForm) {
                const username = dataForm.username;
                const password = dataForm.password;

                // $.post("http://localhost:3000/user/login",{username, password}, function({data, status, backURL}) {
                    
                //     window.location.replace(backURL);

                //     const topHeaderBeforeEle = document.querySelector('#header-top-config-before-login');
                //     const topHeaderAfterEle = document.querySelector('#header-top-config-after-login');
                    
                //     topHeaderBeforeEle.classList.toggle('d-none');
                //     topHeaderAfterEle.classList.toggle('d-none');
                //     return true;
                    
                // }).fail(function(jqxhr, settings, ex) {
                //     const {data, status} = jqxhr.responseJSON;

                //     if(data.isUsernameValid===false) {
                //         const usernameEle = document.querySelector('#username_login');              // it's mean username is not exits in DB
                //         const inputParent = getParent(usernameEle, '.form-group');
                //         const formMessageUsername = inputParent.querySelector('.form-message');

                //         inputParent.classList.add('invalid');
                //         formMessageUsername.innerHTML = "T??i kho???n kh??ng t???n t???i!";
                //     }
                //     if(data.isPasswordValid===false) {
                //         const passwordEle = document.querySelector('#password_login');              // it's mean password is not correct
                //         const inputParent = getParent(passwordEle, '.form-group');
                //         const formMessageUsername = inputParent.querySelector('.form-message');

                //         inputParent.classList.add('invalid');
                //         formMessageUsername.innerHTML = "M???t kh???u kh??ng ????ng!";
                //     }
                // });

                $.ajax({
                    url: 'http://localhost:3000/user/login',
                    type: 'POST',
                    beforeSend: function(xhr) {

                    },
                    data: {username, password},
                    success: async function({data, status, backURL}) {
                        const cartList = (await instance.post('http://localhost:3000/cart/get-cart')).data.listProduct;
                        const wishlist = (await instance.post('http://localhost:3000/wishlist/get-wishlist')).data.dataWishlist;

                        window.localStorage.setItem('cart', JSON.stringify(cartList));
                        window.localStorage.setItem('wishlist', JSON.stringify(wishlist));
                       
                        if(backURL === 'http://localhost:3000/user/welcome') {
                            window.location.replace("/");
                        }else {
                            window.location.replace(backURL);
                        }
                        
                    },
                    error: function(jqxhr, settings, ex) {
                        const {data, status} = jqxhr.responseJSON;

                        if(data.isUsernameValid===false) {
                            const usernameEle = document.querySelector('#username_login');              // it's mean username is not exits in DB
                            const inputParent = getParent(usernameEle, '.form-group');
                            const formMessageUsername = inputParent.querySelector('.form-message');

                            inputParent.classList.add('invalid');
                            formMessageUsername.innerHTML = "T??i kho???n kh??ng t???n t???i!";
                        }
                        if(data.isPasswordValid===false) {
                            const passwordEle = document.querySelector('#password_login');              // it's mean password is not correct
                            const inputParent = getParent(passwordEle, '.form-group');
                            const formMessageUsername = inputParent.querySelector('.form-message');

                            inputParent.classList.add('invalid');
                            formMessageUsername.innerHTML = "M???t kh???u kh??ng ????ng!";
                        }
                    },
                });

                
                // const response = (await instance.post('/user/login', {
                //     username,
                //     password,
                // })).data;

                // console.log(response);

                // await instance.setLocalAccessToken(response.accessToken);
            },
            rules: [
                Validator.isRequired('#username_login', 'Vui l??ng nh???p t??i kho???n ????ng nh???p!'),
                Validator.isRequired('#password_login', 'Vui l??ng nh???p m???t kh???u'),
                Validator.minLength('#password_login', 6),
            ]
        }) 
    }

    // instance.setLocalCart = async (cartData) => {
    //    window.localStorage.setItem('cart', JSON.stringify(cartData));
    // }

    instance.getAccessToken = async () => {
       window.localStorage.getItem('accessToken');
    }

    instance.getLocalCart = async () => {
        return window.localStorage.getItem('cart');
    }

});

function getParent (element, selector) {
    while (element.parentElement) {
        if(element.parentElement.matches(selector)) {
            return element.parentElement
        }
        element = element.parentElement
    }
}

function loadPageFirst() {

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

function setCookie(cname,cvalue,exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}










