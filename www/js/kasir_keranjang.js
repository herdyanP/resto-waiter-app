

function kasir_lihat_keranjang(id){
	// console.log('Menu');
	// clearTimeout(refreshKasir);
	// var kat = $('#kategori').val();
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
					// var exp = iter[i].no_penjualan.split("/");
					datanya += 

					'<li class="item-content ">\
								<div class="item-inner">\
									<div class="item-title">'+iter[i].nama_barang+'\
										<div class="item-footer">'+iter[i].qty_jual+' x '+iter[i].harga_jual+'<br> '+iter[i].nama_satuan+'</div>\
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
		}, error: function(){
			// alert('Gagal saat melakukan query!');
		}, complete: function(){
			// refreshKasir = setTimeout(tampilKasir, 10 * 1000);
		}
	})
}

function batal(id){
	var r = confirm("Apakah kamu yakin ingin membatalkan Transaksi ini !!!");
	if (r == true) {
	  simpanbatal(id);
	} else {
	  
	}
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

