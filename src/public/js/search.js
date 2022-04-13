import { loadCartHeader,loadCartListHeader, deleteCarProHeader } from './modules/header-module.js';

document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('.form-product-search');
    const addToCartHomeBtns = document.querySelectorAll('.search-add-cart-btn');
    const buyNowBtns = document.querySelectorAll('.buy-now');

    addToCartHomeBtns.forEach((btnAddCart, indexBtn) => {
        btnAddCart.addEventListener('click', (e) => {
            const quantity = forms[indexBtn].querySelector('#quantity-input').value;
            const name = forms[indexBtn].querySelector('#name').value;
            const price_per_unit = forms[indexBtn].querySelector('#price_per_unit').value;
            const slug = forms[indexBtn].querySelector('#slug').value;
            const image = forms[indexBtn].querySelector('#image').value;
            
            const product = {
                NAME: name,
                QUANTITY: quantity,
                PRICE_PER_UNIT: price_per_unit,
                TOTAL_PRICE: parseInt(price_per_unit)*quantity,
                SLUG: slug,
                IMAGE: image,
            }

            var cart = JSON.parse(window.localStorage.getItem('cart')) || [];
            
            const index = cart.findIndex(({SLUG}) => {
                return SLUG == product.SLUG;
            })

            if(index != -1) {
                cart[index].QUANTITY = parseInt(cart[index].QUANTITY) + parseInt(product.QUANTITY);
                cart[index].TOTAL_PRICE += product.TOTAL_PRICE;
            }else{
                cart.push(product);
            }

            // Save new cart to localstore and toast message for user
            window.localStorage.setItem('cart', JSON.stringify(cart));
            showSuccessAddCartToast();

            // Update cart quantity header after add product
            loadCartHeader();

            // Update cart list products header after add product
            loadCartListHeader();

            deleteCarProHeader();
        })
    });

    buyNowBtns.forEach((buyNowBtn, indexBtn) => {
        buyNowBtn.addEventListener('click', (e) => {
            const quantity = forms[indexBtn].querySelector('#quantity-input').value;
            const name = forms[indexBtn].querySelector('#name').value;
            const price_per_unit = forms[indexBtn].querySelector('#price_per_unit').value;
            const slug = forms[indexBtn].querySelector('#slug').value;
            const image = forms[indexBtn].querySelector('#image').value;
            
            const product = {
                NAME: name,
                QUANTITY: quantity,
                PRICE_PER_UNIT: price_per_unit,
                TOTAL_PRICE: parseInt(price_per_unit)*quantity,
                SLUG: slug,
                IMAGE: image,
            }

            var cart = JSON.parse(window.localStorage.getItem('cart')) || [];
            
            const index = cart.findIndex(({SLUG}) => {
                return SLUG == product.SLUG;
            })

            if(index != -1) {
                cart[index].QUANTITY = parseInt(cart[index].QUANTITY) + parseInt(product.QUANTITY);
                cart[index].TOTAL_PRICE += product.TOTAL_PRICE;
            }else{
                cart.push(product);
            }

            // Save new cart to localstore and toast message for user
            window.localStorage.setItem('cart', JSON.stringify(cart));

            // Update cart quantity header after add product
            loadCartHeader();

            // Update cart list products header after add product
            loadCartListHeader();

            deleteCarProHeader();
        });
    });
    
});