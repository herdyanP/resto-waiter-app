var routes = [
{
  path: '/',
  url: './index.html',
  on: {
    pageAfterIn: function(){
      console.log('screen locked');
      screen.orientation.lock('portrait');
      
      Dom7('#passlogin').on('taphold', function(){
        var el = this;
        cordova.plugins.clipboard.paste(function (text) { 
          el.value = text;
        });
      })
      $('#appversion').html("v"+appVer);
    },
    pageAfterOut: function(){
    }
  }
},
{
  path: '/home/',
  componentUrl: './pages/home.html',
  on: {
    pageAfterIn: function(){
      console.log('screen unlocked');
      screen.orientation.unlock();
      checkRotation();

      NativeStorage.getItem('modal', function(modal){
        dailyModal = modal;
      }, function(){
        $('#menu_penjualan').css('display', 'none');
        $('#modal_awal').css('display', '');

        app.request({
          url: site+'/API/opening/'+cpyProf.ID_CLIENT+'/'+cpyProf.ID,
          method: 'GET',
          success: function(result){
            var parsed = JSON.parse(result);
            if(parsed.ST_CODE == '1'){
              var data = parsed.DATA;
              app.toast.create({
                text: "Penjualan yang belum close ditemukan. Menggunakan data tersebut",
                closeTimeout: 3000,
                closeButton: false
              }).open();

              NativeStorage.setItem('modal', data.starting_cash);
              NativeStorage.setItem('stamp', data.openingcashdate);

              $('#menu_penjualan').css('display', '');
              $('#modal_awal').css('display', 'none');
            } else {
              console.log('Modal not found');
            }
          }
        })
      })

      $('#title_home').html('MediaPOS '+(cpyProf.jenis_outlet == 1 ? "F&amp;B" : "Retail"));
      
      tampilMenu();
      keranjang();

      if(layout == '1'){
        $('#block-grid').css('display', '');
        $('#block-row').css('display', 'none');
      } else if(layout == '2'){
        $('#block-row').css('display', '');
        $('#block-grid').css('display', 'none');
      }

      searchbar = app.searchbar.create({
        el: '.searchbar',
        customSearch: true,
        on: {
          search: function(searchbar, query, prevQuery){
            cariItem(query);
          },
          disable: function(){
            tampilMenu();
            keranjang();
          }
        }
      })

      // var ac = app.autocomplete.create({
      //   inputEl: '#idewallet',
      //   openIn: 'dropdown',
      //   preloader: true,
      //   limit: 10,
      //   source: function(query, render){
      //     var autoc = this;
      //     var results = [];
      //     var nohp = $('#idewallet').val();
      //     if(query.length === 0){
      //       render(results);
      //       return;
      //     }

      //     autoc.preloaderShow();
      //     app.request({
      //       url: site+"/API/cust/"+cpyProf.id_client+"/"+nohp+"/",
      //       method: "GET",
      //       success: function(json){
      //         var result = JSON.parse(json);
      //         for(var i = 0; i < result.length; i++){
      //           if(result[i].no_hp.indexOf(query) >= 0) results.push(result[i].no_hp);
      //         }

      //         autoc.preloaderHide();
      //         render(results);
      //       }
      //     });
      //   }
      // });

      if(screen.width < 400){
        $('#icon_home').css('font-size', '18px');
        $('#title_home').css('font-size', '14px');
        // $('#currentUser').css('font-size', '12px');
        // $('#currentUser').css('margin-right', '14px');
      }
    },
    pageAfterOut: function(){
      clearTimeout(refreshMenu);
    }
  }
},
{
  path: '/payment/',
  componentUrl: './pages/payment.html',
  on: {
    pageAfterIn: function(){
      console.log(v_subtotal);
    }
  }
},
{
  name: 'preview',
  path: '/preview/:idpj/',
  template: '\
    <div class="page">\
      <div class="navbar">\
        <div class="navbar-inner">\
          <div class="title"></div>\
          <div class="right">\
            <a href="#" class="link icon-only" onclick="cetakReceipt({{$route.params.idpj}});">\
              <i class="material-icons">print</i>\
            </a>\
            <a href="#" class="link icon-only" onclick="dialogShare({{$route.params.idpj}});">\
              <i class="material-icons">share</i>\
            </a>\
          </div>\
        </div>\
      </div>\
      <div class="toolbar toolbar-bottom-md no-shadow color-green">\
        <div class="toolbar-inner">\
          <button class="button" id="bayarButton" onclick="selesai()">Selesai</button>\
        </div>\
      </div>\
      \
      <div class="page-content">\
        <div class="block" id="preview_rcpt"></div>\
      </div>\
    </div>\
  ',
  on: {
    pageAfterIn: function(e, page){
      previewPenjualan(page.route.params.idpj);
    }
  }
},
{
  path: '/kaskeluar/',
  componentUrl: './pages/kaskeluar.html',
  on: {
    pageAfterIn: function(){
      var dt = new Date();
      var yr = dt.getFullYear();
      var mt = ('00'+(dt.getMonth() + 1)).slice(-2);
      var dy = ('00'+dt.getDate()).slice(-2);
      var hr = ('00'+dt.getHours()).slice(-2);
      var mn = ('00'+dt.getMinutes()).slice(-2);
      var sc = ('00'+dt.getSeconds()).slice(-2);

      var discrp = 0;
      var c_stamp = yr+'-'+mt+'-'+dy+' '+hr+':'+mn+':'+sc;
      var stamp_sv = $('#stamp_sv').val();

      var sales = {
        act: 'cl_all',
        tgl: stamp_sv
      }

      app.request({
        url: site+'/API/laporan/'+cpyProf.ID_CLIENT+'/'+cpyProf.ID,
        method: 'POST',
        data: JSON.stringify(sales),
        success: function(result){
          var parsed = JSON.parse(result);
          if(parsed.ST_CODE == '1'){
            var iter = parsed.DATA;
            var pj = parseInt(iter[0].penjualan);
            var km = parseInt(iter[0].kasmasuk);
            var kk = parseInt(iter[0].kaskeluar);
            var st = parseInt(iter[0].starting_cash);
            var available = st + pj + km - kk;

            $("#availcash").val(available);
            $("#wang_kaskeluar").val(available.toLocaleString(locale));
          } else {

          }
        }
      })
    }
  }
},
{
  path: '/kasmasuk/',
  componentUrl: './pages/kasmasuk.html',
  on: {
    pageAfterIn: function(){
      console.log('ini kas masuk');
    }
  }
},
{
  path: '/closing/',
  componentUrl: './pages/closing.html',
  on: {
    pageInit: function(){
      app.request({
        url: site+'/API/closing/'+cpyProf.ID_CLIENT+'/'+cpyProf.ID,
        method: 'GET',
        success: function(result){
          var parsed = JSON.parse(result);
          if(parsed.ST_CODE == '1'){
            var data = parsed.DATA;

            $('#id_closing').val(data.id_closing);
            $('#ul_closing_modal').html(parseInt(data.starting_cash).toLocaleString(locale));
            $('#cl_modal').val(parseInt(data.starting_cash));
            $('#stamp_sv').val(data.openingcashdate);

            closingSales();
          } else {
            console.log('Gagal mengambil closingan');
          }
        }
      })
    },
    pageAfterOut: function(){
      cl_items = [];
      cl_kaskeluar = [];
      $('#closing_button').css('display', 'none');
    }
  }
},
{
  name: 'cpreview',
  path: '/cpreview/:idc/',
  template: '\
    <div class="page">\
      <div class="navbar">\
        <div class="navbar-inner">\
          <div class="title"></div>\
          <div class="right">\
            <a href="#" class="link icon-only" onclick="cetakClosingID({{$route.params.idc}});">\
              <i class="material-icons">print</i>\
            </a>\
            <a href="#" class="link icon-only" onclick="dialogShare({{$route.params.idc}});">\
              <i class="material-icons">share</i>\
            </a>\
          </div>\
        </div>\
      </div>\
      <div class="toolbar toolbar-bottom-md no-shadow color-green">\
        <div class="toolbar-inner">\
          <button class="button" onclick="selesai()">Selesai</button>\
        </div>\
      </div>\
      \
      <div class="page-content">\
        <div class="block" id="preview_clos"></div>\
      </div>\
    </div>\
  ',
  on: {
    pageAfterIn: function(e, page){
      previewClosing(page.route.params.idc);
    }
  }
},
{
  path: '/print/',
  componentUrl: './pages/print.html',
  on: {
    pageAfterIn: function(){
      var temp = {
        act: "print"
      }

      app.request({
        url: site+'/API/laporan/'+cpyProf.ID_CLIENT+'/'+cpyProf.ID,
        method: 'POST',
        data: JSON.stringify(temp),
        success: function(result){
          var parsed = JSON.parse(result);
          if(parsed.ST_CODE == '1'){
            var datanya = '';
            var iter = parsed.DATA;

            for(var i = 0; i < iter.length; i++){
              datanya +=
                '<li class="item-content">\
                  <div class="item-inner">\
                    <div class="item-title">'+iter[i].no_penjualan+'\
                      <div class="item-footer">'+iter[i].stamp_date+'</div>\
                    </div>\
                    <div class="item-after">\
                      <a href="#" onclick="lihatPreview('+iter[i].id_pj+')"><i class="icon material-icons md-only">print</i></a>\
                    </div>\
                  </div>\
                </li>';
            }

            $('#list_print').html(datanya);
          } else {

          }
        }
      })
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
      // console.log('tahun: '+dt.getFullYear(), 'bulan: '+(dt.getMonth() + 1));
    }
  }
},
{
  path: '/penjualan/',
  componentUrl: './pages/penjualan.html',
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
},
{
  path: '/pengaturan/',
  componentUrl: './pages/pengaturan.html'
},{
  path: '/kasir/',
  componentUrl: './pages/kasir.html',
  on: {
    pageAfterIn: function(){
      tampilKasir();
      // console.log('tahun: '+dt.getFullYear(), 'bulan: '+(dt.getMonth() + 1));
    }
  }
}];

