
document.addEventListener('DOMContentLoaded', function() {
    $(document).ready(function() {
        $('#admin-product-table').DataTable( {
            "scrollY": '100%',
            "scrollX": true
        } );
    } );
    var deleteModal = document.getElementById('admin-product-item--delete');
    var btnDeleteProduct = document.getElementById('admin-product-delete-btn');
    var deleteProductForm = document.forms['delete-product-form'];
    var idProduct;

    deleteModal.addEventListener('show.bs.modal', function (event) {
        var button = event.relatedTarget
        idProduct = button.getAttribute('data-bs-id')

        
    })

    btnDeleteProduct.onclick = function () {
        deleteProductForm.action = 'soft-delete/' + idProduct + '?_method=DELETE';
        deleteProductForm.submit();
    };
});