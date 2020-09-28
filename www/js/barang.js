function listKategori(){
	var kat = $('#kategori').val();
	// clearTimeout(refreshMenu);
	app.preloader.show();
	app.request({
		url: site+'/API/kategori/'+cpyProf.ID_CLIENT,
		method: 'GET',
		timeout: 10 * 1000,
		success: function(result){
			// console.log('kategori');
			var parsed = JSON.parse(result);
			var data = '<option value="0">Semua menu</option>';

			if(parsed.ST_CODE == '1'){
				var iter = parsed.DATA;
				for(var i = 0; i < iter.length; i++){
					if(iter[i].id_kategori == null || iter[i].nama_kategori == null) continue;
					if(kat != 0 && kat == iter[i].id_kategori){
						data += '<option value="'+iter[i].id_kategori+'" selected>'+iter[i].nama_kategori+'</option>';
					} else {
						data += '<option value="'+iter[i].id_kategori+'">'+iter[i].nama_kategori+'</option>';
					}
				}

				$('#kategori').html(data);
				app.preloader.hide();
			} else {
				app.preloader.hide();
				// alert('Terjadi kesalahan saat mengambil list kategori');
			}
			// if(pauseFlag == 0) $('#kategori').html(data);
		}, error: function(){
			app.preloader.hide();
			// alert('Terjadi kesalahan saat mengambil list kategori');
		}
	})
}

function tampilMenu(){
	// console.log('Menu');
	clearTimeout(refreshMenu);
	var kat = $('#kategori').val();
	app.request({
		url: site+'/API/menu/'+cpyProf.ID_CLIENT+'/'+kat,
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

					'<div class="col-30 tablet-25">\
						<div class="card" onclick="simpan('+iter[i].id_barang+', 1, '+iter[i].harga+')">\
							<div class="card-content">\
								<div style="text-align: center; border-radius: 4px 4px 0 0; background: '+avColor[c]+'">\
									<div class="lettericon">'+iter[i].nama_barang[0]+'</div>\
								</div>\
								<div style="padding: 5px; height: 3em;">'+iter[i].nama_barang+'</div>\
								<div style="color: gray; text-align: right; font-size: 12px; padding: 5px;">Rp '+parseInt(iter[i].harga).toLocaleString(locale)+'</div>\
							</div>\
						</div>\
					</div>';
					
					/* '<div onclick="simpan('+iter[i].id_barang+', 1, '+iter[i].harga+')" class="col-33" style="height: 100px;">\
						<div style="margin: auto; width: 50px; height: 50px; border: solid black 1px; border-radius: 20px;">\
							<i style="font-size: 40px; line-height: 50px; vertical-align: middle; text-align: center;" class="icon material-icons md-only">restaurant</i>\
						</div>\
						<p style="margin: unset; position: relative; top: 20%; transform: translateY(-50%); '+(screen.width < 400 ? "font-size: 10px;" : "")+'">'+iter[i].nama_barang+'</p>\
					</div>'; */

					/* '<div onclick="simpan('+iter[i].id_barang+', 1, '+iter[i].harga+')" class="col-33">\
						<div style="margin: auto; border: solid black 1px; border-radius: 20px; background: '+avColor[c]+'; color: white;">\
							<p style="vertical-align: middle; text-align: center; font-size: 5vw;">'+iter[i].nama_barang[0]+'</p>\
						</div>\
						<p style="margin: unset; position: relative; top: 20%; transform: translateY(-50%); '+(screen.width < 400 ? "font-size: 10px;" : "")+'">'+iter[i].nama_barang+'</p>\
					</div>'; */

					// if(layout == '1'){ // Row
					// 	datanya += 
					// 		/* '<div onclick="simpan('+iter[i].id_barang+', 1, '+iter[i].harga+')" class="col-33" style="height: 100px;">\
					// 			<div style="margin: auto; width: 50px; height: 50px; border: solid black 1px; border-radius: 20px;">\
					// 				<i style="font-size: 40px; line-height: 50px; vertical-align: middle; text-align: center;" class="icon material-icons md-only">restaurant</i>\
					// 			</div>\
					// 			<p style="margin: unset; position: relative; top: 20%; transform: translateY(-50%); '+(screen.width < 400 ? "font-size: 10px;" : "")+'">'+iter[i].nama_barang+'</p>\
					// 		</div>'; */
					// 		'<div onclick="simpan('+iter[i].id_barang+', 1, '+iter[i].harga+')" class="col-33">\
					// 			<div style="margin: auto; border: solid black 1px; border-radius: 20px; background: '+avColor[c]+'; color: white;">\
					// 				<p style="vertical-align: middle; text-align: center; font-size: 5vw;">'+iter[i].nama_barang[0]+'</p>\
					// 			</div>\
					// 			<p style="margin: unset; position: relative; top: 20%; transform: translateY(-50%); '+(screen.width < 400 ? "font-size: 10px;" : "")+'">'+iter[i].nama_barang+'</p>\
					// 		</div>';
					// } else if(layout == '2'){ // List
					// 	datanya += 
					// 		'<li class="item-content">\
					// 			<div class="item-media" style="background: '+avColor[c]+'; color: white; border-radius: 30px;">\
					// 				<div style="width: 100%; text-align: center;">'+iter[i].nama_barang[0]+'</div>\
					// 			</div>\
					// 			<div class="item-inner" onclick="simpan('+iter[i].id_barang+', 1, '+iter[i].harga+')">\
					// 				<div class="item-title">'+iter[i].nama_barang+'</div>\
					// 				<div class="item-after">Rp '+parseInt(iter[i].harga).toLocaleString(locale)+'</div>\
					// 			</div>\
					// 		</li>';
					// }
				}

				var sisa = iter.length % 4;
				if(screen.width >= 768 && iter.length % 4 > 0){
					for(var i = 0; i < 4 - sisa; i++){
						datanya += 
						'<div class="col-30 tablet-25" style="visibility: hidden;">\
							<div class="card">\
								<div class="card-content">\
									<div style="text-align: center; border-radius: 4px 4px 0 0;">\
										<div class="lettericon">NIL</div>\
									</div>\
									<div style="padding: 5px; height: 3em;">NIL</div>\
									<div style="color: gray; text-align: right; font-size: 12px; padding: 5px;">Rp 0</div>\
								</div>\
							</div>\
						</div>';
					}
				}
				
				// if(iter.length % 3 != 0 && layout == '1') datanya += '<div class="col-33" style="height: 100px; visibility: hidden;\"><p style="margin: unset; position: relative; top: 50%; transform: translateY(-50%);">NIL</p></div>';
				// $(layout == '1' ? '#itemlist' : '#itemrow').html(datanya);
			} else {
				// $(layout == '1' ? '#itemlist' : '#itemrow').html(datanya);
				console.log('Barang kosong');
			}

			$('#menu_card').html(datanya);
		}, error: function(){
			// alert('Gagal saat melakukan query!');
		}, complete: function(){
			refreshMenu = setTimeout(tampilMenu, 10 * 1000);
		}
	})
}

