function simpan(id, qty, harga){
    var temp = {
        'id_barang' : id,
        'qty' : qty,
        'harga' : harga
    }

    app.request({
        url: site+'/API/cart/'+cpyProf.ID_CLIENT+'/'+cpyProf.ID,
        method: 'POST',
        // timeout: 10 * 1000,
        data: JSON.stringify(temp),
        success: function(result){
            var parsed = JSON.parse(result);
            if(parsed.ST_CODE == '1'){
                app.toast.create({
                    text: "Sukses Tambah ke Keranjang",
                    closeTimeout: 3000,
                    closeButton: true
                }).open();
            } else {
                app.toast.create({
                    text: "Gagal Tambah ke Keranjang",
                    closeTimeout: 3000,
                    closeButton: true
                }).open();
            }

            keranjang();
            hitungDiskon();
        }, error: function(){
            console.log('Error mengambil list keranjang');
        }
    })
    
    /* if(harga == 0){
        app.toast.create({
            text: "Harga masih 0, silahkan tambah harga dahulu di master pricelist",
            closeTimeout: 3000,
            closeButton: false
        }).open();
    } else {
        
    }   */
}

function keranjang(){
    var data = '<ul>';
    var jumlah = 0;
    var disk_rp = $('#disk_rp').val();
    
    app.request({
        url: site+'/API/cart/'+cpyProf.ID_CLIENT+'/'+cpyProf.ID,
        method: 'GET',
        // timeout: 10 * 1000,
        success: function(result){
            var parsed = JSON.parse(result);

            if(parsed.ST_CODE == '1'){
                var iter = parsed.DATA;
                for(i = 0; i < iter.length; i++){
                    data += 
                    '<li class="item-content ">\
                        <div class="item-inner">\
                            <div class="item-title" onclick="ubahAmount('+iter[i].id_tmp+');">'+iter[i].nama_barang+'\
                                <div class="item-footer">'+iter[i].qty_tmp+' x '+iter[i].harga_tmp+'<br> Cttn: '+iter[i].catatan+'</div>\
                            </div>\
                            <div class="item-after">\
                                <a href="#" onclick="tambahNote('+iter[i].id_tmp+')"><i class="icon material-icons md-only" style="margin: 0 5px;">playlist_add</i></a>\
                                <a href="#" onclick="hapusKeranjang('+iter[i].id_tmp+')"><i class="icon material-icons md-only" style="margin: 0 5px;">remove_shopping_cart</i></a>\
                            </div>\
                        </div>\
                    </li>';
                    // iter+="<li class=\"swipeout deleted-callback\" iter-id=\""+rs.rows.item(i).id_tmp+"\"><div class=\"item-content swipeout-content\"><div class=\"item-inner\"><div class=\"item-title\"><div class=\"item-header\">"+rs.rows.item(i).nama_barang+"</div>"+rs.rows.item(i).total.toLocaleString(locale)+"</div><div>"+rs.rows.item(i).qty+"</div></div></div><div class=\"swipeout-actions-right\"><a href=\"#\" onclick=\"hapusKeranjang('"+rs.rows.item(i).id_tmp+"')\" class=\"swipeout-delete\">Delete</a></div></li>";
                    
                    jumlah += parseInt(iter[i].qty_tmp * iter[i].harga_tmp);  // no PPN 
                }
            } else {
                $('#disk_rp').val(0);
                console.log('keranjang kosong');
            }
            
            v_subtotal = jumlah
            totalSub = jumlah;
            data += '</ul>';
            $('#keranjang').html(data);
            // $('#bayar').val(totalSub.toLocaleString(locale));
            
            // hitungDiskon();
        }, error: function(){
            console.log('Timeout keranjang');
        }
    })

    /* $.ajax({
        url: site+'/API/cart/'+cpyProf.id_user+'/',
        method: 'GET'
    }).done(function(result){
        console.log('keranjang');
        var testp = result;
        for(i = 0; i < testp.length; i++){
            // console.log(testp[i].id_barang, testp[i].total_tmp, testp[i].nama_barang, testp[i].qty_tmp);
            // <div class="item-title" onclick="ubahAmount('+testp[i].id_tmp+');">\
            // <div class="item-after"><a href="#" onclick="pilihHapus('+testp[i].id_barang+','+testp[i].qty_tmp+')"><i class="icon material-icons md-only">remove_shopping_cart</i></a></div>\
            
            // data += `<li class="item-content ">
            //           <div class="item-inner">
            //             <div class="item-title" onclick="ubahAmount(`+testp[i].id_barang+`,`+testp[i].harga_tmp+`);">`+testp[i].nama_barang+`
            //               <div class="item-footer">`+testp[i].qty_tmp+` x `+testp[i].harga_tmp+`</div>
            //             </div>
            //             <div class="item-after"><a href="#" onclick="hapusKeranjang(`+testp[i].id_barang+`)"><i class="icon material-icons md-only">remove_shopping_cart</i></a></div>
            //           </div>
            //         </li>`;
            data += 
            '<li class="item-content ">\
            <div class="item-inner">\
            <div class="item-title" onclick="ubahAmount('+testp[i].id_barang+','+testp[i].harga_tmp+');">'+testp[i].nama_barang+'\
            <div class="item-footer">'+testp[i].qty_tmp+' x '+testp[i].harga_tmp+'<br> Cttn: '+testp[i].catatan+'</div>\
            </div>\
            <div class="item-after">\
            <a href="#" onclick="tambahNote('+testp[i].id_tmp+')"><i class="icon material-icons md-only" style="margin: 0 5px;">playlist_add</i></a>\
            <a href="#" onclick="hapusKeranjang('+testp[i].id_barang+')"><i class="icon material-icons md-only" style="margin: 0 5px;">remove_shopping_cart</i></a>\
            </div>\
            </div>\
            </li>';
            // data+="<li class=\"swipeout deleted-callback\" data-id=\""+rs.rows.item(i).id_tmp+"\"><div class=\"item-content swipeout-content\"><div class=\"item-inner\"><div class=\"item-title\"><div class=\"item-header\">"+rs.rows.item(i).nama_barang+"</div>"+rs.rows.item(i).total.toLocaleString(locale)+"</div><div>"+rs.rows.item(i).qty+"</div></div></div><div class=\"swipeout-actions-right\"><a href=\"#\" onclick=\"hapusKeranjang('"+rs.rows.item(i).id_tmp+"')\" class=\"swipeout-delete\">Delete</a></div></li>";
            
            jumlah += parseInt(testp[i].qty_tmp * testp[i].harga_tmp);  // no PPN 
        }
        
        if(testp.length == 0) $('#disk_rp').val(0);
        
        totalSub = jumlah;
        
        data += '</ul>';
        // totalGrand = totalSub;
        
        // if(pauseFlag == 0) $('#keranjang').html(data);
        $('#keranjang').html(data);
        // $('#subtotal').html(totalSub.toLocaleString(locale));
        $('#bayar').val(totalSub.toLocaleString(locale));
        
        hitungDiskon();
        // refreshKeranjang = setTimeout(keranjang, 5 * 1000);
    }).fail(function(a,b,error){
        // alert(error);
        console.log(error);
    }) */
    // }
}

