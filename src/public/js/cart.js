import { loadCartHeader,loadCartListHeader, deleteCarProHeader } from './modules/header-module.js';

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
    
    return response;
}, err => {
    return Promise.reject(err);
})

loadDataToCart();
updateQuantity();
deleteCart();
handleOrder();

function loadDataToCart() {
    var cart = JSON.parse(window.localStorage.getItem('cart')) || [];
    const listProducts = document.querySelector('.cart-table__body');
    const priceBox = document.querySelector('#card-summary-old-price');
    const totalPriceBox = document.querySelector('#card-summary-total-price');
    var totalPrice = cart.reduce((total, nextItem) => {
        return total + parseInt(nextItem.TOTAL_PRICE);
    }, 0);

    var htmls = cart.map(item => {
        return `
            <tr class="cart-table__row">
                <td class="cart-table__col cart-table__col--product">
                    <div class="cart-product">
                        <a href="/products/${item.SLUG}" class="cart-product__image">
                            <img src="${item.IMAGE}" alt="${item.SLUG}">
                        </a>
                        <a class="cart-product__title" href="/products/${item.SLUG}">
                            <div >${item.NAME}</div>
                        </a>
                    </div>
                </td>
                <td class="cart-table__col cart-table__col--price">
                    <h3 class="label-mobile" >Gi??: </h3>
                    <div>
                        <span class="price">${item.PRICE_PER_UNIT} ??</span>
                        <span class="old-price">${item.PRICE_PER_UNIT} ??</span>
                    </div>
                </td>
                <td class="cart-table__col cart-table__col--quantity">
                    <h3 class="label-mobile" >S??? l?????ng: </h3>
                    <div class="product_body-quantily">
                        <div class="product_body-quantily-btnminus quantity-btn" data-slug="${item.SLUG}">
                            <ion-icon name="remove"></ion-icon>
                        </div>
                        <input type="number" name="" id="" value="${item.QUANTITY}">
                        <div class="product_body-quantily-btnplus quantity-btn" data-slug="${item.SLUG}">
                            <ion-icon name="add"></ion-icon>
                        </div>
                    </div>
                </td>
                <td class="cart-table__col cart-table__col--total">
                    <h3 class="label-mobile" >S??? ti???n: </h3>
                    <span class="price">${item.TOTAL_PRICE} ??</span>
                </td>
                <td class="cart-table__col cart-table__col--action">
                    <h3 class="label-mobile" >H??ng ?????ng: </h3>
                    <a class="delete-cart-btn" data-slug="${item.SLUG}" href="#">Xo??</a>
                </td>
            </tr>
        `;
    }).join(' ');
    
    listProducts.innerHTML = htmls;
    priceBox.innerHTML = totalPrice+'&nbsp;??';
    totalPriceBox.innerHTML = totalPrice+'&nbsp;??';

    updateQuantity();
    deleteCart();
}

function updateQuantity() {
    var cart = JSON.parse(window.localStorage.getItem('cart')) || [];
    const minusQuantityBtns = document.querySelectorAll('.product_body-quantily-btnminus');
    const plusQuantityBtns = document.querySelectorAll('.product_body-quantily-btnplus');

    minusQuantityBtns.forEach(item => {
        item.addEventListener('click', async (e) => {
            const isExitsProduct = cart.findIndex(({SLUG}) => {
                return SLUG == item.dataset.slug;
            })

            if(isExitsProduct != -1) {
                var newQuantity = parseInt(cart[isExitsProduct].QUANTITY)-1;
                var newTotalPrice = parseInt(cart[isExitsProduct].PRICE_PER_UNIT)*newQuantity;
                cart[isExitsProduct].QUANTITY = newQuantity>1?newQuantity:1;
                cart[isExitsProduct].TOTAL_PRICE = newTotalPrice>parseInt(cart[isExitsProduct].PRICE_PER_UNIT)?newTotalPrice:parseInt(cart[isExitsProduct].PRICE_PER_UNIT);

                // Save change quantity product cart to DB
                await instance.post('http://localhost:3000/cart/update-cart-item', {
                    product_id: cart[isExitsProduct].PRODUCT_ID,
                    quantity: cart[isExitsProduct].QUANTITY,
                    total_price: cart[isExitsProduct].TOTAL_PRICE,
                });
            }
            // Save new cart to localstore and toast message for user
            window.localStorage.setItem('cart', JSON.stringify(cart));

            // Load new data after change quantity
            loadDataToCart();
            // Run updateQuantity because new Dom was updated
            updateQuantity();

            loadCartHeader();
            loadCartListHeader();
            deleteCarProHeader();
        })
    });

    plusQuantityBtns.forEach(item => {
        item.addEventListener('click', async (e) => {
            const isExitsProduct = cart.findIndex(({SLUG}) => {
                return SLUG == item.dataset.slug;
            })

            if(isExitsProduct != -1) {
                var newQuantity = parseInt(cart[isExitsProduct].QUANTITY)+1;
                var newTotalPrice = parseInt(cart[isExitsProduct].PRICE_PER_UNIT)*newQuantity;
                cart[isExitsProduct].QUANTITY = newQuantity;
                cart[isExitsProduct].TOTAL_PRICE = newTotalPrice;

                // Save change quantity product cart to DB
                await instance.post('http://localhost:3000/cart/update-cart-item', {
                    product_id: cart[isExitsProduct].PRODUCT_ID,
                    quantity: cart[isExitsProduct].QUANTITY,
                    total_price: cart[isExitsProduct].TOTAL_PRICE,
                });
            }
            // Save new cart to localstore and toast message for user
            window.localStorage.setItem('cart', JSON.stringify(cart));

            // Load new data after change quantity
            loadDataToCart();
            // Run updateQuantity because new Dom was updated
            updateQuantity();

            loadCartHeader();
            loadCartListHeader();
            deleteCarProHeader();
        })
    });
}

function deleteCart() {
    var cart = JSON.parse(window.localStorage.getItem('cart')) || [];
    const deleteCartBtns = document.querySelectorAll('.delete-cart-btn');

    deleteCartBtns.forEach(item => {
        item.addEventListener('click', async (e) => {
            const isExitsProduct = cart.findIndex(({SLUG}) => {
                return SLUG == item.dataset.slug;
            })

            if(isExitsProduct != -1) {
                // Delete product in cart list of DB
                await instance.post('http://localhost:3000/cart/delete-cart-item', {
                    product_id: cart[isExitsProduct].PRODUCT_ID,
                });
                
                var spliced = cart.splice(isExitsProduct, 1);
            }

            // Save new cart to localstore and toast message for user
            window.localStorage.setItem('cart', JSON.stringify(cart));

            // Load new data after change quantity
            loadDataToCart();
            // Run updateQuantity because new Dom was updated
            updateQuantity();

            loadCartHeader();
            loadCartListHeader();
            deleteCarProHeader();
        })
    })
}

function handleOrder() {
    const orderBtn = document.querySelector('#card-summary-order-btn');

    orderBtn.addEventListener('click', (e) => {
        window.location.replace("/payment");
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