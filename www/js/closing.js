function closingSales(){
    var dt = new Date();
    var yr = dt.getFullYear();
    var mt = ('00'+(dt.getMonth() + 1)).slice(-2);
    var dy = ('00'+dt.getDate()).slice(-2);
    var hr = ('00'+dt.getHours()).slice(-2);
    var mn = ('00'+dt.getMinutes()).slice(-2);
    var sc = ('00'+dt.getSeconds()).slice(-2);
  
    var discrp = 0;

    var c_stamp = yr+'-'+mt+'-'+dy+' '+hr+':'+mn+':'+sc;
    var stamp_sv = $('#stamp_sv').val();
    
    var sales = {
      act: 'cl_penjualan',
      tgl: stamp_sv
    }

    app.request({
        url: site+'/API/laporan/'+cpyProf.ID_CLIENT+'/'+cpyProf.ID,
        method: 'POST',
        data: JSON.stringify(sales),
        success: function(result){
            var parsed = JSON.parse(result);
            var datanya = '<li class="item-divider">Jenis Pembayaran</li>';
            if(parsed.ST_CODE == '1'){
                $('#closing_button').css('display', 'block');

                var iter = parsed.DATA;
                var tunai = 0, cc = 0, emoney = 0, c = 0;
                $('#tx_first').val(iter[0].id_pj);
                for(var i = 0; i < iter.length; i++){
                    c++;
                    discrp += parseInt(iter[i].disc_rp);
                    switch (iter[i].jenis_bayar){
                        case '1':
                            console.log(parseInt(iter[i].grantot_jual));
                            tunai += (iter[i].grantot_jual ? parseInt(iter[i].grantot_jual) : 0);
                            break;
                        case '2':
                            console.log(iter[i].grantot_jual);
                            cc += (iter[i].grantot_jual ? parseInt(iter[i].grantot_jual) : 0);
                            break;
                        case '3':
                            console.log(iter[i].grantot_jual);
                            emoney += (iter[i].grantot_jual ? parseInt(iter[i].grantot_jual) : 0);
                            break;
                    }
                }

                $('#cl_discrp').val(discrp);
                $('#tx_count').val(c);

                datanya += 
                    '<li>\
                        <div class="item-content">\
                            <div class="item-inner">\
                                <div class="item-title">Tunai</div>\
                                <div class="item-after">'+tunai.toLocaleString("id-ID")+'</div>\
                            </div>\
                        </div>\
                    </li>\
                    <li>\
                        <div class="item-content">\
                            <div class="item-inner">\
                                <div class="item-title">Kartu Debit/Kredit</div>\
                                <div class="item-after">'+cc.toLocaleString("id-ID")+'</div>\
                            </div>\
                        </div>\
                    </li>\
                    <li>\
                        <div class="item-content">\
                            <div class="item-inner">\
                                <div class="item-title">E-Money</div>\
                                <div class="item-after">'+emoney.toLocaleString("id-ID")+'</div>\
                            </div>\
                        </div>\
                    </li>\
                    <li>\
                        <div class="item-content">\
                            <div class="item-inner">\
                                <div class="item-title">Total</div>\
                                <div class="item-after">'+(tunai + cc + emoney).toLocaleString("id-ID")+'</div>\
                            </div>\
                        </div>\
                    </li>';
      
                $('#ul_closing_sales').html(datanya);
                $('#ul_closing_total').html((parseInt(tunai) + parseInt(cc) + parseInt(emoney)).toLocaleString('id-ID'));
                $('#cl_sales').val(parseInt(tunai) + parseInt(cc) + parseInt(emoney));
            
                cl_tu = tunai;
                cl_cc = cc;
                cl_em = emoney;
            
                $('#ul_current_uang').val((parseInt(tunai) + parseInt(dailyModal)).toLocaleString('id-ID'));
            } else {
                datanya += 
                    '<li>\
                        <div class="item-content">\
                            <div class="item-inner">\
                            <div class="item-title"><strong>BELUM ADA TRANSAKSI</strong></div>\
                            </div>\
                        </div>\
                    </li>';
  
                $('#ul_closing_sales').html(datanya);
                $('#ul_closing_total').html(0);
                $('#ul_current_uang').val((parseInt(dailyModal)).toLocaleString('id-ID'));
            }

            closingKategori(stamp_sv, discrp);
        }
    })  
}

