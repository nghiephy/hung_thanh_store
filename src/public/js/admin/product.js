
document.addEventListener('DOMContentLoaded', function() {
    var dataTable;
    $(document).ready(function() {
        dataTable = $('#admin-product-table').DataTable( {
            "scrollY": '100%',
            "scrollX": true,
            "aoColumnDefs": [
                { "bSortable": false, "aTargets": [ 0 ] }, 
                { "bSearchable": false, "aTargets": [ 0 ] }
            ],
            "colReorder": {
                realtime: false
            }
        } );
    } );
    var deleteModal = document.getElementById('admin-product-item--delete');
    var btnDeleteMulProduct = document.getElementById('admin-delete-mul-btn');
    var deleteMulOptionsEle = document.querySelector('.delete-mul-options-wrap');
    var cancelDeleteMulBtn = document.querySelector('.delete-mul-options-item.cancel-btn');
    var confirmDeleteMulBtn = document.querySelector('.delete-mul-options-item.confirm-btn');
    var checkAllBtn = document.querySelector('#delete-all-product-ck-all');
    var deleteMulCheckboxs = document.querySelectorAll('.admin-product-checkbox-wrap');
    var deleteProductForm = document.forms['delete-product-form'];
    var idProduct;
    var idProductArray = [];

    deleteModal.addEventListener('show.bs.modal', function (event) {
        var button = event.relatedTarget;
        idProduct = button.getAttribute('data-bs-id')
        deleteProductForm.action = '/admin/soft-delete/' + idProduct;
    })

    btnDeleteMulProduct.onclick = function () {

        deleteMulCheckboxs.forEach(deleteMulCheckbox => {
            deleteMulCheckbox.style.display = "block";
        })
        deleteMulOptionsEle.classList.toggle('d-none');
        btnDeleteMulProduct.classList.toggle('d-none');
        if(dataTable != null) {
            dataTable.destroy();
        }
        dataTable = $('#admin-product-table').DataTable( {
            "scrollY": '100%',
            "scrollX": true,
            "aoColumnDefs": [
                { "bSortable": false, "aTargets": [ 0 ] }, 
                { "bSearchable": false, "aTargets": [ 0 ] }
            ],
            "colReorder": {
                realtime: false
            }
        } );
    };

    cancelDeleteMulBtn.onclick = function () {
        
        deleteMulCheckboxs.forEach(deleteMulCheckbox => {
            deleteMulCheckbox.style.display = "none";
        })
        deleteMulOptionsEle.classList.toggle('d-none');
        btnDeleteMulProduct.classList.toggle('d-none');
        
        if(dataTable != null) {
            dataTable.destroy();
        }
        dataTable = $('#admin-product-table').DataTable( {
            "scrollY": '100%',
            "scrollX": true,
            "aoColumnDefs": [
                { "bSortable": false, "aTargets": [ 0 ] }, 
                { "bSearchable": false, "aTargets": [ 0 ] }
            ],
            "colReorder": {
                realtime: false
            }
        } );
    }

    confirmDeleteMulBtn.addEventListener('show.bs.modal', function (event) {
        var button = event.relatedTarget;
    });

    checkAllBtn.onclick = checkAll;

    function check(checked = true) {
        const checkboxes = document.querySelectorAll('input[name="checkbox-delete"]');
        checkboxes.forEach((checkbox) => {
          checkbox.checked = checked;
        });
    }
    function checkAll() {
        check();
        this.onclick = uncheckAll;
    }
    function uncheckAll() {
        check(false);
        this.onclick = checkAll;
      }
});