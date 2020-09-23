function bayar(){
    var d = new Date();
    var tgl = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+("0" + d.getDate()).slice(-2);
    var tgltime = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+("0" + d.getDate()).slice(-2)+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
    var jenis = $('#metode').val();
    var nomor_kartu = $('#nkartu').val();
    
    var subtotal = $('#subtotal').html().replace(/\D/g, '');
    
    var diskon = parseInt($('#disk_rp').val().replace(/\D/g, ''));
    var bayar = parseInt($('#bayar').val().replace(/\D/g, ''));
    
    var kembali = (+bayar) - (+subtotal);
    var bayar_tunai = 0, bayar_card = 0, bayar_emoney = 0;
    switch(jenis){
        case '1':
        bayar_tunai = bayar;
        break;
        
        case '2':
        bayar_card = bayar;
        break;
        
        case '3':
        bayar_emoney = bayar;
        break;
    }

    var platform = (jenis == '3' ? $('#platform').val() : '0');
    
    var temp = {
        bayar_tunai : bayar_tunai,
        bayar_card : bayar_card,
        bayar_emoney : bayar_emoney,
        diskon : diskon,
        kembali : kembali,
        id_login : cpyProf.id_user,
        id_client : cpyProf.id_client,
        id_cabang : cpyProf.id_cabang,
        id_outlet : cpyProf.id_outlet,
        jenis_bayar : jenis,
        nomor_kartu : nomor_kartu,
        tgl : tgltime,
        id_ewallet : platform
    }
    
    if(kembali < 0){
        app.dialog.alert('Kembalian anda minus. Mohon cek kembali!', 'Alert');
    } else {
        if(jenis == '3'){
            var nohp = $('#idewallet').val();
            var ewalvar = {
                nohp: nohp,
                id_client: cpyProf.id_client
            }
            
            // app.request({
            //     url: site+"/API/cust/",
            //     method: "POST",
            //     data: JSON.stringify(ewalvar),
            //     statusCode: {
            //         200: function(){
            //             console.log('returned OK');
            //         },
            //         201: function(){
            //             console.log('created OK');
            //         }
            //     }
            // });
        }

        app.request({
            url: site+'/API/penjualan/'+cpyProf.ID_CLIENT+'/'+cpyProf.ID,
            method: 'POST',
            data: JSON.stringify(temp),
            success: function(result){
                var parsed = JSON.parse(result);
                if(parsed.ST_CODE == '1'){
                    app.toast.create({
                        text: "Sukses bayar",
                        closeTimeout: 3000,
                        closeButton: true
                    }).open();

                    app.views.main.router.navigate({
                        name: 'preview', 
                        params: {idpj: parsed.idpj}
                    });
                } else {
                    app.toast.create({
                        text: "Gagal bayar",
                        closeTimeout: 3000,
                        closeButton: true
                    }).open();
                }
            }
        })
    }
}

