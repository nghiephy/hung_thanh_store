
handleModal();

// Handle modal display
function handleModal() {
    const modalOverlayEle = document.querySelector('.modal__overlay');
    const modalEle = document.querySelector('.modal');
    const modalExitBtns = document.querySelectorAll('.modal__theme-exit');
    const modalLabelList = document.querySelectorAll('.modal-label');
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

}