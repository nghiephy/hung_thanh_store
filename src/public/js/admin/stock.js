
document.addEventListener('DOMContentLoaded', function() {
    $(document).ready(function() {
        $('#admin-stock-table').DataTable( {
            "scrollY": '100%',
            "scrollX": true
        } );
    } );

    const importStockEle = document.querySelector('#admin-stock-item--import');
    const importStockForm = document.querySelector('#admin-stock-item-form');

    importStockEle.addEventListener('show.bs.modal', function (event) {
        var button = event.relatedTarget;
        idStock = button.getAttribute('data-bs-stock-id')
        importStockForm.action = '/admin/import-stock/' + idStock;
    });

    // Validate form
    validateForm();

    function validateForm() {
        Validator({
            form: '#admin-stock-item-form',
            formGroupSelector: '.form-group',
            errorSelector: '.form-message',
            onSubmit: async function (dataForm) {

            },
            rules: [
                Validator.isRequired('#admin-stock-item-quantity', 'Vui lòng nhập số lượng'),
            ]
        })
    }
});