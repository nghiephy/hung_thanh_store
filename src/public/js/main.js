import { loadCartHeader,loadCartListHeader, deleteCarProHeader } from './modules/header-module.js';

document.addEventListener('DOMContentLoaded', function() {
    handleModal();
    loadDataHeader();
    deleteCarProHeader();

    // Load data into header layout
    function loadDataHeader() {
        loadCartHeader();
        loadCartListHeader();
    } 

    // Handle modal display
    function handleModal() {
        const modalOverlayEle = document.querySelector('.modal__overlay');
        const modalEle = document.querySelector('.modal');
        const modalExitBtns = document.querySelectorAll('.modal__theme-exit');
        const modalLabelList = document.querySelectorAll('.modal-label');
        const closeSuccessModalBtn = document.querySelector('.successful-body__button button');
        let modalItem;
        
        modalLabelList.forEach(modalLabel => {
            modalLabel.addEventListener('click', (e) => {
                modalItem = document.getElementById(modalLabel.dataset.modalId);

                modalItem.classList.add('active');
                modalEle.classList.add('active');
            })
        })

        modalOverlayEle.addEventListener('click', () => {
            modalItem.classList.remove('active');
            modalEle.classList.remove('active');
        })

        modalExitBtns.forEach(modalExitBtn => {
            modalExitBtn.addEventListener('click', () => {
                modalItem.classList.remove('active');
                modalEle.classList.remove('active');
            }) 
        })

        closeSuccessModalBtn.addEventListener('click', (e) => {
            modalItem.classList.remove('active');
            modalEle.classList.remove('active');
            window.location.replace("/");
        })

    }

});

function loadPageFirst() {

}




