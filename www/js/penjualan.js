function simpan(id, qty, harga){
    var temp = {
        'id_barang' : id,
        'qty' : qty,
        'harga' : harga
    }

    app.request({
        url: site+'/API/cart/'+cpyProf.ID_CLIENT+'/'+cpyProf.ID,
        method: 'POST',
        timeout: 10 * 1000,
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
        timeout: 10 * 1000,
        success: function(result){
            var parsed = JSON.parse(result);

            if(parsed.ST_CODE == '1'){
                var data = parsed.DATA;
                for(i = 0; i < data.length; i++){
                    data += 
                    '<li class="item-content ">\
                        <div class="item-inner">\
                            <div class="item-title" onclick="ubahAmount('+data[i].id_barang+','+data[i].harga_tmp+');">'+data[i].nama_barang+'\
                                <div class="item-footer">'+data[i].qty_tmp+' x '+data[i].harga_tmp+'<br> Cttn: '+data[i].catatan+'</div>\
                            </div>\
                            <div class="item-after">\
                                <a href="#" onclick="tambahNote('+data[i].id_tmp+')"><i class="icon material-icons md-only" style="margin: 0 5px;">playlist_add</i></a>\
                                <a href="#" onclick="hapusKeranjang('+data[i].id_barang+')"><i class="icon material-icons md-only" style="margin: 0 5px;">remove_shopping_cart</i></a>\
                            </div>\
                        </div>\
                    </li>';
                    // data+="<li class=\"swipeout deleted-callback\" data-id=\""+rs.rows.item(i).id_tmp+"\"><div class=\"item-content swipeout-content\"><div class=\"item-inner\"><div class=\"item-title\"><div class=\"item-header\">"+rs.rows.item(i).nama_barang+"</div>"+rs.rows.item(i).total.toLocaleString('id-ID')+"</div><div>"+rs.rows.item(i).qty+"</div></div></div><div class=\"swipeout-actions-right\"><a href=\"#\" onclick=\"hapusKeranjang('"+rs.rows.item(i).id_tmp+"')\" class=\"swipeout-delete\">Delete</a></div></li>";
                    
                    jumlah += parseInt(data[i].qty_tmp * data[i].harga_tmp);  // no PPN 
                }
            } else {
                $('#disk_rp').val(0);
                console.log('keranjang kosong');
            }
            
            totalSub = jumlah;
            data += '</ul>';
            $('#keranjang').html(data);
            $('#bayar').val(totalSub.toLocaleString('id-ID'));
            
            hitungDiskon();
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
            // data+="<li class=\"swipeout deleted-callback\" data-id=\""+rs.rows.item(i).id_tmp+"\"><div class=\"item-content swipeout-content\"><div class=\"item-inner\"><div class=\"item-title\"><div class=\"item-header\">"+rs.rows.item(i).nama_barang+"</div>"+rs.rows.item(i).total.toLocaleString('id-ID')+"</div><div>"+rs.rows.item(i).qty+"</div></div></div><div class=\"swipeout-actions-right\"><a href=\"#\" onclick=\"hapusKeranjang('"+rs.rows.item(i).id_tmp+"')\" class=\"swipeout-delete\">Delete</a></div></li>";
            
            jumlah += parseInt(testp[i].qty_tmp * testp[i].harga_tmp);  // no PPN 
        }
        
        if(testp.length == 0) $('#disk_rp').val(0);
        
        totalSub = jumlah;
        
        data += '</ul>';
        // totalGrand = totalSub;
        
        // if(pauseFlag == 0) $('#keranjang').html(data);
        $('#keranjang').html(data);
        // $('#subtotal').html(totalSub.toLocaleString('id-ID'));
        $('#bayar').val(totalSub.toLocaleString('id-ID'));
        
        hitungDiskon();
        // refreshKeranjang = setTimeout(keranjang, 5 * 1000);
    }).fail(function(a,b,error){
        // alert(error);
        console.log(error);
    }) */
    // }
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