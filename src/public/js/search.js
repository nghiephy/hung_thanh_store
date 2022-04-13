import { loadCartHeader,loadCartListHeader, deleteCarProHeader } from './modules/header-module.js';

document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('.form-product-search');
    const addToCartHomeBtns = document.querySelectorAll('.search-add-cart-btn');
    const buyNowBtns = document.querySelectorAll('.buy-now');

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
    });

    addToCartHomeBtns.forEach((btnAddCart, indexBtn) => {
        btnAddCart.addEventListener('click', async (e) => {
            const quantity = forms[indexBtn].querySelector('input[name="quantity"]').value;
            const name = forms[indexBtn].querySelector('input[name="name"]').value;
            const price_per_unit = forms[indexBtn].querySelector('input[name="price_per_unit"]').value;
            const slug = forms[indexBtn].querySelector('input[name="slug"]').value;
            const image = forms[indexBtn].querySelector('input[name="image"]').value;
            const product_id = forms[indexBtn].querySelector('input[name="product_id"]').value;
            
            const product = {
                NAME: name,
                PRODUCT_ID: parseInt(product_id),
                QUANTITY: parseInt(quantity),
                PRICE_PER_UNIT: parseFloat(price_per_unit),
                TOTAL_PRICE: parseFloat(price_per_unit)*quantity,
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

                await instance.post('http://localhost:3000/cart/update-cart-item', {
                    product_id: product.PRODUCT_ID,
                    quantity: cart[index].QUANTITY,
                    total_price: cart[index].TOTAL_PRICE,
                });
            }else{
                await instance.post('http://localhost:3000/cart/save-cart', {
                    dataCart: JSON.stringify([product]),
                });

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
        buyNowBtn.addEventListener('click', async (e) => {
            const quantity = forms[indexBtn].querySelector('input[name="quantity"]').value;
            const name = forms[indexBtn].querySelector('input[name="name"]').value;
            const price_per_unit = forms[indexBtn].querySelector('input[name="price_per_unit"]').value;
            const slug = forms[indexBtn].querySelector('input[name="slug"]').value;
            const image = forms[indexBtn].querySelector('input[name="image"]').value;
            const product_id = forms[indexBtn].querySelector('input[name="product_id"]').value;
            
            const product = {
                NAME: name,
                PRODUCT_ID: parseInt(product_id),
                QUANTITY: parseInt(quantity),
                PRICE_PER_UNIT: parseFloat(price_per_unit),
                TOTAL_PRICE: parseFloat(price_per_unit)*quantity,
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

                await instance.post('http://localhost:3000/cart/update-cart-item', {
                    product_id: product.PRODUCT_ID,
                    quantity: cart[index].QUANTITY,
                    total_price: cart[index].TOTAL_PRICE,
                });
            }else{

                await instance.post('http://localhost:3000/cart/save-cart', {
                    dataCart: JSON.stringify([product]),
                });
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
    
});