function tambahNote(id_tmp){
    // console.log('tambah note id: ' +id);
    app.dialog.prompt('Catatan:', 'Tambah', function(ctt){
        var temp = {
            catatan: ctt,
            id_tmp: id_tmp
        }

        app.request({
            url: site+'/API/catatan/'+cpyProf.ID_CLIENT+'/'+cpyProf.ID,
            method: 'POST',
            data: JSON.stringify(temp),
            success: function(result){
                var parsed = JSON.parse(result);
                if(parsed.ST_CODE == '1'){
                    app.toast.create({
                        text: "Sukses menyimpan catatan",
                        closeTimeout: 3000,
                        closeButton: true
                    }).open();
                } else {
                    app.toast.create({
                        text: "Gagal menyimpan catatan",
                        closeTimeout: 3000,
                        closeButton: true
                    }).open();
                }
                keranjang();
            }
        })        
    
        // $.ajax({
        //     url: site+ "/API/catatan/" +id+ "/",
        //     method: "POST",
        //     data: JSON.stringify(temp),
        //     success: function(result){
        //     // console.log(result);
        //     keranjang();
        //     }
        // })
    })
}

function hapusKeranjang(id_tmp){
    var temp = {
        id_tmp: id_tmp
    }

    app.request({
        url: site+'/API/hapus/'+cpyProf.ID_CLIENT+'/'+cpyProf.ID,
        method: 'POST',
        data: JSON.stringify(temp),
        success: function(result){
            var parsed = JSON.parse(result);
            if(parsed.ST_CODE == '1'){
                app.toast.create({
                    text: "Sukses hapus dari keranjang",
                    closeTimeout: 3000,
                    closeButton: true
                }).open();
            } else {
                app.toast.create({
                    text: "Gagal hapus dari keranjang",
                    closeTimeout: 3000,
                    closeButton: true
                }).open();
            }

            keranjang();
        }, error: function(){
            console.log('Error hapus keranjang');
        }
    })
}

