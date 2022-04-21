
document.addEventListener('DOMContentLoaded', function() {
    
    const navItemEles = document.querySelectorAll('.nav-item');
    const navLayoutEle = document.querySelector('.navigation');
    const mbNavFulBtn = document.querySelector('.nav-full-btn');

    navItemEles.forEach(navItemEle => {
        navItemEle.addEventListener('click', (e) => {
            const navItemActiveEle = document.querySelector('.nav-item.active');

            navItemActiveEle.classList.remove('active');
            navItemEle.classList.add('active');
        });
    });

    // Handle display modal
    handleModal();

    // Handle display small nav when screen.width < 1023px
    var onresize = function() {
        var width = document.body.clientWidth;
        if(width <= 1023) {
            navLayoutEle.classList.add('small');
            console.log("small");
        }
        if(width > 1023) {
            navLayoutEle.classList.remove('small');
        }
        if(width <= 1635) {
            // listMusicEle.classList.remove('active');
        }
    }
    window.addEventListener("resize", onresize);

    // Handle when click button display full nav layout
    mbNavFulBtn.addEventListener('click', (e) => {
        navLayoutEle.classList.toggle('small');
        mbNavFulBtn.querySelector('i').classList.toggle('fa-chevron-right');
        mbNavFulBtn.querySelector('i').classList.toggle('fa-chevron-left');
    })
})



function handleModal() {
    const modalExitBtns = document.querySelectorAll('.modal__theme-exit');
    const closeSuccessModalBtn = document.querySelector('.successful-body__button button');
    const modalItem = document.querySelector('#modal-successful');
    const modalEle = document.querySelector('.my-modal');

    modalExitBtns.forEach(modalExitBtn => {
        modalExitBtn.addEventListener('click', () => {
            modalItem.classList.remove('active');
            modalEle.classList.remove('active');
        }) 
    })

    closeSuccessModalBtn.addEventListener('click', (e) => {
        modalItem.classList.remove('active');
        modalEle.classList.remove('active');
    })
}