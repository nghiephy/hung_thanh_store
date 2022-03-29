document.addEventListener('DOMContentLoaded', function() {

    handleCLickUI();

    function handleCLickUI() {

        handleTabCommentDetail();
        handleImageList();
        handleSliderZoomImg();
        
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
                    zoomWidth: 400,
                    zoomStyle: {
                        'z-index': 10,
                    },
                    zoomLensStyle: {
                        'opacity': 0,
                        'background-color': 'transparent',
                    },
                    offset: {vertical: 0, horizontal: 5}
                };
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
            zoomWidth: 400,
            zoomStyle: {
                'z-index': 10,
            },
            offset: {vertical: 0, horizontal: 5}
        };

        new ImageZoom(document.querySelector(".product_gallery-imgBox"), options2);
    };
})