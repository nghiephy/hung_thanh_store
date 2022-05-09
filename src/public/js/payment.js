
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
        if(err) {
            alert("Có lỗi xảy ra!" + err_message);
        }
        return Promise.reject(err);
    });

    const accessToken = getCookie('accessToken');
    let decodedToken = null;
    if(accessToken){
        decodedToken = jwt_decode(accessToken);
    }

    formValidate();
    loadCitisDisWard();
    toggleLayout();
    loadInforOrder();
    loadDataUser();
    handleSubmitOrder();

    if(accessToken) {
        $("#order-btn").click( async function () {
            var cart = window.localStorage.getItem('cart') || [];
            const addressId = document.querySelector('input[name="address"]:checked').value;
            const invoiceCkEle = document.querySelector('#invoice-ck');
            const invoiceForm = document.querySelector('#form-infor-invoice');
            const cardNoteOrderEle = document.querySelector('#card-note-order');
            const totalPriceInput = document.querySelector('#checkout-final-total-price');
            var formData = {};
    
            formData.cart = cart;
            formData.address_id = addressId;
            formData.note_card = cardNoteOrderEle.value;
            formData.total_price = (totalPriceInput.innerText).slice(0, -2);
    
            if(invoiceCkEle.checked) {
                const form = new FormData(invoiceForm);
                var dataInvoice = {};
                form.forEach(function(value, key){
                    dataInvoice[key] = value;
                });
                var json = JSON.stringify(dataInvoice);
                formData.infor_invoice = json;
            }

            if(cart!=='[]') {
                const dataRespon = await instance.post('/payment', formData);
                if(dataRespon.data.message === 'success') {
                    const myModalEle = document.querySelector('.my-modal');
                    const modalSuccess = myModalEle.querySelector('#modal-successful');
                    const btnCloseModal = myModalEle.querySelector('.successful-body__button');
    
                    myModalEle.classList.add('active');
                    modalSuccess.classList.add('active');
                    btnCloseModal.addEventListener('click', (e) => {
                        window.location.replace('/');
                    })
                }else {
                    alert('Dat hang that bai!');
                }
            }else {
                alert('Không có sản phẩm trong giỏ!');
            }
    
        });
    }

    async function formValidate() {

        Validator({
            form: '#form-infor-payment',
            formGroupSelector: '.form-group',
            errorSelector: '.form-message',
            onSubmit: async function (dataForm) {
                console.log(dataForm);
                const invoiceCkEle = document.querySelector('#invoice-ck');
                const cardNoteOrderEle = document.querySelector('#card-note-order');
                const totalPriceInput = document.querySelector('#checkout-final-total-price');
                var cart = window.localStorage.getItem('cart') || [];

                dataForm.note_card = cardNoteOrderEle.value;
                if(invoiceCkEle.checked) {
                    const invoiceForm = document.querySelector('#form-infor-invoice');
                    const form = new FormData(invoiceForm);
                    var dataInvoice = {};
                    form.forEach(function(value, key){
                        dataInvoice[key] = value;
                    });
                    var json = JSON.stringify(dataInvoice);
                    dataForm.infor_invoice = json;
                }
                dataForm.cart = cart;
                dataForm.total_price = (totalPriceInput.innerText).slice(0, -2);

                if(cart!=='[]') {
                    const dataRespon = await instance.post('/payment', dataForm);
                    if(dataRespon.data.message === 'success') {
                        const myModalEle = document.querySelector('.my-modal');
                        const modalSuccess = myModalEle.querySelector('#modal-successful');
                        const btnCloseModal = myModalEle.querySelector('.successful-body__button button');
        
                        myModalEle.classList.add('active');
                        modalSuccess.classList.add('active');
                        btnCloseModal.addEventListener('click', (e) => {
                            window.localStorage.setItem('cart', JSON.stringify([]));
                            window.location.replace('/');
                        })
                    }else {
                        alert('Dat hang that bai!');
                    }
                }else {
                    alert('Không có sản phẩm trong giỏ!');
                }
            },
            rules: [
                Validator.isRequired('#name-payment-form', 'Vui lòng nhập tên đầy đủ của bạn'),
                Validator.isRequired('#email-payment-form'),
                Validator.isRequired('#phone-payment-form'),
                Validator.isRequired('#address-payment-form'),
                Validator.isRequired('#city'),
                Validator.isRequired('#district'),
                Validator.isRequired('#ward'),
            ]
        })
        
        function getParent (element, selector) {
            while (element.parentElement) {
                if(element.parentElement.matches(selector)) {
                    return element.parentElement
                }
                element = element.parentElement
            }
        }

        function isRequired (selector, message) {
           const inputEle = document.querySelector(selector);
           const value = inputEle.value;

            if (value != String) {
                return value ? undefined : message || "Vui lòng nhập trường này!"
            } else {
                return value.trim() ? undefined : message || "Vui lòng nhập trường này!"
            }
        }
    }

    async function loadDataUser() {
        if(accessToken) {
            // request to get information of user
            // display it into views
            const dataUser = await instance.get('/user/information');
            console.log(dataUser);
            if(dataUser.status === 200) {
                const invoiceNameInput = document.querySelector('#invoice-name-company');
                const invoiceTaxInput = document.querySelector('#invoice-tax-number');
                const invoiceAddressInput = document.querySelector('#invoice-address');
    
                invoiceNameInput.value = dataUser.data.user.COMPANY_NAME;
                invoiceTaxInput.value = dataUser.data.user.COM_TAX_NUMBER;
                invoiceAddressInput.value = dataUser.data.user.COM_ADDRESS;
            }
        }
    }
});


