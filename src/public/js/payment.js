

$(document).ready(function () {

    loadCitisDisWard();
    toggleLayout();
    loadInforOrder();
    handleSubmitOrder();

    $("#order-btn").click(function () {
        var cart = window.localStorage.getItem('cart') || [];
        const nameValue = $('#name-payment-form').val();
        const emailValue = $('#email-payment-form').val();
        const phoneValue = $('#phone-payment-form').val();
        const addressValue = $('#address-payment-form').val();
        const cityValue = $('.form-group #city :selected').text();
        const districtValue = $('.form-group #district :selected').text();
        const wardValue = $('.form-group #ward :selected').text();

        const address = addressValue +', ' + wardValue +', ' + districtValue +', ' + cityValue;
        
        console.log(nameValue);
        $.post("/payment",
        {
           cart: cart,
           name: nameValue,
           email: emailValue,
           phone: phoneValue,
           address: address,
        },
        function (data, status) {
           console.log(data);
        });
    });
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
        return total + parseInt(nextItem.total_price);
    }, 0);
    var htmls = cart.map(item => {
        return `
            <tr class="cart-table__row">
                <td class="cart-table__col cart-table__col--product">
                    <div class="cart-product">
                        <a href="#" class="cart-product__image">
                            <img src="${item.image}" alt="${item.slug}">
                        </a>
                        <div class="cart-product__title">${item.name}</div>
                    </div>
                </td>
                <td class="cart-table__col cart-table__col--price">
                    <div class="payment-quantity">
                        <span class="price">${item.price_per_unit} đ</span>
                        <span class="old-price">${item.price_per_unit} đ</span>
                        <span class="quantity">x${item.quantity}</span>
                    </div>
                </td>
            </tr>
        `;
    }).join(' ');
    const listProductEle = document.querySelector('.cart-table__body');
    const totalPriceEle = document.querySelector('#checkout-total-price');
    const finalTotalPriceEle = document.querySelector('#checkout-final-total-price');

    listProductEle.innerHTML = htmls;
    totalPriceEle.innerHTML = totalPrice+'&nbsp;đ';
    finalTotalPriceEle.innerHTML = totalPrice+'&nbsp;đ';
}

function handleSubmitOrder() {
    const formInforPayment = document.querySelector('#form-infor-payment');
    const orderBtn = document.querySelector('#order-btn');
    var cart = JSON.parse(window.localStorage.getItem('cart')) || [];

    orderBtn.addEventListener('click', (e) => {
        

        // formInforPayment.submit();

    });
}

