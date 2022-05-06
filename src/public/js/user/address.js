document.addEventListener('DOMContentLoaded', function() {
    const modifyAddressBtns = document.querySelectorAll('.modify-address');
    const addressModal = document.querySelector('#modal-modify-address');
    const deleteAddressModal = document.querySelector('#modal-delete-confirm');

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
        // console.log(response);
        
        return response;
    }, err => {
        return Promise.reject(err);
    });

    loadCitisDisWard('city', 'district', 'ward');
    loadCitisDisWard('city_modify', 'district_modify', 'ward_modify');
    handleDeleteAddress();

    modifyAddressBtns.forEach(item => {
        item.addEventListener('click', async (e) => {
            const addressId = item.dataset.addressId;
            const title = addressModal.querySelector('.title');
            const form = addressModal.querySelector('form');
            const nameInput = form.querySelector('#name_modify_address');
            const phoneInput = form.querySelector('#phone_modify_address');
            const addressInput = form.querySelector('#address_modify_address');
            const wardSelect = form.querySelector('#ward_modify');
            const districtSelect = form.querySelector('#district_modify');
            const citySelect = form.querySelector('#city_modify');

            const dataRespon = (await instance.get('/user/address/' + addressId)).data;
            console.log(dataRespon);
            nameInput.value = dataRespon.data.NAME;
            phoneInput.value = dataRespon.data.PHONE;
            addressInput.value = dataRespon.data.ADDRESS;
            form.dataset.addressId = addressId;
            var option;
            for (var i=0; i<citySelect.options.length; i++) {
                option = citySelect.options[i];
                if (option.value == dataRespon.data.CITY) {
                   option.setAttribute('selected', 'selected');
                   var Parameter = {
                    url: '/json/vietnam.json',//Đường dẫn đến file chứa dữ liệu hoặc api do backend cung cấp
                    method:'GET', //do backend cung cấp 
                    responseType: 'application/json', //kiểu Dữ liệu trả về do backend cung cấp
                    }
                    //gọi ajax = axios => nó trả về cho chúng ta là một promise
                    var promise = axios(Parameter);
                    //Xử lý khi request thành công
                    promise.then(function(result) {
                        const dataCitis = result.data.filter(n => n.Name === option.value);
                        const dataWards = dataCitis[0].Districts.filter(n => n.Name === dataRespon.data.DISTRICT)[0].Wards;

                        for(const k of dataCitis[0].Districts) {
                            districtSelect.options[districtSelect.options.length] = new Option(k.Name, k.Name);
                        }

                        for (const w of dataWards) {
                            wardSelect.options[wardSelect.options.length] = new Option(w.Name, w.Name);
                        }

                        for (var i=0; i<districtSelect.options.length; i++) {
                            option = districtSelect.options[i];
                            if (option.value == dataRespon.data.DISTRICT) {
                               option.setAttribute('selected', 'selected');
                               
                               break;
                            } 
                        }

                        for (var i=0; i<wardSelect.options.length; i++) {
                            option = wardSelect.options[i];
                            if (option.value == dataRespon.data.WARD) {
                               option.setAttribute('selected', 'selected');
                               
                               break; 
                            } 
                        }
                    });
                    break;
                } 
            }

            if(dataRespon.data.ISDEFAULT===1) {
                const defaultCK = form.querySelector('#default_modify_address');
                defaultCK.checked = true;
            }
            return;
            
        });
    });

    function loadCitisDisWard(city, district, ward) {
        var citis = document.getElementById(city);
        var districts = document.getElementById(district);
        var wards = document.getElementById(ward);
        var Parameter = {
            url: '/json/vietnam.json',//Đường dẫn đến file chứa dữ liệu hoặc api do backend cung cấp
            method:'GET', //do backend cung cấp 
            responseType: 'application/json', //kiểu Dữ liệu trả về do backend cung cấp
        }
        //gọi ajax = axios => nó trả về cho chúng ta là một promise
        var promise = axios(Parameter);
        //Xử lý khi request thành công
        promise.then(function(result) {
            renderCity(result.data);
        });
    
        function renderCity(data){
            for (const x of data) {
                citis.options[citis.options.length] = new Option(x.Name, x.Name);
            };
    
            citis.onchange = function () {
                districts.length = 1;
                wards.length = 1;
            
                // console.log(districts);
                if(this.value != "") {
                    const result = data.filter(n => n.Name === this.value);
            
                    for(const k of result[0].Districts) {
                        districts.options[districts.options.length] = new Option(k.Name, k.Name);
                    }
                }
            };
    
            districts.onchange = function () {
                wards.length = 1;
                const dataCitis = data.filter(n => n.Name === citis.value);
    
                if(this.value != "") {
                    const dataWards = dataCitis[0].Districts.filter(n => n.Name === this.value)[0].Wards;
    
                    for (const w of dataWards) {
                        wards.options[wards.options.length] = new Option(w.Name, w.Name);
                    }
                }
            };
        }
    }

    function handleDeleteAddress() {
        var modalDeleteSuccessBoot = new bootstrap.Modal(document.getElementById('modal-delete-success'), {
            keyboard: false
        });
        var response ='';
        var apiDeleteAddress = '';
        var idAddress = '';
        deleteAddressModal.addEventListener('show.bs.modal', function (event) {
            var button = event.relatedTarget;
            idAddress = button.getAttribute('data-bs-id');
            
            apiDeleteAddress = '/user/delete-address/' + idAddress;
            console.log(apiDeleteAddress);
        })

        const deleteConfirmBtn = document.querySelector('#address-delete-btn');
        deleteConfirmBtn.addEventListener('click', async (e) => {
            response = await instance.delete(apiDeleteAddress);
            
            $('#modal-delete-confirm').modal('hide');
            if(response.data.message === 'success') {
                modalDeleteSuccessBoot.show();
                var modalDeleteSuccess = document.getElementById('modal-delete-success');
                modalDeleteSuccess.addEventListener('hide.bs.modal', function(event) {
                    window.location.reload();
                });
            }else {
                alert('Xoa that bai!');
                return;
            }
            
        });
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
