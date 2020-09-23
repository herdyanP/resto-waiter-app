function inputUang(){
    app.dialog.create({
        title: 'Input Uang yang Dipegang',
        closeByBackdropClick: true,
        content: '\
            <div class="list no-hairlines no-hairlines-between">\
                <ul>\
                    <li class="item-content item-input">\
                    <div class="item-inner">\
                        <div class="item-input-wrap">\
                        <input type="text" inputmode="numeric" name="uang_masuk" id="uang_masuk" oninput="comma(this)" style="text-align: right;"/>\
                        </div>\
                    </div>\
                    </li>\
                </ul>\
            </div>',
        buttons: [
        {
            text: 'Batal',
            onClick: function(dialog, e){
                dialog.close();
            }
        },
        {
            text: 'Simpan',
            onClick: function(dialog, e){
                var v = parseInt($('#uang_masuk').val().replace(/\D/g, ''));
                if(!isNaN(v)){
                    $('#ul_current_uang').html(v.toLocaleString(locale));
                }
            }
        }]
    }).open();
}

function inputLain(){
    app.dialog.create({
        title: 'Input Biaya Lain',
        closeByBackdropClick: true,
        content: '\
            <div class="list no-hairlines no-hairlines-between">\
                <ul>\
                    <li class="item-content item-input">\
                    <div class="item-inner">\
                        <div class="item-input-wrap">\
                        <input type="text" inputmode="numeric" name="uang_lain" id="uang_lain" oninput="comma(this)" style="text-align: right;"/>\
                        </div>\
                    </div>\
                    </li>\
                </ul>\
            </div>',
        buttons: [
        {
            text: 'Batal',
            onClick: function(dialog, e){
                dialog.close();
            }
        },
        {
            text: 'Simpan',
            onClick: function(dialog, e){
                var v = parseInt($('#uang_lain').val().replace(/\D/g, ''));
                if(!isNaN(v)){
                    $('#ul_uang_lain').html(v.toLocaleString(locale));
                }
            }
        }]
    }).open();
}

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
                                <div class="item-after">'+tunai.toLocaleString(locale)+'</div>\
                            </div>\
                        </div>\
                    </li>\
                    <li>\
                        <div class="item-content">\
                            <div class="item-inner">\
                                <div class="item-title">Kartu Debit/Kredit</div>\
                                <div class="item-after">'+cc.toLocaleString(locale)+'</div>\
                            </div>\
                        </div>\
                    </li>\
                    <li>\
                        <div class="item-content">\
                            <div class="item-inner">\
                                <div class="item-title">E-Money</div>\
                                <div class="item-after">'+emoney.toLocaleString(locale)+'</div>\
                            </div>\
                        </div>\
                    </li>\
                    <li>\
                        <div class="item-content">\
                            <div class="item-inner">\
                                <div class="item-title">Total</div>\
                                <div class="item-after">'+(tunai + cc + emoney).toLocaleString(locale)+'</div>\
                            </div>\
                        </div>\
                    </li>';
      
                $('#ul_closing_sales').html(datanya);
                $('#ul_closing_total').html((parseInt(tunai) + parseInt(cc) + parseInt(emoney)).toLocaleString(locale));
                $('#cl_sales').val(parseInt(tunai) + parseInt(cc) + parseInt(emoney));
            
                cl_tu = tunai;
                cl_cc = cc;
                cl_em = emoney;
            
                // $('#ul_current_uang').val((parseInt(tunai) + parseInt(dailyModal)).toLocaleString(locale));
                $('#ul_current_uang').html((parseInt(tunai) + parseInt(dailyModal)).toLocaleString(locale));
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
                // $('#ul_current_uang').val((parseInt(dailyModal)).toLocaleString(locale));
                $('#ul_current_uang').html((parseInt(dailyModal)).toLocaleString(locale));
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
                                <div class="item-after">'+parseInt(iter[i].total).toLocaleString(locale)+'</div>\
                                </div>\
                            </div>\
                        </li>';
                }
    
                datanya += 
                    '<li>\
                        <div class="item-content">\
                            <div class="item-inner">\
                                <div class="item-title">Diskon</div>\
                                <div class="item-after">- '+discrp.toLocaleString(locale)+'</div>\
                            </div>\
                        </div>\
                    </li>\
                    <li>\
                        <div class="item-content">\
                            <div class="item-inner">\
                                <div class="item-title">Total</div>\
                                <div class="item-after">'+(total - discrp).toLocaleString(locale)+'</div>\
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
    // var tot_uang = parseInt($('#ul_current_uang').val().replace(/\D/g, ''));
    var tot_uang = parseInt($('#ul_current_uang').html().replace(/\D/g, ''));
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
                                    <div class="item-after">'+parseInt(iter[i].JUMLAH).toLocaleString(locale)+'</div>\
                                </div>\
                            </div>\
                        </li>';
                }
                
                cl_kk = tot_keluar;
                // $('#ul_uang_keluar').val(tot_keluar.toLocaleString(locale));
                $('#ul_uang_keluar').html(tot_keluar.toLocaleString(locale));
                // $('#ul_current_uang').val((tot_uang - tot_keluar).toLocaleString(locale));
                $('#ul_current_uang').html((tot_uang - tot_keluar).toLocaleString(locale));
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
    // var tot_uang = parseInt($('#ul_current_uang').val().replace(/\D/g, ''));
    var tot_uang = parseInt($('#ul_current_uang').html().replace(/\D/g, ''));
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
                                <div class="item-after">'+parseInt(iter[i].JUMLAH).toLocaleString(locale)+'</div>\
                            </div>\
                        </div>\
                    </li>';
                }
        
                cl_km = tot_masuk;
                // $('#ul_uang_masuk').val(tot_masuk.toLocaleString(locale));
                $('#ul_uang_masuk').html(tot_masuk.toLocaleString(locale));
                // $('#ul_current_uang').val((tot_uang + tot_masuk).toLocaleString(locale));
                $('#ul_current_uang').html((tot_uang + tot_masuk).toLocaleString(locale));
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
        // cl_cash : $('#ul_current_uang').val().replace(/\D/g, ''),
        cl_cash : $('#ul_current_uang').html().replace(/\D/g, ''),
        sales : $('#ul_closing_total').html().replace(/\D/g, ''),
        disc : $('#cl_discrp').val().replace(/\D/g, ''),
        startchk : $('#tx_first').val(),
        endchk : tx_last,
        id_closing : $('#id_closing').val(),
        // lainlain : $('#ul_uang_lain').val().replace(/\D/g,''),
        // kasmasuk : $('#ul_uang_masuk').val().replace(/\D/g,''),
        kasmasuk : $('#ul_uang_masuk').html().replace(/\D/g,''),
        // kaskeluar : $('#ul_uang_keluar').val().replace(/\D/g,'')
        kaskeluar : $('#ul_uang_keluar').html().replace(/\D/g,'')
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
                // app.views.main.router.navigate('/home/');
                // app.dialog.confirm('Closing penjualan berhasil, cetak hasil closing?', 'Konfirmasi', function(){
                //     cetakClosing(el);
                // }).open();

                app.views.main.router.navigate({
                    name: 'cpreview',
                    params: {idc: temp.id_closing}
                });
            } else {
                console.log('Gagal simpan closing');
            }
        }
    })
}

