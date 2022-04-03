import { loadCartHeader,loadCartListHeader, deleteCarProHeader } from './modules/header-module.js';

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
        return total + parseInt(nextItem.total_price);
    }, 0);

    var htmls = cart.map(item => {
        return `
            <tr class="cart-table__row">
                <td class="cart-table__col cart-table__col--product">
                    <div class="cart-product">
                        <a href="/products/${item.slug}" class="cart-product__image">
                            <img src="${item.image}" alt="${item.slug}">
                        </a>
                        <a class="cart-product__title" href="/products/${item.slug}">
                            <div >${item.name}</div>
                        </a>
                    </div>
                </td>
                <td class="cart-table__col cart-table__col--price">
                    <h3 class="label-mobile" >Giá: </h3>
                    <div>
                        <span class="price">${item.price_per_unit} đ</span>
                        <span class="old-price">${item.price_per_unit} đ</span>
                    </div>
                </td>
                <td class="cart-table__col cart-table__col--quantity">
                    <h3 class="label-mobile" >Số lượng: </h3>
                    <div class="product_body-quantily">
                        <div class="product_body-quantily-btnminus quantity-btn" data-slug="${item.slug}">
                            <ion-icon name="remove"></ion-icon>
                        </div>
                        <input type="number" name="" id="" value="${item.quantity}">
                        <div class="product_body-quantily-btnplus quantity-btn" data-slug="${item.slug}">
                            <ion-icon name="add"></ion-icon>
                        </div>
                    </div>
                </td>
                <td class="cart-table__col cart-table__col--total">
                    <h3 class="label-mobile" >Số tiền: </h3>
                    <span class="price">${item.total_price} đ</span>
                </td>
                <td class="cart-table__col cart-table__col--action">
                    <h3 class="label-mobile" >Hàng động: </h3>
                    <a class="delete-cart-btn" data-slug="${item.slug}" href="#">Xoá</a>
                </td>
            </tr>
        `;
    }).join(' ');
    
    listProducts.innerHTML = htmls;
    priceBox.innerHTML = totalPrice+'&nbsp;đ';
    totalPriceBox.innerHTML = totalPrice+'&nbsp;đ';

    updateQuantity();
    deleteCart();
}

function updateQuantity() {
    var cart = JSON.parse(window.localStorage.getItem('cart')) || [];
    const minusQuantityBtns = document.querySelectorAll('.product_body-quantily-btnminus');
    const plusQuantityBtns = document.querySelectorAll('.product_body-quantily-btnplus');

    minusQuantityBtns.forEach(item => {
        item.addEventListener('click', (e) => {
            const isExitsProduct = cart.findIndex(({slug}) => {
                return slug == item.dataset.slug;
            })

            if(isExitsProduct != -1) {
                var newQuantity = parseInt(cart[isExitsProduct].quantity)-1;
                var newTotalPrice = parseInt(cart[isExitsProduct].price_per_unit)*newQuantity;
                cart[isExitsProduct].quantity = newQuantity>1?newQuantity:1;
                cart[isExitsProduct].total_price = newTotalPrice>parseInt(cart[isExitsProduct].price_per_unit)?newTotalPrice:parseInt(cart[isExitsProduct].price_per_unit);
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
        item.addEventListener('click', (e) => {
            const isExitsProduct = cart.findIndex(({slug}) => {
                return slug == item.dataset.slug;
            })

            if(isExitsProduct != -1) {
                var newQuantity = parseInt(cart[isExitsProduct].quantity)+1;
                var newTotalPrice = parseInt(cart[isExitsProduct].price_per_unit)*newQuantity;
                cart[isExitsProduct].quantity = newQuantity;
                cart[isExitsProduct].total_price = newTotalPrice;
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
        item.addEventListener('click', (e) => {
            const isExitsProduct = cart.findIndex(({slug}) => {
                return slug == item.dataset.slug;
            })

            if(isExitsProduct != -1) {
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