function cetakReceipt(idpj){
    app.request({
        url: site+'/API/preview/'+cpyProf.ID_CLIENT+'/'+idpj,
        method: 'GET',
        success: function(result){
            var parsed = JSON.parse(result);
            if(parsed.ST_CODE == '1'){
                var iter = parsed.DATA;

                var dt = new Date();
                var dy = ('00'+dt.getDate()).slice(-2);
                var hr = ('00'+dt.getHours()).slice(-2);
                var mn = ('00'+dt.getMinutes()).slice(-2);
                
                var jn = '';
                var via = '';
                switch(iter[0].jenis_bayar){
                    case '1':
                        jn = 'Tunai';
                        via = iter[0].bayar_tunai;
                        break;
                    case '2':
                        jn = 'Kartu Debit/Kredit';
                        via = iter[0].bayar_card;
                        break;
                    case '3':
                        if(iter[0].id_ewallet == '1'){
                            jn = 'GO-PAY';
                        } else if(iter[0].id_ewallet == '2'){
                            jn = 'OVO';
                        } else if(iter[0].id_ewallet == '3'){
                            jn = 'DANA';
                        } else if(iter[0].id_ewallet == '4'){
                            jn = 'LinkAja';
                        }
                        
                        // jn = (iter[0].id_ewallet == '1' ? 'GO-PAY' : 'OVO');
                        via = iter[0].bayar_emoney;
                        break;
                }

                var header = '{center}'+cpyProf.nama_toko+'{br}'+cpyProf.alamat+'{br}Sales Receipt{br}--------------------------------{br}';
                var subheader = '{left}No. Trans : ' +iter[0].no_penjualan+ '{br}' +iter[0].stamp_date+ '{br}Operator  : ' +cpyProf.NAMA+ '{br}--------------------------------{br}';

                var list = '';
                for(var i = 0; i < iter.length; i++){
                    var ws = '';
                    var q = parseInt(iter[i].qty_jual).toLocaleString(locale);
                    var satuan = parseInt(iter[i].harga_jual).toLocaleString(locale);
                    var jumlah = (parseInt(iter[i].harga_jual) * parseInt(iter[i].qty_jual)).toLocaleString(locale);
            
                    var tlen = 26 - (satuan.length + jumlah.length + q.length);
                    for(var j = 0; j < tlen; j++){
                        ws += ' ';
                    }

                    list += iter[i].nama_barang+'{br}  Cttn: ' +iter[i].catatan+ '{br}  '+ q +' x '+ satuan + ws + jumlah +' {br}';
                }
                list += '--------------------------------{br}{left}';
                    
                var sub = 'Sub-total';
                for(var i = 0; i < 32 - 'Sub-total'.length - parseInt(iter[0].total_jual).toLocaleString(locale).length; i++){
                    sub += ' ';
                } sub += parseInt(iter[0].total_jual).toLocaleString(locale) + '{br}';

                var dsc = 'Diskon';
                for(var i = 0; i < 32 - 'Diskon'.length - parseInt(iter[0].disc_rp).toLocaleString(locale).length; i++){
                    dsc += ' ';
                } dsc += parseInt(iter[0].disc_rp).toLocaleString(locale) + '{br}';

                var grd = 'Grand Total';
                for(var i = 0; i < 32 - 'Grand Total'.length - parseInt(iter[0].grantot_jual).toLocaleString(locale).length; i++){
                    grd += ' ';
                } grd += parseInt(iter[0].grantot_jual).toLocaleString(locale) + '{br}';

                var paid = jn;
                for(var i = 0; i < 32 - jn.length - parseInt(via).toLocaleString(locale).length; i++){
                    paid += ' ';
                } paid += parseInt(via).toLocaleString(locale) + '{br}';

                var kbl = 'Kembali';
                for(var i = 0; i < 32 - 'Kembali'.length - parseInt(iter[0].kembali_tunai).toLocaleString(locale).length; i++){
                    kbl += ' ';
                } kbl += parseInt(iter[0].kembali_tunai).toLocaleString(locale);

                var thanks = '{br}{center}Terima Kasih {br}Atas Kunjungan Anda';
                var mp = '{br}Powered by MediaPOS';
                var eol = '{br}{br}{br}';
                
                var q = header + subheader + list + sub + dsc + grd + paid + kbl + '{br}' + thanks + mp + eol;
                connectToPrinter(q);
            }
        }
    })
}

