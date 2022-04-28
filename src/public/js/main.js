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
        
    }


    //Update header data when login successful
    loadDataHeader();

    // Listen event click delete product in header cart after get-cart-list stored in localStorage
    deleteCarProHeader();

    //Handle submit form logout button
    const buttonLogout = document.querySelector('#header-top-config-item-logout');
    buttonLogout.addEventListener('click', async (e) => {
        window.localStorage.removeItem('cart');
        window.localStorage.removeItem('accessToken');
        await instance.post('http://localhost:3000/user/logout');
        window.location.replace("/");
    })

    // Load data into header layout
    function loadDataHeader() {
        loadCartHeader();
        loadCartListHeader();

        //hidden admin mode button
        if(decodedToken.USER_TYPE !== 'admin') {
            const adminModeBtn = document.querySelector('#header-top-config-item-manage');
            adminModeBtn.classList.add('d-none');
        }
    } 

    // Handle modal display
    function handleModal() {
        const modalOverlayEle = document.querySelector('.modal__overlay');
        const modalEle = document.querySelector('.my-modal');
        const modalExitBtns = document.querySelectorAll('.modal__theme-exit');
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
                                formMessageUsername.innerHTML = "Tài khoản đã tồn tại!";
                            }

                            if(data.isExitsEmail === true) {
                                const emailEle = document.querySelector('#email_register');              // it's mean User's account is exits in DB
                                const inputParent = getParent(emailEle, '.form-group');
                                const formMessageEmail = inputParent.querySelector('.form-message');
    
                                inputParent.classList.add('invalid');
                                formMessageEmail.innerHTML = "Email đã được liên kết với một tài khoản khác!";
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
                Validator.isRequired('#name_register', 'Vui lòng nhập tên đầy đủ của bạn'),
                Validator.isRequired('#email_register'),
                Validator.isEmail('#email_register'),
                Validator.minLength('#password_register', 6),
                Validator.isRequired('#re_password_register'),
                Validator.isConfirmed('#re_password_register', function () {
                    return document.querySelector('#modal-register-form #password_register').value
                }, 'Mật khẩu nhập lại không đúng')
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
                //         formMessageUsername.innerHTML = "Tài khoản không tồn tại!";
                //     }
                //     if(data.isPasswordValid===false) {
                //         const passwordEle = document.querySelector('#password_login');              // it's mean password is not correct
                //         const inputParent = getParent(passwordEle, '.form-group');
                //         const formMessageUsername = inputParent.querySelector('.form-message');

                //         inputParent.classList.add('invalid');
                //         formMessageUsername.innerHTML = "Mật khẩu không đúng!";
                //     }
                // });

                $.ajax({
                    url: 'http://localhost:3000/user/login',
                    type: 'POST',
                    beforeSend: function(xhr) {

                    },
                    data: {username, password},
                    success: async function({data, status, backURL}) {
                        // $.post("http://localhost:3000/cart/get-cart", {user_id: data.user_id} ,function(data) {
                        //     window.localStorage.setItem('cart', data);
                        // });
                        await instance.post('http://localhost:3000/cart/get-cart');

                        window.localStorage.removeItem('cart');

                        window.location.replace(backURL);
                        
                    },
                    error: function(jqxhr, settings, ex) {
                        const {data, status} = jqxhr.responseJSON;

                        if(data.isUsernameValid===false) {
                            const usernameEle = document.querySelector('#username_login');              // it's mean username is not exits in DB
                            const inputParent = getParent(usernameEle, '.form-group');
                            const formMessageUsername = inputParent.querySelector('.form-message');

                            inputParent.classList.add('invalid');
                            formMessageUsername.innerHTML = "Tài khoản không tồn tại!";
                        }
                        if(data.isPasswordValid===false) {
                            const passwordEle = document.querySelector('#password_login');              // it's mean password is not correct
                            const inputParent = getParent(passwordEle, '.form-group');
                            const formMessageUsername = inputParent.querySelector('.form-message');

                            inputParent.classList.add('invalid');
                            formMessageUsername.innerHTML = "Mật khẩu không đúng!";
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
                Validator.isRequired('#username_login', 'Vui lòng nhập tài khoản đăng nhập!'),
                Validator.isRequired('#password_login', 'Vui lòng nhập mật khẩu'),
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