function previewClosing(idc){
    var temp = {
        id_closing : idc
    }

    app.request({
        url: site+'/API/cetakclosing/'+cpyProf.ID_CLIENT+'/'+cpyProf.ID,
        method: 'POST',
        data: JSON.stringify(temp),
        success: function(result){
            var parsed = JSON.parse(result);
            if(parsed.ST_CODE == '1'){
                var kat = parsed.DATA.KAT;
                var jenis = parsed.DATA.TRANS;
                var tglclose = new Date(parsed.DATA.closingcashdate);
                var format = ('00'+tglclose.getDate()).slice(-2) + '-' + ('00'+(tglclose.getMonth()+1)).slice(-2) + '-' + tglclose.getFullYear() + ' ' + ('00'+tglclose.getHours()).slice(-2) + ':' + ('00'+tglclose.getMinutes()).slice(-2);

                var tbl = 
                '<table style="width: 100%">\
                    <tr>\
                        <td style="width: 40%"></td>\
                        <td style="width: 20%"></td>\
                        <td style="width: 40%"></td>\
                    </tr>';

                var judul = 
                '<tr>\
                    <td colspan="3" style="text-align: center;">PENERIMAAN PENJUALAN KASIR</td>\
                </tr>\
                <tr><td colspan="3" style="border-top: solid black 2px;"></tr>';

                var subjudul = 
                '<tr>\
                    <td>Kasir</td>\
                    <td colspan="2">: '+cpyProf.NAMA+'</td>\
                </tr>\
                <tr>\
                    <td>Tanggal</td>\
                    <td colspan="2">: '+format+'</td>\
                </tr>\
                <tr><td colspan="3" style="border-top: solid black 2px;"></tr>';

                var isinya = 
                '<tr>\
                    <td>Modal Awal\
                    <td colspan="2">: '+parseInt(parsed.DATA.starting_cash).toLocaleString(locale)+'</td>\
                </tr>\
                <tr>\
                    <td>Total Penjualan\
                    <td colspan="2">: '+parseInt(parsed.DATA.sales).toLocaleString(locale)+'</td>\
                </tr>\
                <tr>\
                    <td>Penerimaan Kas\
                    <td colspan="2">: '+parseInt(parsed.DATA.kasmasuk).toLocaleString(locale)+'</td>\
                </tr>\
                <tr>\
                    <td>Pengeluaran Kas\
                    <td colspan="2">: '+parseInt(parsed.DATA.kaskeluar).toLocaleString(locale)+'</td>\
                </tr>\
                <tr>\
                    <td>Total Uang\
                    <td colspan="2">: '+parseInt(parsed.DATA.closing_cash).toLocaleString(locale)+'</td>\
                </tr>';

                var totjenis = 0;
                var pembayaran = 
                '<tr><td colspan="3" style="border-bottom: solid black 2px;"></tr>\
                <tr><td colspan="3" style="text-align: center;">Jenis Pembayaran</tr>\
                <tr><td colspan="3" style="border-top: solid black 2px;"></tr>';

                for(var i = 0; i < jenis.length; i++){
                    var nama_jenis;
                    switch(jenis[i].jenis_bayar){
                        case '1':
                            nama_jenis = 'Tunai';
                            break;
                        case '2':
                            nama_jenis = 'Kartu Debit/Kredit';
                            break;
                        case '3':
                            nama_jenis = 'E-Money';
                            break;
                    }

                    pembayaran +=
                        '<tr>\
                            <td>'+nama_jenis+' :</td>\
                            <td colspan="2" style="text-align: right">'+parseInt(jenis[i].grantot_jual).toLocaleString(locale)+'</td>\
                        </tr>';
                    totjenis += parseInt(jenis[i].grantot_jual);
                }

                pembayaran += 
                '<tr>\
                    <td>Total :</td>\
                    <td colspan="2" style="text-align: right;">'+totjenis.toLocaleString(locale)+'</td>\
                </tr>';


                var totkat = 0;
                var kategori = 
                '<tr><td colspan="3" style="border-bottom: solid black 2px;"></tr>\
                <tr><td colspan="3" style="text-align: center;">Kategori Item</tr>\
                <tr><td colspan="3" style="border-top: solid black 2px;"></tr>';
                
                for(var i = 0; i< kat.length; i++){
                kategori += 
                    '<tr>\
                        <td>'+kat[i].nama_kategori+' :</td>\
                        <td colspan="2" style="text-align: right">'+parseInt(kat[i].harga_jual).toLocaleString(locale)+'</td>\
                    </tr>';
                totkat += parseInt(kat[i].harga_jual);
                }

                kategori += 
                '<tr>\
                    <td>Total :</td>\
                    <td colspan="2" style="text-align: right;">'+totjenis.toLocaleString(locale)+'</td>\
                </tr>';

                var q = tbl + judul + subjudul + isinya + pembayaran + kategori;
                containerPreview = q;
                $('#preview_clos').html(q);
            } else {

            }
        }
    })
}

