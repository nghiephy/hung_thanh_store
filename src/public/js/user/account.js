
document.addEventListener('DOMContentLoaded', function() {
    const avatarImgEle = document.querySelector('#block-account__imgAvatar');
    const pathOldAvatar = avatarImgEle.getAttribute('src');

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

                    const {accessToken} = (await instance.post('http://localhost:3000/user/refresh')).data;
                    config.headers = {
                        'token': accessToken,
                    }
                    
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

    formValidate();
    handleClick();

    async function handleClick() {
        const inputAvatarEle = document.querySelector('#avatar-upload');
        const imgAvatarEle = document.querySelector('#block-account__imgAvatar');

        // Handle review avatar before save in DB
        inputAvatarEle.onchange = (event) => {
            const [file] = inputAvatarEle.files;
            if(file) {
                imgAvatarEle.src = URL.createObjectURL(file);
            }
        }
    }

    async function formValidate() {
    
        Validator({
            form: '#account-detail-form',
            formGroupSelector: '.form-group',
            errorSelector: '.form-message',
            onSubmit: async function (dataForm) {
                console.log(dataForm);
                
                const form = document.querySelector('#account-detail-form');
                const formData = new FormData(form);

                formData.append('path_old_avatar', pathOldAvatar);
                const response = await instance.put('/user/update-account', formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                if(response.data.message === 'success') {
                    // location.replace(dataResponse.request.responseURL);
                    const modal = document.querySelector('.my-modal');
                    const modalItemSuccess = document.querySelector('#modal-successful');
                    const closeBtn = modalItemSuccess.querySelector('.successful-body__button');
                    const exitBtn = modalItemSuccess.querySelector('.modal__theme-exit');
                    const messageEle = modalItemSuccess.querySelector('.successful-body__message p');
                    const titleEle = modalItemSuccess.querySelector('.successful-body__title h2');

                    titleEle.innerHTML = "Cập nhật tài khoản thành công!";
                    messageEle.innerHTML = "";
                    modal.classList.add('active');
                    modalItemSuccess.classList.add('active');
                    closeBtn.addEventListener('click', e => {
                        window.location.reload();
                    });
                    exitBtn.addEventListener('click', e => {
                        window.location.reload();
                    });
                }else {
                    alert("Them san pham that bai!");
                }

            },
            rules: [
                Validator.isRequired('#name-account', 'Vui lòng nhập họ tên của bạn!'),
                Validator.isRequired('#email-account', 'Vui lòng nhập email của bạn!'),
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
