var routes = [
{
  path: '/home/',
  componentUrl: './pages/home.html',
  on: {
    pageAfterIn: function(){
      tampilMenu();
      keranjang();

      NativeStorage.getItem('modal', onModalFound, onModalNotFound);

      $.ajax({
        url: site+'/API/kategori/'+cpyProf.id_client+'/',
        method: 'GET',
      }).done(function(result){
        var data = '<option value="0">Semua menu</option>';
        for(var i = 0; i < result.length; i++){
          if(result[i].id_kategori == null || result[i].nama_kategori == null) continue;

          data += `<option value="${result[i].id_kategori}">${result[i].nama_kategori}</option>`;
        }

        $('#kategori').html(data);
      });

      // $('#currentUser').html('Operator: '+ (cpyProf.nama ? cpyProf.nama : cpyProf.client));

      if(screen.width < 400){
        $('#icon_home').css('font-size', '18px');
        $('#title_home').css('font-size', '14px');
        // $('#currentUser').css('font-size', '12px');
        // $('#currentUser').css('margin-right', '14px');
      }

      // tampilFood();
      // tampilBvrg();
      // tampilCombo();

      // emptyDB();

      // onLogin();
    }
  }
},
{
  path: '/pengaturan/',
  componentUrl: './pages/pengaturan.html'
},
{
  path: '/tambah/',
  componentUrl: './pages/tambah.html',
  on: {
    pageInit: function(){
      // emptyDB();
      // allItems();
    },
    pageAfterIn: function(){
      listBarang();
      console.log('afterin');

      $.ajax({
        url: site+'/API/kategori/'+cpyProf.id_client+'/',
        method: 'GET'
      }).always(function(result){
        var data = '<option value="" selected="" disabled="">-- Pilih Kategori --</option>';
        for(var i = 0; i < result.length; i++){
          data += '<option value="'+result[i].id_kategori+'">'+result[i].nama_kategori+'</option>';
        }

        $('#tipe_barang').html(data);
      });

      $.ajax({
        url: site+'/API/satuan/'+cpyProf.id_client+'/',
        method: 'GET'
      }).always(function(result){
        var data = '<option value="" selected="" disabled="">-- Pilih Satuan --</option>';
        for(var i = 0; i < result.length; i++){
          data += '<option value="'+result[i].id_satuan+'">'+result[i].nama_satuan+'</option>';
        }

        $('#satuan_select').html(data);
      });
    },
    pageAfterOut: function(){
      tampilMenu();
      // tampilFood();
      // tampilBvrg();
      // emptyDB();
    }
  }
},
{
  path: '/profil/',
  componentUrl: './pages/profil.html',
  on: {
    pageAfterIn: function(){
      $.ajax({
        url: site+'/API/profil/'+cpyProf.id_client+'/',
        method: 'GET'
      }).done(function(json){
        console.log(json);
        var result = json;

        $('#p_user').val(result[0].username);
        $('#p_email').val(result[0].email);
        $('#p_nama_lengkap').val(result[0].nama_client);
        $('#p_notel').val(result[0].nohp);
        $('#p_nama_outlet').val(result[0].nama_outlet);
        $('#p_alamat_outlet').val(result[0].alamat_outlet);
        $('#p_telp_outlet').val(result[0].telp_outlet);
      })
    }
  }
},
{
  path: '/',
  url: './index.html',
  on: {
    pageAfterIn: function(){
      // if(AdMob) AdMob.showInterstitial();
      $('#appversion').html("v"+appVer);
    },
    pageAfterOut: function(){
      AdMob.showInterstitial();
    }
  }
},
{
  path: '/dashboard/',
  componentUrl: './pages/dashboard.html',
  on: {
    pageAfterIn: function(){
      var dt = new Date();
      dashboardFavorit();
      dashboardHarian(dt.getFullYear(), dt.getMonth());
      console.log('tahun: '+dt.getFullYear(), 'bulan: '+(dt.getMonth() + 1));
    }
  }
},
{
  path: '/penjualan/',
  componentUrl: './pages/penjualan.html',
},
{
  path: '/closing/',
  componentUrl: './pages/closing.html',
  on: {
    pageAfterIn: function(){
      console.log('closing');
      NativeStorage.getItem('stamp', onGetStampDone, onGetStampFail);
    }, 
    pageAfterOut: function(){
      cl_items = [];
    }
  }
},
{
  path: '/penjualan_item/',
  componentUrl: './pages/penjualan_item.html',
},
{
  path: '/register/',
  componentUrl: './pages/register.html',
  on: {
    pageAfterIn: function(){
      $('#appversion_r').html("v"+appVer);
    }
  }
},
{
  path: '/lupapass/',
  componentUrl: './pages/lupapassword.html'
  /*on: {
    pageAfterIn: function(){
      $('#appversion_r').html("v"+appVer);
    }
  }*/
},
{
  path: '/satuan/',
  componentUrl: './pages/satuan.html',
  on: {
    pageAfterIn: function(){
      listSatuan();
    }
  }
},
{
  path: '/kategori/',
  componentUrl: './pages/kategori.html',
  on: {
    pageAfterIn: function(){
      listKategori();
    }
  }
},
{
  path: '/combo/',
  componentUrl: './pages/combo.html',
  // on: {
  //   pageInit: function(){
  //     listSatuan();
  //   }
  // }
  /*on: {
    pageInit: function(){
      emptyDB();
      // allItems();
    },
    pageAfterOut: function(){
      tampilFood();
      tampilBvrg();
      emptyDB();
    }
  }*/
},
{
  path: '/pricelist/',
  componentUrl: './pages/pricelist.html',
  on: {
    pageAfterIn: function(){
      listPricelist();
      app.request({
        url: site+'/API/cabang/cb/'+cpyProf.id_client+'/',
        method: 'GET',
        success: function(json){
          let isi = '<option value="0">-- Semua Cabang --</option>';
          let result = JSON.parse(json);
          for(let i = 0; i < result.length; i++){
            isi += `<option value="${result[i].id_cabang}">${result[i].nama_cabang}</option>`;
          }

          $('#id_cabang').html(isi);
        }
      })
    }
  }
}];