function previewPenjualan(idpj){
    app.request({
        url: site+'/API/preview/'+cpyProf.ID_CLIENT+'/'+idpj,
        method: 'GET',
        success: function(result){
            var parsed = JSON.parse(result);
            if(parsed.ST_CODE == '1'){
                var iter = parsed.DATA;
                var tbl = 
                '<table style="width: 100%">\
                    <tr>\
                        <td style="width: 40%"></td>\
                        <td style="width: 20%"></td>\
                        <td style="width: 40%"></td>\
                    </tr>';

                var header = 
                '<tr>\
                    <td colspan="3" style="text-align: center;">Sales Receipt</td>\
                </tr>';

                var dtloutlet = 
                '<tr>\
                    <td colspan="3" style="text-align: center;">'+cpyProf.nama_toko+'</td>\
                </tr>\
                <tr>\
                    <td colspan="3" style="text-align: center; border-bottom: solid black 2px;">'+cpyProf.alamat+'</td>\
                </tr>';

                var notrans = 
                '<tr>\
                    <td>No. Trans</td>\
                    <td colspan="2">: '+iter[0].no_penjualan+'</td>\
                </tr>';
                
                var dt = new Date();
                var dy = ('00'+dt.getDate()).slice(-2);
                var hr = ('00'+dt.getHours()).slice(-2);
                var mn = ('00'+dt.getMinutes()).slice(-2);
                var stamp = dy + ' ' + shortMonths[dt.getMonth()] + ' ' + dt.getFullYear() + ', ' + hr+':'+mn;
                var tgl = 
                '<tr>\
                    <td>Tanggal</td>\
                    <td colspan="2">: '+stamp+'</td>\
                </tr>';
            
                var op = 
                '<tr>\
                    <td>Operator</td>\
                    <td colspan="2">: '+cpyProf.NAMA+'</td>\
                </tr>\
                <tr><td colspan="3" style="border-top: solid black 2px;"></tr>';
                
                var list = '';
                for(var i = 0; i < iter.length; i++){
                var qty = parseInt(iter[i].qty_jual).toLocaleString(locale);
                var hj = parseInt(iter[i].harga_jual).toLocaleString(locale);
                var jml = (parseInt(iter[i].harga_jual) * parseInt(iter[i].qty_jual)).toLocaleString(locale);  
                list += 
                    '<tr>\
                        <td colspan="3">\
                            '+iter[i].nama_barang+'\
                            <br>Cttn: '+iter[i].catatan+'\
                        </td>\
                    </tr>\
                    <tr>\
                        <td style="padding-left: 20px;">'+qty+' x '+hj+'</td>\
                        <td colspan="2" style="text-align: right;">'+jml+'</td>\
                    </tr>';
                }

                list += '<tr><td colspan="3" style="border-bottom: solid black 2px;"></td></tr>';
                var stot = 
                '<tr>\
                    <td>Subtotal</td>\
                    <td>:</td>\
                    <td style="text-align: right;">'+parseInt(iter[0].total_jual).toLocaleString(locale)+'</td>\
                </tr>';

                var dsc = 
                '<tr>\
                    <td>Diskon</td>\
                    <td>:</td>\
                    <td style="text-align: right;">'+parseInt(iter[0].disc_rp).toLocaleString(locale)+'</td>\
                </tr>';

                var grd = 
                '<tr>\
                    <td>Grand Total</td>\
                    <td>:</td>\
                    <td style="text-align: right;">'+parseInt(iter[0].grantot_jual).toLocaleString(locale)+'</td>\
                </tr>';


                var jn = '', bayar = '';
                switch(iter[0].jenis_bayar){
                case '1':
                    jn = 'Tunai';
                    bayar = iter[0].bayar_tunai;
                    break;
                case '2':
                    jn = 'Kartu Debit/Kredit';
                    bayar = iter[0].bayar_card;
                    break;
                case '3':
                    if(iter[0].id_ewallet == '1'){
                    jn = 'GO-PAY';
                    } else if(iter[0].id_ewallet == '2'){
                    jn = 'OVO';
                    } else if(iter[0].id_ewallet == '3'){
                    jn = 'DANA';
                    } else if(iter[0].id_ewallet == '4'){
                    jn = 'LinkAja';
                    }

                    // jn = (iter[0].id_ewallet == '1' ? 'GO-PAY' : 'OVO');
                    bayar = iter[0].bayar_emoney;
                    break;
                }

                /*var via = `
                <tr>
                    <td>Via</td>
                    <td>:</td>
                    <td style="text-align: right;">${jn}</td>
                </tr>
                `;*/

                var paid = 
                '<tr>\
                    <td>'+jn+'</td>\
                    <td>:</td>\
                    <td style="text-align: right;">'+parseInt(bayar).toLocaleString(locale)+'</td>\
                </tr>';

                var chn = 
                '<tr>\
                    <td>Kembalian</td>\
                    <td>:</td>\
                    <td style="text-align: right;">'+parseInt(iter[0].kembali_tunai).toLocaleString(locale)+'</td>\
                </tr>\
                <tr><td>&nbsp;</td></tr>';

                var thanks = 
                '<tr>\
                    <td colspan="3" style="text-align: center;">Terima Kasih Atas Kunjungan Anda</td>\
                </tr>\
                <tr>\
                    <td colspan="3" style="text-align: center;">Powered by MediaPOS</td>\
                </tr>\
                </table>';

                var q = tbl + header + dtloutlet + tgl + notrans + op + list + stot + dsc + grd + /*via +*/ paid + chn + thanks;
                containerPreview = q;
                $('#preview_rcpt').html(q);
            } else {

            }
        }
    })
}