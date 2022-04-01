function toast({
    title ='',
    message='', 
    type='info', 
    duration=3000
}) {
    const main = document.getElementById('my-toast');
    if(main){
        const toast = document.createElement('div');

        //Auto remove
        var autoRemove = setTimeout(function (){
            main.removeChild(toast);
        }, duration + 1000);

        // Remove when clicked
        toast.onclick = function(e){
            if(e.target.closest('.my-toast__close')){
                main.removeChild(toast);
                clearTimeout(autoRemove);
            }
        }

        const icons = {
            success: 'far fa-check-circle',
            info: 'fas fa-info-circle',
            warning: 'fas fa-exclamation-triangle',
            error: 'fas fa-exclamation-circle'
        }
        const icon = icons[type];
        const delay = (duration/1000).toFixed(2);

        toast.classList.add('my-toast', `my-toast--${type}`);
        toast.style.animation = `slideInLeft ease 0.3s, fadeOut linear 1s ${delay}s forwards`;
        toast.innerHTML = `
            <div class="my-toast__icon">
                <i class="${icon}"></i>
            </div>
            <div class="my-toast__body">
                <h3 class="my-toast__title">${title}</h3>
                <p class="my-toast__msg">${message}</p>
            </div>
            <div class="my-toast__close">
                <i class="fas fa-times"></i>
            </div>
        `;

        main.appendChild(toast);

    }
};

function showSuccessAddCartToast () {
    toast({
        title: 'Thông báo',
        message: 'Thêm sản phẩm vào giỏ hàng thành công!!',
        type: 'success',
        duration: 2000
    });
};

function showErrorToast () {
    toast({
        title: 'Error',
        message: 'Anyone with access can view your invited visitor',
        type: 'error',
        duration: 5000
    });
}

