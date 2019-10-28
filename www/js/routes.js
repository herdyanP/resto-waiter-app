var routes = [
{
  path: '/home/',
  componentUrl: './pages/home.html',
  on: {
    pageAfterIn: function(){
      AdMob.showInterstitial();
      tampilMenu();
      keranjang();

      searchbar = app.searchbar.create({
        el: '.searchbar',
        on: {
          enable: function(){
            pauseFlag = 1;
          },
          disable: function(){
            pauseFlag = 0;

            tampilMenu();
            keranjang();
          }
        }
      })

      NativeStorage.getItem('modal', onModalFound, onModalNotFound);

      var ac = app.autocomplete.create({
        inputEl: '#idewallet',
        openIn: 'dropdown',
        preloader: true,
        limit: 10,
        source: function(query, render){
          var autoc = this;
          var results = [];
          var nohp = $('#idewallet').val();
          if(query.length === 0){
            render(results);
            return;
          }

          autoc.preloaderShow();
          app.request({
            url: site+"/API/cust/"+cpyProf.id_client+"/"+nohp+"/",
            method: "GET",
            success: function(json){
              var result = JSON.parse(json);
              for(var i = 0; i < result.length; i++){
                if(result[i].no_hp.indexOf(query) >= 0) results.push(result[i].no_hp);
              }

              autoc.preloaderHide();
              render(results);
            }
          });
        }
      });

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
    },
    pageAfterOut: function(){
      clearTimeout(refreshMenu);
      clearTimeout(refreshMenu);
      clearTimeout(refreshMenu);

      clearTimeout(refreshKeranjang);
      clearTimeout(refreshKeranjang);
      clearTimeout(refreshKeranjang);
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
      // AdMob.showInterstitial();
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
},
{
  name: 'dtlpricel',
  path: '/dtlpricel/:client/:barang',
  componentUrl: './pages/detail_pricelist.html',
  on: {
    pageAfterIn: function(e, page){
      let temp = {
        tipe: 'pricelist',
        id_client : page.route.params.client,
        id_barang : page.route.params.barang
      }

      app.request({
        url: site+'/API/history/',
        method: 'POST',
        data: JSON.stringify(temp),
        success: function(json){
          let result = JSON.parse(json);
          let cabang = [];

          for(let i = 0; i < result.length; i++){
            console.log(result[i]);
          }
        }
      })
    }
  }
},
{
  name: 'preview',
  path: '/preview/:idpj/',
  /*componentUrl: './pages/preview.html',*/
  template: `
    <div class="page">
      <div class="navbar">
        <div class="navbar-inner">
          <div class="title"></div>
          <div class="right">
            <a href="#" class="link icon-only" onclick="dialogShare({{$route.params.idpj}});">
              <i class="material-icons">share</i>
            </a>
          </div>
        </div>
      </div>

      <div class="page-content">
        <div class="block" id="preview_rcpt"></div>
        <button class="button button-fill color-green" id="bayarButton" onclick="selesai()">Selesai</button>
      </div>
    </div>
  `,
  on: {
    pageAfterIn: function(e, page){
      $.ajax({
        url: site+'/API/penjualan/'+page.route.params.idpj+'/',
        method: 'GET'
      }).done(function(json){
        var result = JSON.parse(json);
        var dt = new Date();
        // var tot = totalGrand;
        // var totInt = tot.replace(/\D/g, '');
        var kembali = parseInt(paid) - parseInt(totalGrand);
        var jn = '';
        switch($('#metode').val()){
          case '1':
            jn = 'Tunai';
            break;
          case '2':
            jn = 'Kartu Debit/Kredit';
            break;
          case '3':
            jn = ($('#platform').val() == 1 ? 'GO-PAY' : 'OVO');
            break;
        }

        var kop = '';
        var cab = '';

        var dy = ('00'+dt.getDate()).slice(-2);
        var hr = ('00'+dt.getHours()).slice(-2);
        var mn = ('00'+dt.getMinutes()).slice(-2);
        var stamp = 'Tanggal   : ' + dy + ' ' + shortMonths[dt.getMonth()] + ' ' + dt.getFullYear() + ', ' + hr+':'+mn;

        var sub = '<p>Sub-total';
        var paid = '<p>Paid';
        var via = '<p>Via: ';
        var kbl = '<p>Change';
        var list = '<p>';

        for(var i = 0; i < (31 - cpyProf.outlet.length)/2; i++){
          kop += ' ';
        } kop += cpyProf.outlet + '{br}';

        for(var i = 0; i < (24 - cpyProf.cabang.length)/2; i++){
          cab += ' ';
        } cab += 'Cabang ' + cpyProf.cabang + '{br}';

        var header = '<p>Sales Receipt<br>--------------------------------</p>';
        var subheader = '<p>No. Trans : ' +result[0].no_penjualan+ '<br>' +stamp+ '<br>Operator  : ' +(cpyProf.client ? cpyProf.client : cpyProf.nama)+ '<br>--------------------------------</p>';
        var thanks = '<p style="text-align: center">Terima Kasih Atas <br>Kunjungan Anda <br><br><br><br><br></p>';
        // var eol = '{br}{left}';


        for(var i = 0; i < 32 - 'Sub-total'.length - parseInt(result[0].grantot_jual).toLocaleString('id-ID').length; i++){
          sub += ' ';
        } sub += parseInt(result[0].grantot_jual).toLocaleString('id-ID') + '</p>';

        // for(var i = 0; i < 29-tot.length; i++){
        //   crd += ' ';
        // } crd += tot + ' \n';

        for(var i = 0; i < 32 - 'Paid'.length - parseInt(result[0].bayar_tunai).toLocaleString('id-ID').length; i++){
          paid += ' ';
        } paid += parseInt(result[0].bayar_tunai).toLocaleString('id-ID') + '</p>';

        for(var i = 0; i < 32 - 'Change'.length - parseInt(result[0].kembali_tunai).toLocaleString('id-ID').length; i++){
          kbl += ' ';
        } kbl += parseInt(result[0].kembali_tunai).toLocaleString('id-ID') + '</p>';

        for(var i = 0; i < 32 - 'Via: '.length - jn.length; i++){
          via += ' ';
        } via += jn + '</p>';

        for(var i = 0; i < result.length; i++){
          var ws = '';
          var q = parseInt(result[i].qty_jual).toLocaleString('id-ID');
          var satuan = parseInt(result[i].harga_jual).toLocaleString('id-ID');
          var jumlah = (parseInt(result[i].harga_jual) * parseInt(result[i].qty_jual)).toLocaleString('id-ID');

          // console.log('q: '+q.length+', satuan: '+satuan.length+', jumlah: '+jumlah.length);

          var tlen = 26 - (satuan.length + jumlah.length + q.length);

          for(var j = 0; j < tlen; j++){
            ws += ' ';
          }

          list += result[i].nama_barang+'<br>  '+ q +' x '+ satuan + ws + jumlah +' <br>';
        }

        list += '--------------------------------<br></p>';

        var q = header + subheader + list + sub + via + paid + kbl + '<br>' + thanks;
        q.replace(/' '/g, '\u00a0');
        // console.log(q);
        // connectToPrinter(q);
        $('#preview_rcpt').html(q);

      })
    }
  }
}];
