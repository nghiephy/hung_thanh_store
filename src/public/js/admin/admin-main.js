
document.addEventListener('DOMContentLoaded', async function() {   
    const navItemEles = document.querySelectorAll('.nav-item');
    const navLayoutEle = document.querySelector('.navigation');
    const mbNavFulBtn = document.querySelector('.nav-full-btn');
    const afterLoginEle = document.querySelector('#admin-header-after-login');
    const imgEle = afterLoginEle.querySelector('.imgBox img');
    const usernameEle = afterLoginEle.querySelector('.username-user');

    const instance = axios.create({
        baseURL: '/',
        timeout: 3*1000, 
        headers: {
            'Content-Type': 'application/json',
        }
    });

    const accessToken = getCookie('accessToken');
    // let decodedToken = null;
    // if(accessToken){
    //     decodedToken = jwt_decode(accessToken);
    // }
    // if(decodedToken !== null && decodedToken.ACTIVE===1) {
    //     imgEle.setAttribute("src", `${decodedToken.PHOTO!==null?decodedToken.PHOTO:'/img/avatar.jpg'}`);
    //     usernameEle.innerHTML = decodedToken.NAME;
    // }

    instance.interceptors.request.use( 
        async (config) => {
            if(config.url.indexOf('/user/login') >=0 || config.url.indexOf('/user/logout') >=0 || config.url.indexOf('/user/refresh') >=0) {
                return config;
            }

            const accessToken = getCookie('accessToken');
            let decodedToken;
            if(accessToken){
                decodedToken = jwt_decode(accessToken);
           
                if(decodedToken.exp < Date.now()/1000) {
                    try {
                        const {accessToken} = (await instance.post('http://localhost:3000/user/refresh')).data;
                        return config;
                    }catch(err) {
                        return Promise.reject(err);
                    }
                }
            }

            return config;
        }, (err) => {
            return Promise.reject(err);
    });

    instance.interceptors.response.use( 
        async (response) => {
            console.log(response);

            return response;
        }, async (err) => {
            const originalConfig = err.config;
            if (err.response) {
                // Access Token was expired
                if (err.response.status === 401 && !originalConfig._retry) {
                    originalConfig._retry = true;
                    try {
                        const rs = await instance.post('http://localhost:3000/user/refresh');
                        const { accessToken } = rs.data;

                        return instance(originalConfig);
                    } catch (_error) {
                        if (_error.response && _error.response.data) {
                            return Promise.reject(_error.response.data);
                        }
                        return Promise.reject(_error);
                    }
                }
                if (err.response.status === 403 && err.response.data) {
                    return Promise.reject(err.response.data);
                  }
            }
            return Promise.reject(err);
    });

    if (performance.navigation.type == performance.navigation.TYPE_RELOAD) {
        const currentURL = window.location.href;
        const response = await instance.get(currentURL);
        // const {accessToken} = (await instance.post('http://localhost:3000/user/refresh')).data;
    } else {
    console.info( "This page is not reloaded");
    }

    // await instance.get('/admin');

    // request to load data cart & infor user if user authenticated
    if(accessToken) {
        // request to get information of user
        // display it into views
        const dataUser = await instance.get('/user/information');
        console.log(dataUser.data);
        if(dataUser.status === 200) {
            // beforeLoginEle.classList.add('d-none');
            // afterLoginEle.classList.remove('d-none');
            imgEle.setAttribute("src", `${dataUser.data.user.PHOTO!==null?dataUser.data.user.PHOTO:'/img/avatar.jpg'}`);
            usernameEle.innerHTML = dataUser.data.user.NAME;
        }
    }

    // Handle click button toggle navigation in the left
    navItemEles.forEach(navItemEle => {
        navItemEle.addEventListener('click', (e) => {
            const navItemActiveEle = document.querySelector('.nav-item.active');

            navItemActiveEle.classList.remove('active');
            navItemEle.classList.add('active');
        });
    });

    // Handle display modal
    handleModal();

    // Handle click UI
    handleClick();

    //Handle submit form logout button
    const buttonLogout = document.querySelector('#admin-header-top-config-item-logout');
    buttonLogout.addEventListener('click', async (e) => {
        window.localStorage.removeItem('cart');
        window.localStorage.removeItem('accessToken');
        await instance.post('http://localhost:3000/user/logout');
        window.location.replace("/");
    })

    // Handle display small nav when screen.width < 1023px
    var onresize = function() {
        var width = document.body.clientWidth;
        if(width <= 1023) {
            const iconNav = mbNavFulBtn.querySelector('i');

            iconNav.classList.remove('fa-chevron-left');
            iconNav.classList.add('fa-chevron-right');
            navLayoutEle.classList.add('small');
            console.log("small");
        }
        if(width > 1023) {
            const iconNav = mbNavFulBtn.querySelector('i');

            iconNav.classList.remove('fa-chevron-right');
            iconNav.classList.add('fa-chevron-left');
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
    });

    function handleClick() {
        const dashboardBtn = document.getElementById('nav-item-dashboard-btn');
        const allProductBtn = document.getElementById('nav-item-all-product-btn');
        const addProductBtn = document.getElementById('nav-item-add-product-btn');
        const manageOrdersBtn = document.getElementById('nav-item-manage-order-btn');
        const getTrashBtn = document.getElementById('admin-trash-btn');
        const returnAllProBtn = document.getElementById('all-product-btn');
        const updateProductBtns = document.querySelectorAll('.admin-product-item--update');
        const btnDeleteProduct = document.getElementById('admin-product-delete-btn');
        const restoreProductBtns = document.querySelectorAll('.trash-product-item-restore');
        const destroyProductBtns = document.querySelectorAll('.trash-product-item-destroy');
        var confirmDeleteMulBtn = document.querySelector('#admin-product-item--delete-mul');
        var headerAdminOptionsBtn = document.querySelector('#header-top-config-options');
        const optionsPopup = headerAdminOptionsBtn.querySelector('.user-options-popup');
        var idProductArray = [];

        document.addEventListener('click', (e) => {
            let targetElement = e.target;

            do {
                if(targetElement == headerAdminOptionsBtn) {
                    optionsPopup.classList.toggle('active');
                    return;
                }
                targetElement = targetElement.parentNode;
            }while(targetElement);
            
            optionsPopup.classList.remove('active');
        });

        dashboardBtn.addEventListener('click', e => {
            getDashboard();
        });

        allProductBtn.addEventListener('click', e => {
            getAllProduct();
        });

        addProductBtn.addEventListener('click', e => {
            addProduct();
        });

        manageOrdersBtn.addEventListener('click', e => {
            getManageOrders();
        });

        if(getTrashBtn) {
            getTrashBtn.addEventListener('click', e => {
                getTrash();
            });
        }
        if(returnAllProBtn) {
            returnAllProBtn.addEventListener('click', e => {
                getAllProduct();
            });
        }
        if(updateProductBtns) {
            updateProductBtns.forEach( (updateProductBtn) => {
                updateProductBtn.addEventListener('click', e => {
                    const pathUpdate = updateProductBtn.getAttribute('href');
                    updateProduct(pathUpdate);
                });
            })
        }
        if(btnDeleteProduct) {
            btnDeleteProduct.onclick = function () {
                var deleteProductForm = document.forms['delete-product-form'];
                const pathSoftDelete = deleteProductForm.getAttribute('action');
                console.log(pathSoftDelete);
                softDeleteProduct(pathSoftDelete);
            };
        }
        if(restoreProductBtns) {
            restoreProductBtns.forEach( (restoreProductBtn) => {
                restoreProductBtn.addEventListener('click', e => {
                    const pathRestore = restoreProductBtn.getAttribute('href');
                    restoreProduct(pathRestore);
                });
            })
        }
        if(destroyProductBtns) {
            destroyProductBtns.forEach( (destroyProductBtn) => {
                destroyProductBtn.addEventListener('click', e => {
                    const pathDestroy = destroyProductBtn.getAttribute('href');
                    destroyProduct(pathDestroy);
                });
            })
        }
        if(confirmDeleteMulBtn) {
            confirmDeleteMulBtn.onclick = function() {
                const checkboxes = document.querySelectorAll('input[name="checkbox-delete"]');
                checkboxes.forEach(item => {
                    if(item.checked==true) {
                        idProductArray.push(Number(item.value));
                    }
                })
                softDeleteProduct('/admin/soft-delete/null', idProductArray);
            }
        }

    };

    async function getDashboard() {
        const dataDashboard = await instance.get("/admin");
        location.replace(dataDashboard.request.responseURL);
        // location.reload(true);
    }

    async function getManageOrders() {
        const dataDashboard = await instance.get("/admin/orders");
        location.replace(dataDashboard.request.responseURL);
        // location.reload(true);
    }

    async function getAllProduct() {
        const dataDashboard = await instance.get("/admin/products");
        location.replace(dataDashboard.request.responseURL);
        // location.reload(true);
    }

    async function addProduct() {
        const dataDashboard = await instance.get("/admin/add-product");
        location.replace(dataDashboard.request.responseURL);
    }

    async function getTrash() {
        const getTrash = await instance.get("/admin/trash");
        location.replace(getTrash.request.responseURL);
    }

    async function updateProduct(pathUpdate) {
        const updateProduct = await instance.get(pathUpdate);
        location.replace(updateProduct.request.responseURL);
    }

    async function softDeleteProduct(pathSoftDelete, idProductArray) {
        const dataIdProduct = JSON.stringify(idProductArray);
        console.log(dataIdProduct);
        const softDeleteResponse = await instance.post(pathSoftDelete, {
            id_product_array: dataIdProduct,
        });

        if(softDeleteResponse.data.message === 'success') {
            window.location.reload();
        }
    }
    async function restoreProduct(pathRestore) {
        const pathRestoreResponse = await instance.put(pathRestore);
        if(pathRestoreResponse.data.message === 'success') {
            window.location.reload();
        }
    }
    async function destroyProduct(pathDestroy) {
        const pathDestroyResponse = await instance.delete(pathDestroy);
        if(pathDestroyResponse.data.message === 'success') {
            window.location.reload();
        }
    }
});

function getParent (element, selector) {
    while (element.parentElement) {
        if(element.parentElement.matches(selector)) {
            return element.parentElement
        }
        element = element.parentElement
    }
}

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