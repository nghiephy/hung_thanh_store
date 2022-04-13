// Load data for cart in header
export function loadCartHeader() {
    var cart = JSON.parse(window.localStorage.getItem('cart')) || [];
    const totalProEle = document.querySelector('.header-user-control-cart__quantily span');
    const totalProducts = cart.reduce((total, nextItem) => {
        return total + parseInt(nextItem.QUANTITY);
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
                            <img src="${cartItem.IMAGE}" alt="${cartItem.SLUG}">
                        </a>
                    </div>
                    <div class="cart-popup__recent-item__info">
                        <a href="#" class="title"><span >${cartItem.NAME}</span></a>
                        <div class="start-review">
                            <ion-icon name="star-outline"></ion-icon>
                            <ion-icon name="star-outline"></ion-icon>
                            <ion-icon name="star-outline"></ion-icon>
                            <ion-icon name="star-outline"></ion-icon>
                            <ion-icon name="star-outline"></ion-icon>
                        </div>
                        <div class="quantily-price">
                            <div class="price">
                                <span>${cartItem.PRICE_PER_UNIT}</span>
                            </div>
                            <div class="quantily">
                                <span class="quantily__label" >SL: </span>
                                <span class="quantily__value" >${cartItem.QUANTITY}</span>
                            </div>
                        </div>
                    </div>
                        <button data-slug="${cartItem.SLUG}" class="button button--transparent cart-popup__recent-item__closeBtn">
                            <ion-icon name="close"></ion-icon>
                        </button>
                </li>`
    });

    const totalPrice = cart.reduce((total, nextItem) => {
        return total + parseInt(nextItem.TOTAL_PRICE);
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
            const isExitsProduct = cart.findIndex(({SLUG}) => {
                return SLUG == item.dataset.slug;
            })

            if(isExitsProduct != -1) {
                // Delete product in cart list of DB
                $.post("http://localhost:3000/cart/delete-cart-item", {
                    product_id: cart[isExitsProduct].PRODUCT_ID,
                }, function(data) {
                        console.log(data);
                });
                // Delete product in cart list of LocalStorage
                var spliced = cart.splice(isExitsProduct, 1);
            }

            // Save new cart to localstore and toast message for user
            window.localStorage.setItem('cart', JSON.stringify(cart));

            // Update DOM element tree after change
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
                    <h3 class="label-mobile" >Giá: </h3>
                    <div>
                        <span class="price">${item.PRICE_PER_UNIT} đ</span>
                        <span class="old-price">${item.PRICE_PER_UNIT} đ</span>
                    </div>
                </td>
                <td class="cart-table__col cart-table__col--quantity">
                    <h3 class="label-mobile" >Số lượng: </h3>
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
                    <h3 class="label-mobile" >Số tiền: </h3>
                    <span class="price">${item.TOTAL_PRICE} đ</span>
                </td>
                <td class="cart-table__col cart-table__col--action">
                    <h3 class="label-mobile" >Hàng động: </h3>
                    <a class="delete-cart-btn" data-slug="${item.SLUG}" href="#">Xoá</a>
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
            const isExitsProduct = cart.findIndex(({SLUG}) => {
                return SLUG == item.dataset.slug;
            })

            if(isExitsProduct != -1) {
                var newQuantity = parseInt(cart[isExitsProduct].QUANTITY)-1;
                var newTotalPrice = parseInt(cart[isExitsProduct].PRICE_PER_UNIT)*newQuantity;
                cart[isExitsProduct].QUANTITY = newQuantity>1?newQuantity:1;
                cart[isExitsProduct].TOTAL_PRICE = newTotalPrice>parseInt(cart[isExitsProduct].PRICE_PER_UNIT)?newTotalPrice:parseInt(cart[isExitsProduct].PRICE_PER_UNIT);

                console.log($);

                
            }
            
            // Save change quantity product cart to DB
            $.post("http://localhost:3000/cart/update-cart-item", {
                product_id: cart[isExitsProduct].PRODUCT_ID,
                quantity: cart[isExitsProduct].QUANTITY,
                total_price: cart[isExitsProduct].TOTAL_PRICE,
            }, function(data) {
                    console.log(data);
            });

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
                var newQuantity = parseInt(cart[isExitsProduct].QUANTITY)+1;
                var newTotalPrice = parseInt(cart[isExitsProduct].PRICE_PER_UNIT)*newQuantity;
                cart[isExitsProduct].QUANTITY = newQuantity;
                cart[isExitsProduct].TOTAL_PRICE = newTotalPrice;

                // Save change quantity product cart to DB
                $.post("http://localhost:3000/cart/update-cart-item", {
                    product_id: cart[isExitsProduct].PRODUCT_ID,
                    quantity: cart[isExitsProduct].QUANTITY,
                    total_price: cart[isExitsProduct].TOTAL_PRICE,
                }, function(data) {
                        console.log(data);
                });
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
            const isExitsProduct = cart.findIndex(({SLUG}) => {
                return SLUG == item.dataset.slug;
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
        return total + parseInt(nextItem.TOTAL_PRICE);
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
    const totalPriceEle = document.querySelector('#checkout-total-price');
    const finalTotalPriceEle = document.querySelector('#checkout-final-total-price');

    listProductEle.innerHTML = htmls;
    totalPriceEle.innerHTML = totalPrice+'&nbsp;đ';
    finalTotalPriceEle.innerHTML = totalPrice+'&nbsp;đ';
}