function ubahAmount(id_tmp){
    // console.log(id);
    app.dialog.create({
        title: 'Ubah Kuantitas',
        closeByBackdropClick: true,
        content: '\
            <div class="list no-hairlines no-hairlines-between">\
                <ul>\
                    <li class="item-content item-input">\
                    <div class="item-inner">\
                        <div class="item-input-wrap">\
                        <input type="number" name="edit_amt" id="edit_amt" oninput="comma(this)" style="text-align: right;" />\
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
                var v = $('#edit_amt').val();
                var temp = {
                    qty: v,
                    id_tmp: id_tmp,
                }
        
                app.request({
                    url: site+'/API/edit/'+cpyProf.ID_CLIENT+'/'+cpyProf.ID,
                    method: "POST",
                    data: JSON.stringify(temp),
                    success: function(result){
                        var parsed = JSON.parse(result);
                        if(parsed.ST_CODE == '1'){
                            app.toast.create({
                                text: "Sukses ubah",
                                closeTimeout: 3000,
                                closeButton: true
                            }).open();
                        } else {
                            app.toast.create({
                                text: "Gagal ubah",
                                closeTimeout: 3000,
                                closeButton: true
                            }).open();
                        }

                        keranjang();
                    }
                })

                // $.ajax({
                //     // url: site+'/API/update_penj_dtl_tmp.php?id_barang='+id+'&harga='+hrg+'&id_login='+cpyProf.id_outlet+'&qty='+v
                //     // url: site+'/API/update_penj_dtl_tmp.php?id_barang='+id+'&harga='+hrg+'&id_login='+cpyProf.id_user+'&qty='+v

                // }).done(function(){
                //     app.toast.create({
                //         text: "Sukses Ubah",
                //         closeTimeout: 3000,
                //         closeButton: true
                //     }).open();
                //     keranjang();
                // })
            }
        }]
    }).open();
}

function inputNama(){
    app.dialog.create({
        title: 'Nama',
        closeByBackdropClick: false,
        content: 
            '<div class="list no-hairlines no-hairlines-between">\
                <ul style="height: 100%;"\
                    <li class="item-content item-input" style="height: inherit;">\
                        <div class="item-inner" style="height: inherit;">\
                            <div class="item-input-wrap" style="height: inherit;">\
                                <input class="input" type="text" name="atasnama" id="atasnama" style="text-align: center; height: inherit;" />\
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
            text: 'Lanjut',
            onClick: function(dialog, e){
                $('#temp_nama').val() = $('#atasnama').val();
                dialog.close();
                inputMeja();
            }
        }]
    }).open();
}

function inputMeja(){
    app.dialog.create({
        title: 'Meja',
        closeByBackdropClick: false,
        content: 
            '<div class="list no-hairlines no-hairlines-between">\
                <ul style="height: 100%;"\
                    <li class="item-content item-input" style="height: inherit;">\
                        <div class="item-inner" style="height: inherit;">\
                            <div class="item-input-wrap" style="height: inherit;">\
                                <input class="input" type="text" name="namameja" id="namameja" style="text-align: center; height: inherit;" />\
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
            text: 'Lanjut',
            onClick: function(dialog, e){
                $('#temp_meja').val() = $('#namameja').val();
                dialog.close();
            }
        }]
    }).open()
}

function order(){
    var temp = {
        nama : $('#temp_nama').val(),
        meja : $('#temp_meja').val()
    }

    app.request({
        url: site+'/API/order/'+cpyProf.ID_CLIENT+'/'+cpyProf.ID,
        method: 'POST',
        data: JSON.stringify(temp),
        success: function(result){
            var parsed = JSON.parse(result);
            if(parsed.ST_CODE == '1'){
                app.toast.create({
                    text: "Berhasil simpan pesanan",
                    closeTimeout: 3000,
                    closeButton: false
                }).open();
            } else {
                app.toast.create({
                    text: "Gagal simpan pesanan",
                    closeTimeout: 3000,
                    closeButton: false
                }).open();
            }
        }
    })
}

function pay(){
    app.request({
        url: site+'/API/order/'+cpyProf.ID_CLIENT+'/'+cpyProf.ID,
        method: 'POST',
        success: function(result){
            var parsed = JSON.parse(result);
            if(parsed.ST_CODE == '1'){
                app.views.main.router.navigate({
                    name: 'kasir_keranjang',
                    params: {
                        idPJ : parsed.DATA.idpj
                    }
                })
            } else {
                app.toast.create({
                    text: "Gagal simpan pesanan",
                    closeTimeout: 3000,
                    closeButton: false
                }).open();
            }
        }
    })
}