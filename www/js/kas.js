function simpanModal(uang){
    var modal = uang.replace(/\D/g, '');
    dailyModal = modal;

    NativeStorage.setItem('modal', modal, function(obj){
        var dt = new Date();
        var yr = dt.getFullYear();
        var mt = ('00'+(dt.getMonth() + 1)).slice(-2);
        var dy = ('00'+dt.getDate()).slice(-2);
        var hr = ('00'+dt.getHours()).slice(-2);
        var mn = ('00'+dt.getMinutes()).slice(-2);
        var sc = ('00'+dt.getSeconds()).slice(-2);

        var timestamp_dtl = yr+'-'+mt+'-'+dy+' '+hr+':'+mn+':'+sc;
        // var timestamp = yr+'-'+mt+'-'+dy;
        var temp = {
            st_cash : dailyModal,
            tgl : timestamp_dtl
        };

        app.request({
            url: site+"/API/opening/"+cpyProf.ID_CLIENT+'/'+cpyProf.ID,
            method: "POST",
            data: JSON.stringify(temp),
            success: function(result){
                var parsed = JSON.parse(result);
                if(parsed.ST_CODE == '1'){
                    $('#menu_penjualan').css('display', '');
                    $('#modal_awal').css('display', 'none');
                } else {
                    alert('Gagal menyimpan modal awal');
                }
            }
        });
    })
}

function prosesKas(jenis, form){
    var dt = new Date();
    var fulldate = dt.getFullYear()+ '-' +('00' +(dt.getMonth()+1)).slice(-2)+ '-' +('00' +dt.getDate()).slice(-2);
    var formData = app.form.convertToData(form);
    var dest = '';
    var form;
  
    switch(jenis){
      case 'masuk':
        dest = 'kasmasuk';
        form = '#form_kasmasuk';
        break;
      case 'keluar':
        dest = 'kaskeluar';
        form = '#form_kaskeluar';
        break;
    }
  
    formData.tgl = fulldate;

    app.request({
        url: site+'/API/'+dest+'/'+cpyProf.ID_CLIENT+'/'+cpyProf.ID,
        method: 'POST',
        data: JSON.stringify(formData),
        success: function(result){
            var parsed = JSON.parse(result);
            if(parsed.ST_CODE == '1'){
                alert('Sukses');
                // $(form).trigger('reset');
                app.views.main.router.navigate('/home/');
            } else {
                console.log('Gagal upload kas');
            }
        }
    })
}