
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