function closingKategori(stamp_sv, discrp){
    var items = {
        act: 'cl_kategori',
        tgl: stamp_sv
    };

    app.request({
        url: site+'/API/laporan/'+cpyProf.ID_CLIENT+'/'+cpyProf.ID,
        method: 'POST',
        data: JSON.stringify(items),
        success: function(result){
            var parsed = JSON.parse(result);
            var datanya = '<li class="item-divider">Kategori Item</li>';
            if(parsed.ST_CODE == '1'){
                var total = 0;
                var iter = parsed.DATA;
                // var result = JSON.parse(json);
                for(var i = 0; i < iter.length; i++){
                    cl_items.push(iter[i]);
                    total += parseInt(iter[i].total);
                    datanya += 
                        '<li>\
                            <div class="item-content">\
                                <div class="item-inner">\
                                <div class="item-title">'+iter[i].nama_kategori+'</div>\
                                <div class="item-after">'+parseInt(iter[i].total).toLocaleString("id-ID")+'</div>\
                                </div>\
                            </div>\
                        </li>';
                }
    
                datanya += 
                    '<li>\
                        <div class="item-content">\
                            <div class="item-inner">\
                                <div class="item-title">Diskon</div>\
                                <div class="item-after">- '+discrp.toLocaleString("id-ID")+'</div>\
                            </div>\
                        </div>\
                    </li>\
                    <li>\
                        <div class="item-content">\
                            <div class="item-inner">\
                                <div class="item-title">Total</div>\
                                <div class="item-after">'+(total - discrp).toLocaleString("id-ID")+'</div>\
                            </div>\
                        </div>\
                    </li>';
        
                $('#ul_closing_item').html(datanya);
            } else {
                datanya += 
                    '<li>\
                        <div class="item-content">\
                            <div class="item-inner">\
                                <div class="item-title"><strong>BELUM ADA TRANSAKSI</strong></div>\
                            </div>\
                        </div>\
                    </li>';

                $('#ul_closing_item').html(datanya);
            }

            closingKaskeluar(stamp_sv);
        }
    })
}

function closingKaskeluar(stamp_sv){
    var tot_keluar = 0;
    var tot_uang = parseInt($('#ul_current_uang').val().replace(/\D/g, ''));
    var items = {
        act: 'cl_kaskeluar',
        tgl: stamp_sv
    };

    app.request({
        url: site+'/API/laporan/'+cpyProf.ID_CLIENT+'/'+cpyProf.ID,
        method: 'POST',
        data: JSON.stringify(items),
        success: function(result){
            var parsed = JSON.parse(result);
            var datanya = '<li class="item-divider">Pengeluaran Kas</li>';
            if(parsed.ST_CODE == '1'){
                var iter = parsed.DATA;
                cl_kaskeluar = iter;
                for(var i = 0; i < iter.length; i++){
                    // cl_kaskeluar.push(iter[i]);
                
                    tot_keluar += parseInt(iter[i].JUMLAH);
                    datanya += 
                        '<li>\
                            <div class="item-content">\
                                <div class="item-inner">\
                                    <div class="item-title">'+iter[i].URAIAN+'</div>\
                                    <div class="item-after">'+parseInt(iter[i].JUMLAH).toLocaleString("id-ID")+'</div>\
                                </div>\
                            </div>\
                        </li>';
                }
                
                cl_kk = tot_keluar;
                $('#ul_uang_keluar').val(tot_keluar.toLocaleString('id-ID'));
                $('#ul_current_uang').val((tot_uang - tot_keluar).toLocaleString('id-ID'));
                $('#ul_closing_keluar').html(datanya);
            } else {
                datanya += 
                    '<li>\
                        <div class="item-content">\
                            <div class="item-inner">\
                                <div class="item-title"><strong>BELUM ADA PENGELUARAN KAS</strong></div>\
                            </div>\
                        </div>\
                    </li>';
        
                $('#ul_closing_keluar').html(datanya);
            }

            closingKasmasuk(stamp_sv);
        }
    })
}