function cetakClosingID(idc){
    var temp = {
        id_closing : idc
    }

    app.request({
        url: site+'/API/cetakclosing/'+cpyProf.ID_CLIENT+'/'+cpyProf.ID,
        method: "POST",
        data: JSON.stringify(temp),
        success: function(result){
            var parsed = JSON.parse(result);
            if(parsed.ST_CODE == '1'){
                var kat = parsed.DATA.KAT;
                var jenis = parsed.DATA.TRANS;
                var tglclose = new Date(parsed.DATA.closingcashdate);
                var format = ('00'+tglclose.getDate()).slice(-2) + '-' + ('00'+(tglclose.getMonth()+1)).slice(-2) + '-' + tglclose.getFullYear() + ' ' + ('00'+tglclose.getHours()).slice(-2) + ':' + ('00'+tglclose.getMinutes()).slice(-2);


                var judul = '{center}PENERIMAAN PENJUALAN KASIR{br}--------------------------------{br}';
                var subjudul = '{left}Kasir     : ' +cpyProf.NAMA+ '{br}Tanggal   : '+format+'{br}================================{br}';


                // Detil uang
                var isinya = '';
                var modal_awal = 'Modal Awal';
                var l_modal_awal = 32 - (modal_awal.length + parseInt(parsed.DATA.starting_cash).toLocaleString(locale).length);
                for(var i = 0; i < l_modal_awal; i++){
                    modal_awal += ' ';
                } modal_awal += parseInt(parsed.DATA.starting_cash).toLocaleString(locale) + '{br}';

                var tot_penjualan = 'Total Penjualan';
                var l_tot_penjualan = 32 - (tot_penjualan.length + parseInt(parsed.DATA.sales).toLocaleString(locale).length);
                for(var i = 0; i < l_tot_penjualan; i++){
                    tot_penjualan += ' ';
                } tot_penjualan += parseInt(parsed.DATA.sales).toLocaleString(locale) + '{br}';

                var kas_masuk = 'Penerimaan Kas';
                var l_kas_masuk = 32 - (kas_masuk.length + parseInt(parsed.DATA.kasmasuk).toLocaleString(locale).length);
                for(var i = 0; i < l_kas_masuk; i++){
                    kas_masuk += ' ';
                } kas_masuk += parseInt(parsed.DATA.kasmasuk).toLocaleString(locale) + '{br}';

                var kas_keluar = 'Pengeluaran Kas';
                var l_kas_keluar = 32 - (kas_keluar.length + parseInt(parsed.DATA.kaskeluar).toLocaleString(locale).length);
                for(var i = 0; i < l_kas_keluar; i++){
                    kas_keluar += ' ';
                } kas_keluar += parseInt(parsed.DATA.kaskeluar).toLocaleString(locale) + '{br}';

                var tot_uang = 'Total Uang';
                var l_tot_uang = 32 - (tot_uang.length + parseInt(parsed.DATA.closing_cash).toLocaleString(locale).length);
                for(var i = 0; i < l_tot_uang; i++){
                    tot_uang += ' ';
                } tot_uang += parseInt(parsed.DATA.closing_cash).toLocaleString(locale) + '{br}';

                isinya = modal_awal + tot_penjualan + kas_masuk + kas_keluar + tot_uang;


                // Detil Jenis Pembayaran
                var totjenis = 0;
                var pembayaran = '================================{br}{center}Jenis Pembayaran{br}================================{br}';
                for(var i = 0; i < jenis.length; i++){
                    var nama_jenis;
                    switch(jenis[i].jenis_bayar){
                        case '1':
                            nama_jenis = 'Tunai';
                            break;
                        case '2':
                            nama_jenis = 'Kartu Debit/Kredit';
                            break;
                        case '3':
                            nama_jenis = 'E-Money';
                            break;
                    }

                    pembayaran += '{left}' + nama_jenis;
                    var l_pembayaran = 32 - (nama_jenis.length + parseInt(jenis[i].grantot_jual).toLocaleString(locale).length);
                    for(var j = 0; j < l_pembayaran; j++){
                        pembayaran += ' ';
                    } pembayaran += parseInt(jenis[i].grantot_jual).toLocaleString(locale) + '{br}';
                    totjenis += parseInt(jenis[i].grantot_jual);
                }

                var tot_pemb = 'Total';
                var l_tot_pemb = 32 - (tot_pemb.length + parseInt(totjenis).toLocaleString(locale).length);
                for(var i = 0; i < l_tot_pemb; i++){
                    tot_pemb += ' ';
                } tot_pemb += parseInt(totjenis).toLocaleString(locale) + '{br}';
                pembayaran += tot_pemb;

                // Detil Kategori Item
                var totkat = 0;
                var kategori = '================================{br}{center}Kategori Item{br}================================{br}';
                for(var i = 0; i< kat.length; i++){
                    var l_kategori = 32 - (kat[i].nama_kategori.length + parseInt(kat[i].harga_jual).toLocaleString(locale).length);
                    kategori += '{left}' + kat[i].nama_kategori;
                    for(var j = 0; j < l_kategori; j++){
                        kategori += ' ';
                    } kategori += parseInt(kat[i].harga_jual).toLocaleString(locale) + '{br}';
                    totkat += parseInt(kat[i].harga_jual);
                }

                var tot_kat = 'Total';
                var l_tot_kat = 32 - (tot_kat.length + parseInt(totkat).toLocaleString(locale).length);
                for(var i = 0; i < l_tot_kat; i++){
                    tot_kat += ' ';
                } tot_kat += parseInt(totkat).toLocaleString(locale) + '{br}';
                kategori += tot_kat;

                var q = judul + subjudul + isinya + pembayaran + kategori + '{br}{br}';
                connectToPrinter(q);
                // $('#preview_clos').html(q);
            } else {

            }
        }
    })
}