/* {
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
}, */
/* {
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
}, */
/* {
  path: '/satuan/',
  componentUrl: './pages/satuan.html',
  on: {
    pageAfterIn: function(){
      listSatuan();
    }
  }
}, */
/* {
  path: '/kategori/',
  componentUrl: './pages/kategori.html',
  on: {
    pageAfterIn: function(){
      listKategori();
    }
  }
}, */
/* {
  path: '/combo/',
  componentUrl: './pages/combo.html',
  on: {
    pageInit: function(){
      listSatuan();
    }
  }
}, */
/* {
  path: '/pricelist/',
  componentUrl: './pages/pricelist.html',
  on: {
    pageAfterIn: function(){
      listPricelist();
      app.request({
        url: site+'/API/cabang/cb/'+cpyProf.id_client+'/',
        method: 'GET',
        success: function(json){
          var isi = '<option value="0">-- Semua Cabang --</option>';
          var result = JSON.parse(json);
          for(var i = 0; i < result.length; i++){
            // isi += `<option value="${result[i].id_cabang}">${result[i].nama_cabang}</option>`;
            isi += '<option value="'+result[i].id_cabang+'">'+result[i].nama_cabang+'</option>';
          }

          $('#id_cabang').html(isi);
        }
      })
    }
  }
}, */
/* {
  name: 'dtlpricel',
  path: '/dtlpricel/:client/:barang',
  componentUrl: './pages/detail_pricelist.html',
  on: {
    pageAfterIn: function(e, page){
      var temp = {
        tipe: 'pricelist',
        id_client : page.route.params.client,
        id_barang : page.route.params.barang
      }

      app.request({
        url: site+'/API/history/',
        method: 'POST',
        data: JSON.stringify(temp),
        success: function(json){
          var result = JSON.parse(json);
          var cabang = [];

          for(var i = 0; i < result.length; i++){
            console.log(result[i]);
          }
        }
      })
    }
  }
}, */
