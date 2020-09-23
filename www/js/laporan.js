function laporanPenjualan(){
    var b = document.getElementById('tgl_awal');
    var c = document.getElementById('tgl_akhir');
    var jenis;
    
    var datanya = 
        '<table>\
            <thead>\
                <tr>\
                <th class="label-cell">No. Penjualan</th>\
                <th>Tanggal Penjualan</th>\
                <th class="numeric-cell">Total Penjualan</th>\
                <th>Jenis Pembayaran</th>\
                </tr>\
            </thead>\
            <tbody>';
  
    var data = {
        'act' : 'penjualan',
        'tgl' : b.value,
        'tglsd' : c.value
    }

    app.request({
        url: site+'/API/laporan/'+cpyProf.ID_CLIENT+'/'+cpyProf.ID,
        method: 'POST',
        data: JSON.stringify(data),
        success: function(result){
            var parsed = JSON.parse(result);
            if(parsed.ST_CODE == '1'){
                var iter = parsed.DATA
                for(var i = 0; i < iter.length; i++){
                    switch (iter[i].jenis_bayar){
                        case '1':
                            jenis = 'Tunai';
                        break;
                        case '2':
                            jenis = 'Kartu Kredit';
                        break;
                        case '3':
                            jenis = 'E-Money';
                        break;
                    }
              
                    if(i == 0){
                        datanya += '<tr><td class="label-cell">'+iter[i].no_penjualan+'</td><td>'+iter[i].tgl_penjualan+'</td><td class="numeric-cell">'+parseInt(iter[i].total_jual).toLocaleString(locale)+'</td><td>'+jenis+'</td></tr>';
                    }else if(iter[i].no_penjualan != iter[i-1].no_penjualan){
                        datanya += '<tr><td class="label-cell">'+iter[i].no_penjualan+'</td><td>'+iter[i].tgl_penjualan+'</td><td class="numeric-cell">'+parseInt(iter[i].total_jual).toLocaleString(locale)+'</td><td>'+jenis+'</td></tr>';
                    }
                }
              
                datanya += '</tbody></table>';
                $('#table_penjualan').html(datanya);
            } else {

            }
        }
    })
}
  
function unduhLaporan(){
    var tgl = $('#tgl_awal').val();
    var tglsd = $('#tgl_akhir').val();
    window.open(site+'/cetak.php?page=lappenbar&a=' +tgl+ '&b=' +tglsd+ '&id=' +cpyProf.id_outlet, '_self');
}
  
function laporanPerItem(){
    var b = document.getElementById('tgl_awal');
    var c = document.getElementById('tgl_akhir');
  
    var datanya = 
        '<table>\
            <thead>\
                <tr>\
                    <th class="label-cell">Nama Barang</th>\
                    <th class="numeric-cell">Jumlah Terjual</th>\
                    <th class="numeric-cell">Total Penjualan</th>\
                </tr>\
            </thead>\
          <tbody>';
  
    var data = {
        'act' : 'item',
        'tgl' : b.value,
        'tglsd' : c.value
    }
  
    app.request({
        url: site+'/API/laporan/'+cpyProf.ID_CLIENT+'/'+cpyProf.ID,
        method: 'POST',
        data: JSON.stringify(data),
        success: function(result){
            var parsed = JSON.parse(result);
            if(parsed.ST_CODE == '1'){
                var iter = parsed.DATA;
                for(var i = 0; i < iter.length; i++){
                    datanya += 
                        '<tr>\
                            <td class="label-cell">'+iter[i].nama_barang+'</td>\
                            <td class="numeric-cell">'+iter[i].jml+'</td>\
                            <td class="numeric-cell">'+parseInt(iter[i].total).toLocaleString(locale)+'</td>\
                        </tr>';
                }
            } 
  
        datanya += '</tbody></table>';
        $('#table_item').html(datanya);
      }
    })
  }