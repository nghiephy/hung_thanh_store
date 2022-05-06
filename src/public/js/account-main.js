document.addEventListener('DOMContentLoaded', function() {
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
    });

    formValidate();

    async function formValidate() {

        Validator({
            form: '#add-address-body-form',
            formGroupSelector: '.form-group',
            errorSelector: '.form-message',
            onSubmit: async function (dataForm) {
                const dataRespon = await instance.post('/user/add-address', dataForm);

                if(dataRespon.data.message === 'success') {
                    var myModal = new bootstrap.Modal(document.getElementById('modal-add-success'), {
                        keyboard: false
                    });
                    myModal.show();
                    var modalAddSuccess = document.getElementById('modal-add-success');
                    modalAddSuccess.addEventListener('hide.bs.modal', function(event) {
                        window.location.reload();
                    });
                }else {
                    alert('Thêm địa chỉ thất bại!!!');
                }
            },
            rules: [
                Validator.isRequired('#name_add_address', 'Vui lòng nhập tên đầy đủ của bạn'),
                Validator.isRequired('#phone_add_address'),
                Validator.isRequired('#address_add_address'),
                Validator.isRequired('#city'),
                Validator.isRequired('#district'),
                Validator.isRequired('#ward'),
            ]
        })

        Validator({
            form: '#modify-address-body-form',
            formGroupSelector: '.form-group',
            errorSelector: '.form-message',
            onSubmit: async function (dataForm) {
                console.log(dataForm);
                const addressId = document.querySelector('#modify-address-body-form').dataset.addressId;
                const dataRespon = await instance.put('/user/update-address/' + addressId, dataForm);

                console.log(dataRespon);
                if(dataRespon.data.message === 'success') {
                    var myModal = new bootstrap.Modal(document.getElementById('modal-update-success'), {
                        keyboard: false
                    });
                    myModal.show();
                    var modalUpdateSuccess = document.getElementById('modal-update-success');
                    modalUpdateSuccess.addEventListener('hide.bs.modal', function(event) {
                        window.location.reload();
                    });
                }else {
                    alert('Cap nhat that bai!!!');
                }
                
            },
            rules: [
                Validator.isRequired('#name_modify_address', 'Vui lòng nhập tên đầy đủ của bạn'),
                Validator.isRequired('#phone_modify_address'),
                Validator.isRequired('#address_modify_address'),
                Validator.isRequired('#city_modify'),
                Validator.isRequired('#district_modify'),
                Validator.isRequired('#ward_modify'),
            ]
        })
        
    }
});

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
