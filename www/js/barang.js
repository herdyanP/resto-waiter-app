function tampilMenu(){
	var kat = $('#kategori').val();
	app.request({
		url: site+'/API/kategori/'+cpyProf.id_client+'/',
		method: 'GET',
		timeout: 10 * 1000,
		success: function(result){
			console.log('kategori');
			var data = '<option value="0">Semua menu</option>';
			for(var i = 0; i < result.length; i++){
				if(result[i].id_kategori == null || result[i].nama_kategori == null) continue;
				
				if(kat != 0 && kat == result[i].id_kategori){
					// data += `<option value="${result[i].id_kategori}" selected>${result[i].nama_kategori}</option>`;
					data += '<option value="'+result[i].id_kategori+'" selected>'+result[i].nama_kategori+'</option>';
				} else {
					// data += `<option value="${result[i].id_kategori}">${result[i].nama_kategori}</option>`;
					data += '<option value="'+result[i].id_kategori+'">'+result[i].nama_kategori+'</option>';
				}
			}
			
			if(pauseFlag == 0) $('#kategori').html(data);
		}
	})
	$.ajax({
		url: site+'/API/kategori/'+cpyProf.id_client+'/',
		method: 'GET',
	}).done(function(result){
		console.log('kategori');
		var data = '<option value="0">Semua menu</option>';
		for(var i = 0; i < result.length; i++){
			if(result[i].id_kategori == null || result[i].nama_kategori == null) continue;
			
			if(kat != 0 && kat == result[i].id_kategori){
				// data += `<option value="${result[i].id_kategori}" selected>${result[i].nama_kategori}</option>`;
				data += '<option value="'+result[i].id_kategori+'" selected>'+result[i].nama_kategori+'</option>';
			} else {
				// data += `<option value="${result[i].id_kategori}">${result[i].nama_kategori}</option>`;
				data += '<option value="'+result[i].id_kategori+'">'+result[i].nama_kategori+'</option>';
			}
		}
		
		if(pauseFlag == 0) $('#kategori').html(data);
	});
	
	$.ajax({
		url: site+'/API/barang/'+cpyProf.id_outlet+'/'+kat+'/',
		method: 'GET'
	}).done(function(result){
		// console.log(result);
		console.log('menu');
		var len, i;
		
		var datanya = '';
		for (i = 0; i < result.length; i++){
			if(cpyProf.jenis == 1){
				// datanya += `<div onclick="simpan(${result[i].id_barang}, 1, ${result[i].harga.split('-')[0]}, '${result[i].nama_barang}')" class="col-33" style="height: 100px;"><div style="margin: auto; width: 50px; height: 50px; border: solid black 1px; border-radius: 20px;"><i style="font-size: 40px; line-height: 50px; vertical-align: middle; text-align: center;" class="icon material-icons md-only">restaurant</i></div><p style="margin: unset; position: relative; top: 20%; transform: translateY(-50%); ${(screen.width < 400 ? 'font-size: 10px;' : '')}">${result[i].nama_barang}</p></div>`;
				datanya += '<div onclick="simpan('+result[i].id_barang+', 1, '+result[i].harga.split("-")[0]+', \''+result[i].nama_barang+'\')" class="col-33" style="height: 100px;"><div style="margin: auto; width: 50px; height: 50px; border: solid black 1px; border-radius: 20px;"><i style="font-size: 40px; line-height: 50px; vertical-align: middle; text-align: center;" class="icon material-icons md-only">restaurant</i></div><p style="margin: unset; position: relative; top: 20%; transform: translateY(-50%); '+(screen.width < 400 ? "font-size: 10px;" : "")+'">'+result[i].nama_barang+'</p></div>';
			} else {
				datanya += '\
				<li class="item-content">\
				<div class="item-media" style="background: black; color: white; border-radius: 30px;">\
				<div style="width: 100%; text-align: center;">'+result[i].nama_barang[0]+'</div>\
				</div>\
				<div class="item-inner" onclick="simpan('+result[i].id_barang+', 1, '+result[i].harga.split("-")[0]+', \''+result[i].nama_barang+'\')">\
				<div class="item-title">'+result[i].nama_barang+'</div>\
				<div class="item-after">Rp '+parseInt(result[i].harga.split("-")[0]).toLocaleString("id-ID")+'</div>\
				</div>\
				</li>\
				';
			}
			// datanya += '<div onclick="simpan('+result[i].id_barang+', 1,'+result[i].harga.split('-')[0]+',\''+result[i].nama_barang+'\')" class="col-33" style="height: 100px;"><div style="margin: auto; width: 50px; height: 50px; border: solid black 1px; border-radius: 20px;"><i style="font-size: 40px; line-height: 50px; vertical-align: middle; text-align: center;" class="icon material-icons md-only">restaurant</i></div><p style="margin: unset; position: relative; top: 20%; transform: translateY(-50%); ' +(screen.width < 400 ? 'font-size: 10px;' : '')+ '">' +result[i].nama_barang+ '</p></div>';
			// datanya += '<div onclick="simpan('+result[i].id_barang+', 1,'+result[i].harga.split('-')[0]+',\''+result[i].nama_barang+'\')" class="col-33" style="height: 100px;"><div style="margin: auto; width: ' +(screen.width < 400 ? '40px' : '50px')+ '; height: ' +(screen.width < 400 ? '40px' : '50px')+ '; border: solid black 1px; border-radius: 20px;"><i style="font-size: ' +(screen.width < 400 ? '30px' : '40px')+ '; line-height: ' +(screen.width < 400 ? '40px' : '50px')+ '; vertical-align: middle; text-align: center;" class="icon material-icons md-only">restaurant</i></div><p style="margin: unset; position: relative; top: 20%; transform: translateY(-50%); ' +(screen.width < 400 ? 'font-size: 10px;')+ '">'+result[i].nama_barang+'</p></div>';
		}
		
		if(result.length % 3 != 0 && cpyProf.jenis == 1) datanya += '<div class="col-33" style="height: 100px; visibility: hidden;\"><p style="margin: unset; position: relative; top: 50%; transform: translateY(-50%);">NIL</p></div>';
		if(pauseFlag == 0) $(cpyProf.jenis == 1 ? '#itemlist' : '#itemrow').html(datanya);
		refreshMenu = setTimeout(tampilMenu, 5 * 1000);
	}).fail(function(a,b,error){
		console.log(error);
	})
}