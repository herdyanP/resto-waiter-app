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
				alert('Terjadi kesalahan saat mengambil list kategori');
			}
			// if(pauseFlag == 0) $('#kategori').html(data);
		}, error: function(){
			app.preloader.hide();
			alert('Terjadi kesalahan saat mengambil list kategori');
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
			if(parsed.ST_CODE == '1'){
				var iter = parsed.DATA;
				var datanya = '';

				for (i = 0; i < iter.length; i++){
					if(cpyProf.jenis_outlet == '1'){ // Row
						datanya += 
							'<div onclick="simpan('+iter[i].id_barang+', 1, '+iter[i].harga+')" class="col-33" style="height: 100px;">\
								<div style="margin: auto; width: 50px; height: 50px; border: solid black 1px; border-radius: 20px;">\
									<i style="font-size: 40px; line-height: 50px; vertical-align: middle; text-align: center;" class="icon material-icons md-only">restaurant</i>\
								</div>\
								<p style="margin: unset; position: relative; top: 20%; transform: translateY(-50%); '+(screen.width < 400 ? "font-size: 10px;" : "")+'">'+iter[i].nama_barang+'</p>\
							</div>';
					} else if(cpyProf.jenis_outlet == '2'){ // List
						datanya += 
							'<li class="item-content">\
								<div class="item-media" style="background: black; color: white; border-radius: 30px;">\
									<div style="width: 100%; text-align: center;">'+iter[i].nama_barang[0]+'</div>\
								</div>\
								<div class="item-inner" onclick="simpan('+iter[i].id_barang+', 1, '+iter[i].harga+')">\
									<div class="item-title">'+iter[i].nama_barang+'</div>\
									<div class="item-after">Rp 0</div>\
								</div>\
							</li>';
					}
				}	
				
				if(result.length % 3 != 0 && cpyProf.jenis_outlet == 1) datanya += '<div class="col-33" style="height: 100px; visibility: hidden;\"><p style="margin: unset; position: relative; top: 50%; transform: translateY(-50%);">NIL</p></div>';
				$(cpyProf.jenis_outlet == 1 ? '#itemlist' : '#itemrow').html(datanya);
			} else {
				console.log('Barang kosong');
			}
		}, error: function(){
			console.log('Request menu timeout / failed');
		}, complete: function(){
			refreshMenu = setTimeout(tampilMenu, 10 * 1000);
		}
	})
}