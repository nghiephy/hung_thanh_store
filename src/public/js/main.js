import { loadCartHeader,loadCartListHeader, deleteCarProHeader } from './modules/header-module.js';

document.addEventListener('DOMContentLoaded', function() {
    handleModal();
    loadDataHeader();
    deleteCarProHeader();
    formValidate();

    // Load data into header layout
    function loadDataHeader() {
        loadCartHeader();
        loadCartListHeader();
    } 

    // Handle modal display
    function handleModal() {
        const modalOverlayEle = document.querySelector('.modal__overlay');
        const modalEle = document.querySelector('.modal');
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
            onSubmit: function (dataForm) {
                const username = dataForm.username;
                const password = dataForm.password;

                console.log(dataForm);
            },
            rules: [
                Validator.isRequired('#username_login', 'Vui lòng nhập tài khoản đăng nhập!'),
                Validator.isRequired('#password_login', 'Vui lòng nhập mật khẩu'),
                Validator.minLength('#password_login', 6),
            ]
        }) 
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




