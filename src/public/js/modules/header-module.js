// Load data for cart in header
export function loadCartHeader() {
    var cart = JSON.parse(window.localStorage.getItem('cart')) || [];
    const totalProEle = document.querySelector('.header-user-control-cart__quantily span');
    const totalProducts = cart.reduce((total, nextItem) => {
        return total + parseInt(nextItem.quantity);
    }, 0);

    totalProEle.innerHTML = totalProducts;
};

export function loadCartListHeader() {
    var cart = JSON.parse(window.localStorage.getItem('cart')) || [];
    const cartListHeader = document.querySelector('.cart-popup__recent-list');
    const totalPriceHeader = document.querySelector('.cart-popup__total-value');

    const htmlCartList = cart.map(cartItem => {
        return `<li class="cart-popup__recent-item" >
                    <div class="cart-popup__recent-item__imgBox">
                        <a href="#" >
                            <img src="${cartItem.image}" alt="${cartItem.slug}">
                        </a>
                    </div>
                    <div class="cart-popup__recent-item__info">
                        <a href="#" class="title"><span >${cartItem.name}</span></a>
                        <div class="start-review">
                            <ion-icon name="star-outline"></ion-icon>
                            <ion-icon name="star-outline"></ion-icon>
                            <ion-icon name="star-outline"></ion-icon>
                            <ion-icon name="star-outline"></ion-icon>
                            <ion-icon name="star-outline"></ion-icon>
                        </div>
                        <div class="quantily-price">
                            <div class="price">
                                <span>${cartItem.price_per_unit}</span>
                            </div>
                            <div class="quantily">
                                <span class="quantily__label" >SL: </span>
                                <span class="quantily__value" >${cartItem.quantity}</span>
                            </div>
                        </div>
                    </div>
                        <button data-slug="${cartItem.slug}" class="button button--transparent cart-popup__recent-item__closeBtn">
                            <ion-icon name="close"></ion-icon>
                        </button>
                </li>`
    });

    const totalPrice = cart.reduce((total, nextItem) => {
        return total + parseInt(nextItem.total_price);
    }, 0);

    cartListHeader.innerHTML = htmlCartList;
    totalPriceHeader.innerHTML = totalPrice;
}

// Handle delete product in cart header
export function deleteCarProHeader() {
    var cart = JSON.parse(window.localStorage.getItem('cart')) || [];
    const deleteCartBtns = document.querySelectorAll('.cart-popup__recent-item__closeBtn');

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

            loadCartHeader();
            loadCartListHeader();
            deleteCarProHeader();

            const listProducts = document.querySelector('.cart-table__body.cart');
            const listProductsPayment = document.querySelector('.cart-table__body.payment');

            if(listProducts) {
                loadDataToCart(listProducts);
            }
            if(listProductsPayment) {
                loadInforOrder(listProductsPayment);
            }
        });
    });
}

function loadDataToCart(listProducts) {
    var cart = JSON.parse(window.localStorage.getItem('cart')) || [];
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

    updateQuantity(listProducts);
    deleteCart(listProducts);

}

function updateQuantity(listProducts) {
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
            loadDataToCart(listProducts);
            // Run updateQuantity because new Dom was updated
            updateQuantity(listProducts);

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
            loadDataToCart(listProducts);
            // Run updateQuantity because new Dom was updated
            updateQuantity(listProducts);

            loadCartHeader();
            loadCartListHeader();
            deleteCarProHeader();
        })
    });
}

function deleteCart(listProducts) {
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
            loadDataToCart(listProducts);
            // Run updateQuantity because new Dom was updated
            updateQuantity(listProducts);

            loadCartHeader();
            loadCartListHeader();
            deleteCarProHeader();
        })
    })
}

function loadInforOrder(listProductEle) {
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
    const totalPriceEle = document.querySelector('#checkout-total-price');
    const finalTotalPriceEle = document.querySelector('#checkout-final-total-price');

    listProductEle.innerHTML = htmls;
    totalPriceEle.innerHTML = totalPrice+'&nbsp;đ';
    finalTotalPriceEle.innerHTML = totalPrice+'&nbsp;đ';
}