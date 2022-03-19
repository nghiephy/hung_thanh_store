
loadCitisDisWard();
toggleLayout();


function loadCitisDisWard() {
    var citis = document.getElementById("city");
    var districts = document.getElementById("district");
    var wards = document.getElementById("ward");
    var Parameter = {
        url: '/json/vietnam.json',//Đường dẫn đến file chứa dữ liệu hoặc api do backend cung cấp
        method:'GET', //do backend cung cấp 
        responseType: 'application/json', //kiểu Dữ liệu trả về do backend cung cấp
    }
    //gọi ajax = axios => nó trả về cho chúng ta là một promise
    var promise = axios(Parameter);
    //Xử lý khi request thành công
    promise.then(function(result) {
        renderCity(result.data);
        console.log(result.data);
    });

    function renderCity(data){
        for (const x of data) {
            citis.options[citis.options.length] = new Option(x.Name, x.Id);
        };

        citis.onchange = function () {
            district.length = 1;
            ward.length = 1;
        
            console.log(districts);
            if(this.value != "") {
                const result = data.filter(n => n.Id === this.value);
        
                for(const k of result[0].Districts) {
                    district.options[district.options.length] = new Option(k.Name, k.Id);
                }
            }
        };

        district.onchange = function () {
            ward.length = 1;
            const dataCitis = data.filter(n => n.Id === citis.value);

            if(this.value != "") {
                const dataWards = dataCitis[0].Districts.filter(n => n.Id === this.value)[0].Wards;

                for (const w of dataWards) {
                    wards.options[wards.options.length] = new Option(w.Name, w.Id);
                }
            }
        };
    }
}

function toggleLayout() {
    const invoiceCk = document.querySelector('#invoice-ck');
    const formInvoice = document.querySelector('.form-invoice');

    invoiceCk.addEventListener('click', (e) => {
        formInvoice.classList.toggle('active');
    })
}
