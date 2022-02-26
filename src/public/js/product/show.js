document.addEventListener('DOMContentLoaded', function() {
    const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document);

    const tabs = $$('.tab-item');
    const panes = $$('.tab-pane-item');

    const tabActive = $('.tab-item.active');
    const line = $('.tab-line');

    console.log(line);

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

})