function searched(e, q){
	if ( (window.event ? event.keyCode : e.which) == 13) { 
		cariItem(q);
	}
}

function cariItem(q){
	clearTimeout(refreshMenu);
	var kat = $('#kategori').val();
	var que = {'query': q};
	var datanya = "";
  
	app.preloader.show();

	app.request({
		url: site+'/API/menu/'+cpyProf.ID_CLIENT+'/'+kat,
		method: 'POST',
		data: JSON.stringify(que),
		success: function(result){
			var parsed = JSON.parse(result);
			if(parsed.ST_CODE == '1'){
				var iter = parsed.DATA;
				for (i = 0; i < iter.length; i++){
					var c = i % avColor.length;
					if(layout == 1){
						datanya += 
							'<div onclick="simpan('+iter[i].id_barang+', 1, '+iter[i].harga+')" class="col-33" style="height: 33vw;">\
								<div style="margin: auto; width: 18vw; height: 18vw; border: solid black 1px; border-radius: 20px; background: '+avColor[c]+'; color: white;">\
									<p style="vertical-align: middle; text-align: center; font-size: 5vw;">'+iter[i].nama_barang[0]+'</p>\
								</div>\
								<p style="margin: unset; position: relative; top: 20%; transform: translateY(-50%); '+(screen.width < 400 ? "font-size: 10px;" : "")+'">'+iter[i].nama_barang+'</p>\
							</div>';
					} else {
						datanya += 
							'<li class="item-content">\
								<div class="item-media" style="background: '+avColor[c]+'; color: white; border-radius: 30px;">\
									<div style="width: 100%; text-align: center;">'+iter[i].nama_barang[0]+'</div>\
								</div>\
								<div class="item-inner" onclick="simpan('+iter[i].id_barang+', 1, '+iter[i].harga+')">\
									<div class="item-title">'+iter[i].nama_barang+'</div>\
									<div class="item-after">Rp '+parseInt(iter[i].harga).toLocaleString(locale)+'</div>\
								</div>\
							</li>';
					}
				}
			  
				if(iter.length % 3 != 0 && layout == 1) datanya += '<div class="col-33" style="height: 100px; visibility: hidden;\"><p style="margin: unset; position: relative; top: 50%; transform: translateY(-50%);">NIL</p></div>';
				$(layout == '1' ? '#itemlist' : '#itemrow').html(datanya);
			} else {
				$(layout == '1' ? '#itemlist' : '#itemrow').html('');
				console.log('Search kosong');
			}
		}, error: function(){
			// alert('Gagal saat melakukan query!');
		}, complete: function(){
			app.preloader.hide();
		}
	})
}