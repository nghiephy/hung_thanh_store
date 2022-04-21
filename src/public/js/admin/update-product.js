document.addEventListener('DOMContentLoaded', function()  {
    $(document).ready(function(){
        $(".owl-carousel.images_product-slider").owlCarousel({
            loop:true,
            margin:10,
            responsiveClass:true,
            dots: false,
            responsive:{
                0:{
                    items:1,
                    nav:true
                },
                600:{
                    items:3,
                    nav:true
                },
                1000:{
                    items:6,
                    nav:true,
                    loop:false
                }
            }
        });
    });
    
    CKEDITOR.replace('update-description-ckeditor', {
    extraPlugins: 'filebrowser',
    filebrowserBrowseUrl: '/list',
    filebrowserUploadMethod: 'form',
    filebrowserUploadUrl: '/admin/upload',
    entities_latin: false,
    entities_greek: false,
    });
});