function loadCitisDisWard() {
    var citis = document.getElementById("city");
    var districts = document.getElementById("district");
    var wards = document.getElementById("ward");
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
            district.length = 1;
            ward.length = 1;
        
            // console.log(districts);
            if(this.value != "") {
                const result = data.filter(n => n.Name === this.value);
        
                for(const k of result[0].Districts) {
                    district.options[district.options.length] = new Option(k.Name, k.Name);
                }
            }
        };

        district.onchange = function () {
            ward.length = 1;
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

function toggleLayout() {
    const invoiceCk = document.querySelector('#invoice-ck');
    const formInvoice = document.querySelector('.form-invoice');

    invoiceCk.addEventListener('click', (e) => {
        formInvoice.classList.toggle('active');
    })
}

function loadInforOrder() {
    var cart = JSON.parse(window.localStorage.getItem('cart')) || [];
    var totalPrice = cart.reduce((total, nextItem) => {
        return total + parseInt(nextItem.TOTAL_PRICE);
    }, 0);
    var totalItem = cart.reduce((total, nextItem) => {
        return total + parseInt(nextItem.QUANTITY);
    }, 0);
    var htmls = cart.map(item => {
        return `
            <tr class="cart-table__row">
                <td class="cart-table__col cart-table__col--product">
                    <div class="cart-product">
                        <a href="#" class="cart-product__image">
                            <img src="${item.IMAGE}" alt="${item.SLUG}">
                        </a>
                        <div class="cart-product__title">${item.NAME}</div>
                    </div>
                </td>
                <td class="cart-table__col cart-table__col--price">
                    <div class="payment-quantity">
                        <span class="price">${item.PRICE_PER_UNIT} đ</span>
                        <span class="old-price">${item.PRICE_PER_UNIT} đ</span>
                        <span class="quantity">x${item.QUANTITY}</span>
                    </div>
                </td>
            </tr>
        `;
    }).join(' ');
    const listProductEle = document.querySelector('.cart-table__body');
    const totalPriceEle = document.querySelector('#checkout-total-price');
    const finalTotalPriceEle = document.querySelector('#checkout-final-total-price');
    const totalItemEle = document.querySelector('#checkout-total-item');

    listProductEle.innerHTML = htmls;
    totalPriceEle.innerHTML = totalPrice+'&nbsp;đ';
    finalTotalPriceEle.innerHTML = totalPrice+'&nbsp;đ';
    totalItemEle.innerHTML = `Tổng tiền (${totalItem} sản phẩm)`;
}

function handleSubmitOrder() {
    const formInforPayment = document.querySelector('#form-infor-payment');
    const orderBtn = document.querySelector('#order-btn');
    var cart = JSON.parse(window.localStorage.getItem('cart')) || [];

    orderBtn.addEventListener('click', (e) => {
        

        // formInforPayment.submit();

    });
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

