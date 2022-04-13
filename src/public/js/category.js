import { loadCartHeader,loadCartListHeader, deleteCarProHeader } from './modules/header-module.js';

document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('.form-product-category');
    const addToCartHomeBtns = document.querySelectorAll('.category-add-cart-btn');

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
    
    const orderByEles = $('.content-filter__item');
    const formOrderBy = document.querySelector('#form-orderby');
    const activeValue = document.querySelector('.content-filter__list').getAttribute('data-active');
    const strSelector = `[data-orderby="${activeValue}"]`;
    const activeItem = document.querySelector(strSelector);
    const url = document.querySelector('#breadcrumb-slug-cat a').getAttribute('href');
    var orderBy = '';
    
    $.each(orderByEles, (index, item) => {
        item.addEventListener('click', (e) => {
            orderBy = item.dataset.orderby;
            formOrderBy.querySelector('input').value = orderBy;

            formOrderBy.submit();
        })
    });

    activeItem.classList.toggle('active');
});