function closingKasmasuk(stamp_sv){
    var tot_uang = parseInt($('#ul_current_uang').val().replace(/\D/g, ''));
    var tot_masuk = 0;
    var items = {
        act: 'cl_kasmasuk',
        tgl: stamp_sv
    };

    app.request({
        url: site+'/API/laporan/'+cpyProf.ID_CLIENT+'/'+cpyProf.ID,
        method: 'POST',
        data: JSON.stringify(items),
        success: function(result){
            var datanya = '<li class="item-divider">Penerimaan Kas</li>';
            var parsed = JSON.parse(result);

            if(parsed.ST_CODE == '1'){
                var iter = parsed.DATA;
                cl_kasmasuk = iter;
                for(var i = 0; i < iter.length; i++){
                
                tot_masuk += parseInt(iter[i].JUMLAH);
                datanya += 
                    '<li>\
                        <div class="item-content">\
                            <div class="item-inner">\
                                <div class="item-title">'+iter[i].URAIAN+'</div>\
                                <div class="item-after">'+parseInt(iter[i].JUMLAH).toLocaleString("id-ID")+'</div>\
                            </div>\
                        </div>\
                    </li>';
                }
        
                cl_km = tot_masuk;
                $('#ul_uang_masuk').val(tot_masuk.toLocaleString('id-ID'));
                $('#ul_current_uang').val((tot_uang + tot_masuk).toLocaleString('id-ID'));
                $('#ul_closing_masuk').html(datanya);
            } else {
                datanya += 
                    '<li>\
                        <div class="item-content">\
                            <div class="item-inner">\
                                <div class="item-title"><strong>BELUM ADA PENERIMAAN KAS</strong></div>\
                            </div>\
                        </div>\
                    </li>';
    
                $('#ul_closing_masuk').html(datanya);
            }
        }
    })
}

function simpanClosing(el){
    var dt = new Date();
    var yr = dt.getFullYear();
    var mt = ('00'+(dt.getMonth() + 1)).slice(-2);
    var dy = ('00'+dt.getDate()).slice(-2);
    var hr = ('00'+dt.getHours()).slice(-2);
    var mn = ('00'+dt.getMinutes()).slice(-2);
    var sc = ('00'+dt.getSeconds()).slice(-2);
  
    // var timestamp = `${yr}-${mt}-${dy} ${hr}:${mn}:${sc}`;
    var timestamp = yr+'-'+mt+'-'+dy+' '+hr+':'+mn+':'+sc;
    var tx_last = parseInt($('#tx_first').val()) + (parseInt($('#tx_count').val()) - 1);
    var temp = {
        tgl : timestamp,
        cl_cash : $('#ul_current_uang').val().replace(/\D/g, ''),
        sales : $('#ul_closing_total').html().replace(/\D/g, ''),
        disc : $('#cl_discrp').val().replace(/\D/g, ''),
        startchk : $('#tx_first').val(),
        endchk : tx_last,
        id_closing : $('#id_closing').val(),
        lainlain : $('#ul_uang_lain').val().replace(/\D/g,''),
        kasmasuk : $('#ul_uang_masuk').val().replace(/\D/g,''),
        kaskeluar : $('#ul_uang_keluar').val().replace(/\D/g,'')
    }
  
    // cetakClosing();

    app.request({
        url: site+'/API/closing/'+cpyProf.ID_CLIENT+'/'+cpyProf.ID,
        method: 'POST',
        data: JSON.stringify(temp),
        success: function(result){
            var parsed = JSON.parse(result);
            if(parsed.ST_CODE == '1'){
                NativeStorage.remove('modal');
                app.views.main.router.navigate('/home/');
                app.dialog.confirm('Closing penjualan berhasil, cetak hasil closing?', 'Konfirmasi', function(){
                    cetakClosing(el);
                }).open();

                // app.dialog.confirm('Closing penjualan berhasil, cetak hasil closing?', 'Konfirmasi', function(){
                //     cetakClosing(el);
                // }).open().once('dialogClosed', function(){
                //     NativeStorage.remove('modal');
                //     app.views.main.router.navigate('/home/');
                // });
            } else {
                console.log('Gagal simpan closing');
            }
        }
    })
}

