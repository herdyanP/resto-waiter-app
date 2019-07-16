var routes = [
{
  path: '/',
  url: './index.html',
  name: 'home',
  on: {
    pageAfterIn: function(){
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
        url: 'http://demo.medianusamandiri.com/lightpos/API/satuan/'+cpyProf.id_client+'/',
        method: 'GET'
      }).always(function(result){
        var data = '<option value="" selected="" disabled="">-- Pilih Satuan --</option>';
        for(var i = 0; i < result.length; i++){
          data += '<option value="'+result[i].id_satuan+'">'+result[i].nama_satuan+'</option>';
        }

        $('#satuan_select').html(data);
      })
    },
    pageAfterOut: function(){
      tampilFood();
      tampilBvrg();
      // emptyDB();
    }
  }
},
{
  path: '/profil/',
  componentUrl: './pages/profil.html'
},
{
  path: '/login/',
  componentUrl: './pages/login.html',
  on: {
    pageAfterIn: function(){
      $('#appversion').html("v"+appVer);
    }
  }
},
{
  path: '/penjualan/',
  componentUrl: './pages/penjualan.html',
  on: {
    pageInit: function(){
      listPenjualan();
    }
  }
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
}];
