

function kasir_lihat_keranjang(id){
	
	app.request({
		url: site+'/API/kasir_list_keranjang/'+cpyProf.ID_CLIENT+'/'+id,
		method: 'GET',
		timeout: 10 * 1000,
		success: function(result){
			var parsed = JSON.parse(result);
			var datanya = '';
			if(parsed.ST_CODE == '1'){
				var iter = parsed.DATA;

				for (i = 0; i < iter.length; i++){
					var c = i % avColor.length;
					datanya += 

					'<li class="item-content ">\
								<div class="item-inner">\
									<div class="item-title">'+iter[i].nama_barang+'\
										<div class="item-footer">'+iter[i].qty_jual+' x '+parseInt(iter[i].harga_jual).toLocaleString("en-US")+'<br> '+iter[i].nama_satuan+'</div>\
									</div>\
									<div class="item-after">\
									</div>\
								</div>\
							</li>';
					
					
				}
				
			} else {
				// $(layout == '1' ? '#itemlist' : '#itemrow').html(datanya);
				// console.log('Barang kosong');
			}

			$('#kasir_hasil_keranjang').html(datanya);
			kasir_lihat_keranjang_total(id);
		}, error: function(){
			// alert('Gagal saat melakukan query!');
		}, complete: function(){
			// refreshKasir = setTimeout(tampilKasir, 10 * 1000);
			
		}
	})
}


function kasir_lihat_keranjang_total(id){
	app.request({
		url: site+'/API/kasir_total_keranjang/'+cpyProf.ID_CLIENT+'/'+id,
		method: 'GET',
		timeout: 10 * 1000,
		success: function(result){
			var parsed = JSON.parse(result);
			var datanya = '';
			if(parsed.ST_CODE == '1'){
				var iter = parsed.DATA;
					datanya = parseInt(iter[0].grantot_jual).toLocaleString("en-US");
			} else {
				// $(layout == '1' ? '#itemlist' : '#itemrow').html(datanya);
				// console.log('Barang kosong');
			}
			
			$('#subtotal').html(datanya);
			$('#subtotal1').html(datanya);
			$('#bayar').val(datanya);
			totalSub=iter[0].grantot_jual;
		}, error: function(){
			// alert('Gagal saat melakukan query!');
		}, complete: function(){
			
			// refreshKasir = setTimeout(tampilKasir, 10 * 1000);
		}
	})
}

function batal(id){
	// var r = confirm("Apakah kamu yakin ingin membatalkan Transaksi ini !!!");
	var r = app.dialog.confirm("Apakah kamu yakin ingin membatalkan Transaksi ini !!!", "Pembatalan", function(){ simpanbatal(id) });
	
}

function simpanbatal(id){
	app.request({
		url: site+'/API/batal_penjualan/'+cpyProf.ID_CLIENT+'/'+id+'/'+cpyProf.ID,
		method: 'GET',
		timeout: 10 * 1000,
		success: function(result){
			var parsed = JSON.parse(result);
			var datanya = '';
			if(parsed.DATA == '1'){
				app.views.main.router.navigate('/kasir/');
			} else {
				alert('Data gagal dibatalkan silahkan hubungi Admin !!!');
			}

			$('#kasir_hasil_keranjang').html(datanya);
		}, error: function(){
			// alert('Gagal saat melakukan query!');
		}, complete: function(){
			// refreshKasir = setTimeout(tampilKasir, 10 * 1000);
		}
	})
}

function bayar_kasir(id_pj){
    var d = new Date();
    var tgl = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+("0" + d.getDate()).slice(-2);
    var tgltime = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+("0" + d.getDate()).slice(-2)+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
    var jenis = $('#metode').val();
    var nomor_kartu = $('#nkartu').val();
    
    var subtotal = $('#subtotal').html().replace(/\D/g, '');
	
	var diskon_prs = parseInt($('#disk_pr').val().replace(/\D/g, ''));
    var diskon = parseInt($('#disk_rp').val().replace(/\D/g, ''));
    var bayar = parseInt($('#bayar').val().replace(/\D/g, ''));
    var nomor_ewallet = $('#idewallet').val();
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
		diskon_prs : diskon_prs,
        kembali : kembali,
        id_login : cpyProf.id_user,
        id_client : cpyProf.id_client,
        id_cabang : cpyProf.id_cabang,
        id_outlet : cpyProf.id_outlet,
        jenis_bayar : jenis,
        nomor_kartu : nomor_kartu,
        tgl : tgltime,
		id_ewallet : platform,
		grantot_jual : subtotal,
		id_pj : id_pj,
		nomor_ewallet : nomor_ewallet
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
        }
		
        app.request({
            url: site+'/API/pay/'+cpyProf.ID_CLIENT+'/'+cpyProf.ID,
            method: 'POST',
            data: JSON.stringify(temp),
            success: function(result){
				console.log(result);
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

