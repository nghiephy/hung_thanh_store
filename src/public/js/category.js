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
                name: name,
                quantity: quantity,
                price_per_unit: price_per_unit,
                total_price: parseInt(price_per_unit)*quantity,
                slug: slug,
                image: image,
            }

            var cart = JSON.parse(window.localStorage.getItem('cart')) || [];
            
            const index = cart.findIndex(({slug}) => {
                return slug == product.slug;
            })

            if(index != -1) {
                cart[index].quantity = parseInt(cart[index].quantity) + parseInt(product.quantity);
                cart[index].total_price += product.total_price;
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
    
});