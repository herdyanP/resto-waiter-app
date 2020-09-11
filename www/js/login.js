function onNewLogin(q){
    $('#login_button').addClass('disabled');
    var formData = app.form.convertToData('#login_cred');
    
    app.request({
        url: site+'/API/login/',
        method: 'POST',
        data: JSON.stringify(formData),
        timeout: 10 * 1000,
        success: function(result){
            var parsed = JSON.parse(result);
            if(parsed.ST_CODE == '1'){
                // console.log(parsed);
                // temp.nama = parsed[0].NAMA;
                // temp.cabang = parsed[0].nama_cabang;
                // temp.outlet = parsed[0].nama_outlet;
                // temp.client = parsed[0].nama_client;
                // temp.id_cabang = parsed[0].id_cabang;
                // temp.id_client = parsed[0].id_client;
                // temp.id_outlet = parsed[0].id_outlet;
                // temp.alamat = parsed[0].alamat;
                // temp.id_user = parsed[0].ID;
                // temp.jenis = parsed[0].jenis_outlet;
                
                // logoByte64 = parsed[0].image;
                // initGambar(parsed[0].image);
                
                NativeStorage.setItem('akun', parsed, onStoreSuccess, onStoreFail);
            } else {
                app.toast.create({
                    text: "Cek lagi username / password anda",
                    closeTimeout: 3000,
                    closeButton: true
                }).open();
            }
        },
        error: function(){
            app.toast.create({
                text: "Koneksi ke Server Gagal",
                closeTimeout: 3000,
                closeButton: true
            }).open();
        },
        complete: function(){
            $('#login_button').removeClass('disabled');
        }
    })
}

function onStoreSuccess(obj){
    console.log('Store Success');
    
    cpyProf = obj;
    $('#panel_subTitle').html('<br><strong>MediaPOS '+(cpyProf.jenis == 1 ? "F&amp;B" : "Retail")+'</strong><br>POS Application<br>'+cpyProf.outlet);
    app.views.main.router.navigate('/home/');
}

function onStoreFail(){
    console.log('Store Fail');
}