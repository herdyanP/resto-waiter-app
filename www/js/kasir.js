

function tampilKasir(){
	// console.log('Menu');
	clearTimeout(refreshKasir);
	var kat = $('#kategori').val();
	app.request({
		url: site+'/API/list_kasir/'+cpyProf.ID_CLIENT,
		method: 'GET',
		timeout: 10 * 1000,
		success: function(result){
			var parsed = JSON.parse(result);
			var datanya = '';
			if(parsed.ST_CODE == '1'){
				var iter = parsed.DATA;

				for (i = 0; i < iter.length; i++){
					var c = i % avColor.length;
					var exp = iter[i].no_penjualan.split("/");
					datanya += 

					'<div class="col-30 tablet-25">\
						<div class="card" onclick="pindah_keranjang_kasir('+iter[i].id_pj+')">\
							<div class="card-content">\
								<div style="text-align: center; border-radius: 4px 4px 0 0; background: '+avColor[c]+'">\
									<div class="lettericonkasir">'+exp[3]+'</div>\
								</div>\
								<div style="padding: 5px; height: 4em;font-size:10px;">Nama : '+iter[i].customer+'<br>Meja : '+iter[i].meja+'</div>\
								<div style="color: gray; text-align: right;" class="nopenjualankasir">'+iter[i].no_penjualan+'</div>\
							</div>\
						</div>\
					</div>';
					
					
				}

				// var sisa = iter.length % 4;
				// if(screen.width >= 768 && iter.length % 4 > 0){
				// 	for(var i = 0; i < 4 - sisa; i++){
				// 		datanya += 
				// 		'<div class="col-30 tablet-25" style="visibility: hidden;">\
				// 			<div class="card">\
				// 				<div class="card-content">\
				// 					<div style="text-align: center; border-radius: 4px 4px 0 0;">\
				// 						<div class="lettericon">NIL</div>\
				// 					</div>\
				// 					<div style="padding: 5px; height: 3em;">NIL</div>\
				// 					<div style="color: gray; text-align: right; font-size: 12px; padding: 5px;">Rp 0</div>\
				// 				</div>\
				// 			</div>\
				// 		</div>';
				// 	}
				// }
				
				// if(iter.length % 3 != 0 && layout == '1') datanya += '<div class="col-33" style="height: 100px; visibility: hidden;\"><p style="margin: unset; position: relative; top: 50%; transform: translateY(-50%);">NIL</p></div>';
				// $(layout == '1' ? '#itemlist' : '#itemrow').html(datanya);
			} else {
				// $(layout == '1' ? '#itemlist' : '#itemrow').html(datanya);
				// console.log('Barang kosong');
			}

			$('#tampilan_list_kasir').html(datanya);
		}, error: function(){
			// alert('Gagal saat melakukan query!');
		}, complete: function(){
			refreshKasir = setTimeout(tampilKasir, 10 * 1000);
		}
	})
}


function pindah_keranjang_kasir(id){
	// console.log(id);
	app.views.main.router.navigate({
    name: 'kasir_keranjang',
    	params: {idPJ : id}
  	});
}

