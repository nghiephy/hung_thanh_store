import { loadCartHeader,loadCartListHeader, deleteCarProHeader } from '../modules/header-module.js';

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

    handleCLickUI();

    function handleCLickUI() {

        handleTabCommentDetail();
        handleImageList();
        handleSliderZoomImg();
        handleUpdateQuantity();
        handleAddToCart();
    }

    function handleImageList() {
        const imgitems = document.querySelectorAll('.product_gallery-imgitem');
        const reviewBox = document.querySelector('.product_gallery-imgBox img');

        imgitems[0].classList.add('active');
        reviewBox.src = imgitems[0].getAttribute('data-imgPath');
        imgitems.forEach(item => {
            item.addEventListener('click', (e) => {
                reviewBox.src = item.getAttribute('data-imgPath');

                // Update zoomed_image when change src attribute for imageBox element
                var options2 = {
                    width: 300,
                    height: 300,
                    zoomWidth: 400,
                    zoomStyle: {
                        'z-index': 10,
                    },
                    // zoomLensStyle: {
                    //     'opacity': 0,
                    //     'background-color': 'transparent',
                    // },
                    offset: {vertical: 0, horizontal: 5}
                };
                const zoomedImageEle = document.querySelector('.js-image-zoom__zoomed-image');
                const zoomedAreaEle = document.querySelector('.js-image-zoom__zoomed-area');

                zoomedImageEle.remove();
                zoomedAreaEle.remove();
                const firt = new ImageZoom(document.querySelector(".product_gallery-imgBox"), options2);
                
            });
        })
    }

    function handleTabCommentDetail() {
        const $ = document.querySelector.bind(document);
        const $$ = document.querySelectorAll.bind(document);

        const tabs = $$('.tab-item');
        const panes = $$('.tab-pane-item');

        const tabActive = $('.tab-item.active');
        const line = $('.tab-line');

        line.style.left = tabActive.offsetLeft + 'px';
        line.style.width = tabActive.offsetWidth + 'px';

        tabs.forEach((tab, index) => {
            const pane = panes[index];
            
            tab.onclick = function () {
                var tabActive = $('.tab-item.active');
                var paneActive = $('.tab-pane-item.active');

                tabActive.classList.remove('active');
                paneActive.classList.remove('active');

                line.style.left = this.offsetLeft + 'px';
                line.style.width = this.offsetWidth + 'px';
                
                this.classList.add('active');
                pane.classList.add('active');
            }
        })
    };

    function handleSliderZoomImg() {
        $(document).ready(function() {
            $(".owl-carousel.product_gallery-imgslide").owlCarousel({
                margin:10,
                responsiveClass:true,
                dots: false,
                responsive:{
                    0:{
                        items:2,
                        nav:true,
                    },
                    480:{
                        items:3,
                        nav:true,
                    },
                    800:{
                        items:4,
                        nav:true,
                    },
                    900:{
                        items:5,
                        nav:true,
                    },
                    1200:{
                        items:5,
                        nav:true,
                    }
                }
            });
        });

        var options1 = {
            width: 200,
            height: 200,
            zoomWidth: 300,
            offset: {vertical: 0, horizontal: 10}
        };

        var options2 = {
            width: 300,
            height: 300,
            zoomWidth: 400,
            zoomStyle: {
                'z-index': 10,
            },
            offset: {vertical: 0, horizontal: 10}
        };

        new ImageZoom(document.querySelector(".product_gallery-imgBox"), options2);
    };

    function handleUpdateQuantity() {
        const subQuantityBtn = document.querySelector('#sub-quantity-btn');
        const addQuantityBtn = document.querySelector('#add-quantity-btn');
        const displayQuantityInput = document.querySelector('#quantity-input');

        subQuantityBtn.addEventListener('click', (e) => {
            var newQuantity = parseInt(displayQuantityInput.value)-1;

            displayQuantityInput.value = newQuantity>1 ? newQuantity : 1;
            return false;
        });

        addQuantityBtn.addEventListener('click', (e) => {
            var newQuantity = parseInt(displayQuantityInput.value)+1;

            displayQuantityInput.value = newQuantity;
            return false;
        });
    }

    function handleAddToCart() {
        const addToCartBtn = document.querySelector('#add-whistlist-btn');
        const buyNowBtn = document.querySelector('.product_body-action-buy');

        addToCartBtn.addEventListener('click', async (e) => {
            const form = document.querySelector('#form-product');
            const quantity = form.querySelector('#quantity-input').value;
            const name = form.querySelector('#name').value;
            const price_per_unit = form.querySelector('#price_per_unit').value;
            const slug = form.querySelector('#slug').value;
            const image = form.querySelector('#image').value;
            const product_id = form.querySelector('#product_id').value;

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
        });

        buyNowBtn.addEventListener('click', async (e) => {
            const form = document.querySelector('#form-product');
            const quantity = form.querySelector('#quantity-input').value;
            const name = form.querySelector('#name').value;
            const price_per_unit = form.querySelector('#price_per_unit').value;
            const slug = form.querySelector('#slug').value;
            const image = form.querySelector('#image').value;
            const product_id = form.querySelector('#product_id').value;

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

            window.location.replace("/cart");
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
})