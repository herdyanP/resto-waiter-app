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