function cetakClosing(el, idclose = 0){
    var dt = new Date();
    var eol = '{br}{br}{br}{br}';
    var dy = ('00'+dt.getDate()).slice(-2);
    var hr = ('00'+dt.getHours()).slice(-2);
    var mn = ('00'+dt.getMinutes()).slice(-2);
    var stamp = 'Tanggal   : ' + dy + ' ' + shortMonths[dt.getMonth()] + ' ' + dt.getFullYear() + ', ' + hr+':'+mn;
  
    var header = '{br}{center}PENERIMAAN PENJUALAN KASIR{br}--------------------------------{br}{br}';
    var subheader = '{left}Cashier Name : ' +cpyProf.NAMA+ '{br}Print Date   : ' +dy+ '-' +(dt.getMonth() + 1)+ '-' +dt.getFullYear()+ ' ' +hr+ ':' +mn+ '{br}================================{br}';
  
    var cl_modal = 'Modal Awal: ';
    var cl_tot = 'Total Penjualan: ';
    var cl_byr_tu = 'Tunai: ';
    var cl_byr_cc = 'Kartu Debit/Kredit: ';
    var cl_byr_em = 'E-Money: ';
    var cl_list = '';
    var cl_uang = 'Total Uang: ';
    var cl_byr_tot = 'Total: ';
    var cl_item_tot = 'Total: ';
    var cl_item_nom = 0;
    var cl_masuk = 'Penerimaan Kas: ';
    var cl_keluar = 'Pengeluaran Kas: ';
    var cl_list_masuk = '';
    var cl_list_keluar = '';
  
    for(var i = 0; i < 32 - 'Modal Awal: '.length - parseInt(dailyModal).toLocaleString('id-ID').length; i++){
      cl_modal += ' ';
    } cl_modal += parseInt(dailyModal).toLocaleString('id-ID') + '{br}';
  
    for(var i = 0; i < 32 - 'Total Penjualan: '.length - parseInt(cl_tu + cl_cc + cl_em).toLocaleString('id-ID').length; i++){
      cl_tot += ' ';
    } cl_tot += parseInt(cl_tu + cl_cc + cl_em).toLocaleString('id-ID') + '{br}';
  
    if(cl_km){
      for(var i = 0; i < 32 - 'Penerimaan Kas: '.length - parseInt(cl_km).toLocaleString('id-ID').length; i++){
        cl_masuk += ' ';
      } cl_masuk += parseInt(cl_km).toLocaleString('id-ID') + '{br}';
    } else {
      cl_masuk = '';
    }
  
    if(cl_kk){
      for(var i = 0; i < 32 - 'Pengeluaran Kas: '.length - parseInt(cl_kk).toLocaleString('id-ID').length; i++){
        cl_keluar += ' ';
      } cl_keluar += parseInt(cl_kk).toLocaleString('id-ID') + '{br}';
    } else {
      cl_keluar = '';
    }
  
    for(var i = 0; i < 32 - 'Total Uang: '.length - (parseInt(cl_tu + cl_cc + cl_em) + parseInt(dailyModal)).toLocaleString('id-ID').length; i++){
      cl_uang += ' ';
    } cl_uang += parseInt($('#ul_current_uang').val().replace(/\D/g,'')).toLocaleString('id-ID') + '{br}';
  
    var sep3 = '';
    // if(cl_kasmasuk.length > 0){
    //   sep3 = '{br}================================{br}{center}Penerimaan Kas{br}================================{br}';
    
    //   for(var i = 0; i < cl_kasmasuk.length; i++){
    //     cl_list_masuk += cl_kasmasuk[i].URAIAN;
    //     for(var j = 0; j < 32 - cl_kasmasuk[i].URAIAN.length - parseInt(cl_kasmasuk[i].JUMLAH).toLocaleString('id-ID').length; j++){
    //       cl_list_masuk += ' ';
    //     } cl_list_masuk += parseInt(cl_kasmasuk[i].JUMLAH).toLocaleString('id-ID') + '{br}';
    //   }
    // }
  
    var sep4 = '';
    // if(cl_kaskeluar.length > 0){
    //   sep4 = '{br}================================{br}{center}Pengeluaran Kas{br}================================{br}';
    
    //   for(var i = 0; i < cl_kaskeluar.length; i++){
    //     cl_list_keluar += cl_kaskeluar[i].URAIAN;
    //     for(var j = 0; j < 32 - cl_kaskeluar[i].URAIAN.length - parseInt(cl_kaskeluar[i].JUMLAH).toLocaleString('id-ID').length; j++){
    //       cl_list_keluar += ' ';
    //     } cl_list_keluar += parseInt(cl_kaskeluar[i].JUMLAH).toLocaleString('id-ID') + '{br}';
    //   }
    // }
  
    var sep1 = '{br}================================{br}{center}Jenis Pembayaran{br}================================{br}';
  
    for(var i = 0; i < 32 - 'Tunai: '.length - parseInt(cl_tu).toLocaleString('id-ID').length; i++){
      cl_byr_tu += ' ';
    } cl_byr_tu += parseInt(cl_tu).toLocaleString('id-ID') + '{br}';
  
    for(var i = 0; i < 32 - 'Kartu Debit/Kredit: '.length - parseInt(cl_cc).toLocaleString('id-ID').length; i++){
      cl_byr_cc += ' ';
    } cl_byr_cc += parseInt(cl_cc).toLocaleString('id-ID') + '{br}';
  
    for(var i = 0; i < 32 - 'E-Money: '.length - parseInt(cl_em).toLocaleString('id-ID').length; i++){
      cl_byr_em += ' ';
    } cl_byr_em += parseInt(cl_em).toLocaleString('id-ID') + '{br}';
  
    for(var i = 0; i < 32 - 'Total: '.length - (parseInt(cl_tu) + parseInt(cl_cc) + parseInt(cl_em)).toLocaleString('id-ID').length; i++){
      cl_byr_tot += ' ';
    } cl_byr_tot += (parseInt(cl_tu) + parseInt(cl_cc) + parseInt(cl_em)).toLocaleString('id-ID') + '{br}';
  
    var sep2 = '{br}================================{br}{center}Kategori Item{br}================================{br}';
    var cl_list_tot = 0;
  
    for(var i = 0; i < cl_items.length; i++){
      cl_list += cl_items[i].nama_kategori;
      cl_item_nom += parseInt(cl_items[i].total);
      for(var j = 0; j < 32 - cl_items[i].nama_kategori.length - parseInt(cl_items[i].total).toLocaleString('id-ID').length; j++){
        cl_list += ' ';
      } cl_list += parseInt(cl_items[i].total).toLocaleString('id-ID') + '{br}';
    }
  
    var cl_discrp = 'Diskon:'
    for(var i = 0; i < 32 - 'Diskon: '.length - parseInt($('#cl_discrp').val()).toLocaleString('id-ID').length - 2; i++){
      cl_discrp += ' ';
    } cl_discrp += parseInt($('#cl_discrp').val()).toLocaleString('id-ID') + '{br}';
  
  
    if(cl_kasmasuk.length > 0){
      for(var i = 0; i < cl_kasmasuk.length; i++){
        cl_list += cl_kasmasuk[i].URAIAN;
        cl_item_nom += parseInt(cl_kasmasuk[i].JUMLAH);
        for(var j = 0; j < 32 - cl_kasmasuk[i].URAIAN.length - parseInt(cl_kasmasuk[i].JUMLAH).toLocaleString('id-ID').length; j++){
          cl_list += ' ';
        } cl_list += parseInt(cl_kasmasuk[i].JUMLAH).toLocaleString('id-ID') + '{br}';
      }
    }
  
    if(cl_kaskeluar.length > 0){
      for(var i = 0; i < cl_kaskeluar.length; i++){
        cl_list += cl_kaskeluar[i].URAIAN;
        cl_item_nom -= parseInt(cl_kaskeluar[i].JUMLAH);
        for(var j = 0; j < 30 - cl_kaskeluar[i].URAIAN.length - parseInt(cl_kaskeluar[i].JUMLAH).toLocaleString('id-ID').length; j++){
          cl_list += ' ';
        } cl_list += '- '+parseInt(cl_kaskeluar[i].JUMLAH).toLocaleString('id-ID') + '{br}';
      }
    }
  
    for(var i = 0; i < 32 - 'Total: '.length - parseInt(cl_item_nom).toLocaleString('id-ID').length; i++){
      cl_item_tot += ' ';
    } cl_item_tot += cl_item_nom.toLocaleString('id-ID') + '{br}';
  
    var q = header + subheader + cl_modal + cl_tot + cl_masuk + cl_keluar + cl_uang + sep1 + cl_byr_tu + cl_byr_cc + cl_byr_em + cl_byr_tot + sep2 + cl_list + cl_item_tot +sep3 + cl_list_masuk + sep4 + cl_list_keluar + eol;
    connectToPrinter(q, el);
}