var routes = [
{
  path: '/home/',
  componentUrl: './pages/home.html',
  on: {
    pageAfterIn: function(){
      pauseFlag = 0;

      $('#title_home').html('MediaPOS '+(cpyProf.jenis_outlet == 1 ? "F&amp;B" : "Retail"));
      
      // AdMob.showInterstitial();
      tampilMenu();
      // keranjang();

      if(cpyProf.jenis_outlet == '1'){
        $('#block-grid').css('display', 'block');
      } else if(cpyProf.jenis_outlet == '2'){
        $('#block-row').css('display', 'block');
      }

      searchbar = app.searchbar.create({
        el: '.searchbar',
        customSearch: true,
        on: {
          search: function(searchbar, query, prevQuery){
            cariItem(query);
            console.log(query);
          },
          enable: function(){
            pauseFlag = 1;
          },
          disable: function(){
            pauseFlag = 0;

            tampilMenu();
            // keranjang();
          }
        }
      })

      // NativeStorage.getItem('modal', onModalFound, onModalNotFound);

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
      // clearTimeout(refreshKeranjang);
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

      // Dom7('#passlogin').on('taphold', function(){
      //   getClipboardContents(this);
      // })

      Dom7('#passlogin').on('taphold', function(){
        // getClipboardContents(this);
        var el = this;
        cordova.plugins.clipboard.paste(function (text) { 
          el.value = text;
          // alert(text); 
        });
      })
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
    pageInit: function(){
      console.log('closing');
      $.ajax({
        url: site+"/API/closing/"+cpyProf.id_user+"/",
        method: "GET",
        success: function(result){
          // var result = JSON.parse(json);
          $('#id_closing').val(result[0].id_closing);
          $('#ul_closing_modal').html(parseInt(result[0].starting_cash).toLocaleString('id-ID'));
          $('#cl_modal').val(parseInt(result[0].starting_cash));
          $('#stamp_sv').val(result[0].openingcashdate);

          NativeStorage.getItem('stamp', onGetStampDone, onGetStampFail);
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
},
{
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
},
{
  name: 'preview',
  path: '/preview/:idpj/',
  /*componentUrl: './pages/preview.html',*/
  /*template: `
    <div class="page">
      <div class="navbar">
        <div class="navbar-inner">
          <div class="title"></div>
          <div class="right">
            <a href="#" class="link icon-only" onclick="cetakReceipt({{$route.params.idpj}});">
              <i class="material-icons">print</i>
            </a>
            <a href="#" class="link icon-only" onclick="dialogShare({{$route.params.idpj}});">
              <i class="material-icons">share</i>
            </a>
          </div>
        </div>
      </div>
      <div class="toolbar toolbar-bottom-md no-shadow color-green">
        <div class="toolbar-inner">
          <button class="button" id="bayarButton" onclick="selesai()">Selesai</button>
        </div>
      </div>

      <div class="page-content">
        <div class="block" id="preview_rcpt"></div>
      </div>
    </div>
  `,*/
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
      $.ajax({
        url: site+'/API/penjualan/'+page.route.params.idpj+'/',
        method: 'GET'
      }).done(function(json){
        var result = JSON.parse(json);        
        // var kembali = parseInt(paid) - parseInt(totalGrand);

        // var tbl = `
        //   <table style="width: 100%">
        //     <tr>
        //       <td style="width: 40%"></td>
        //       <td style="width: 20%"></td>
        //       <td style="width: 40%"></td>
        //     </tr>
        // `;

        // var header = `
        //   <tr>
        //     <td colspan="3" style="text-align: center;">Sales Receipt</td>
        //   </tr>
        // `;

        // var dtloutlet = `
        //   <tr>
        //     <td colspan="3" style="text-align: center;">${cpyProf.outlet}</td>
        //   </tr>
        //   <tr>
        //     <td colspan="3" style="text-align: center; border-bottom: solid black 2px;">${cpyProf.alamat}</td>
        //   </tr>
        // `;

        // var notrans = `
        //   <tr>
        //     <td>No. Trans</td>
        //     <td colspan="2">: ${result[0].no_penjualan}</td>
        //   </tr>
        // `;

        // var dt = new Date();
        // var dy = ('00'+dt.getDate()).slice(-2);
        // var hr = ('00'+dt.getHours()).slice(-2);
        // var mn = ('00'+dt.getMinutes()).slice(-2);
        // var stamp = dy + ' ' + shortMonths[dt.getMonth()] + ' ' + dt.getFullYear() + ', ' + hr+':'+mn;
        // var tgl = `
        //   <tr>
        //     <td>Tanggal</td>
        //     <td colspan="2">: ${stamp}</td>
        //   </tr>
        // `;

        // var op = `
        //   <tr>
        //     <td>Operator</td>
        //     <td colspan="2">: ${cpyProf.nama}</td>
        //   </tr>
        //   <tr><td colspan="3" style="border-top: solid black 2px;"></tr>
        // `;

        // var list = '';
        // for(var i = 0; i < result.length; i++){
        //   var qty = parseInt(result[i].qty_jual).toLocaleString('id-ID');
        //   var hj = parseInt(result[i].harga_jual).toLocaleString('id-ID');
        //   var jml = (parseInt(result[i].harga_jual) * parseInt(result[i].qty_jual)).toLocaleString('id-ID');

        //   list += `
        //     <tr>
        //       <td colspan="3">${result[i].nama_barang}</td>
        //     </tr>
        //     <tr>
        //       <td style="padding-left: 20px;">${qty} x ${hj}</td>
        //       <td colspan="2" style="text-align: right;">${jml}</td>
        //     </tr>
        //   `;
        // }

        // list += `<tr><td colspan="3" style="border-bottom: solid black 2px;"></tr>`;

        // var stot = `
        //   <tr>
        //     <td>Subtotal</td>
        //     <td>:</td>
        //     <td style="text-align: right;">${parseInt(result[0].total_jual).toLocaleString('id-ID')}</td>
        //   </tr>
        // `;

        // var dsc = `
        //   <tr>
        //     <td>Diskon</td>
        //     <td>:</td>
        //     <td style="text-align: right;">${parseInt(result[0].disc_rp).toLocaleString('id-ID')}</td>
        //   </tr>
        // `;

        // var grd = `
        //   <tr>
        //     <td>Grand Total</td>
        //     <td>:</td>
        //     <td style="text-align: right;">${parseInt(result[0].grantot_jual).toLocaleString('id-ID')}</td>
        //   </tr>
        // `;

        // var jn = '', bayar = '';
        // switch($('#metode').val()){
        //   case '1':
        //     jn = 'Tunai';
        //     bayar = result[0].bayar_tunai;
        //     break;
        //   case '2':
        //     jn = 'Kartu Debit/Kredit';
        //     bayar = result[0].bayar_card;
        //     break;
        //   case '3':
        //     jn = ($('#platform').val() == 1 ? 'GO-PAY' : 'OVO');
        //     bayar = result[0].bayar_emoney;
        //     break;
        // }
        // /*var via = `
        //   <tr>
        //     <td>Via</td>
        //     <td>:</td>
        //     <td style="text-align: right;">${jn}</td>
        //   </tr>
        // `;*/

        // var paid = `
        //   <tr>
        //     <td>${jn}</td>
        //     <td>:</td>
        //     <td style="text-align: right;">${parseInt(bayar).toLocaleString('id-ID')}</td>
        //   </tr>
        // `;

        // var chn = `
        //   <tr>
        //     <td>Change</td>
        //     <td>:</td>
        //     <td style="text-align: right;">${parseInt(result[0].kembali_tunai).toLocaleString('id-ID')}</td>
        //   </tr>
        //   <tr><td>&nbsp;</td></tr>
        // `;

        // var thanks = `
        //     <tr>
        //       <td colspan="3" style="text-align: center;">Terima Kasih Atas Kunjungan Anda</td>
        //     </tr>
        //     <tr>
        //       <td colspan="3" style="text-align: center;">Powered by MediaPOS</td>
        //     </tr>
        //   </table>
        // `;

        var tbl = '\
                  <table style="width: 100%">\
                    <tr>\
                      <td style="width: 40%"></td>\
                      <td style="width: 20%"></td>\
                      <td style="width: 40%"></td>\
                    </tr>\
                ';

        var header = '\
                  <tr>\
                    <td colspan="3" style="text-align: center;">Sales Receipt</td>\
                  </tr>\
                ';

        var dtloutlet = '\
                  <tr>\
                    <td colspan="3" style="text-align: center;">'+cpyProf.outlet+'</td>\
                  </tr>\
                  <tr>\
                    <td colspan="3" style="text-align: center; border-bottom: solid black 2px;">'+cpyProf.alamat+'</td>\
                  </tr>\
                ';

        var notrans = '\
                  <tr>\
                    <td>No. Trans</td>\
                    <td colspan="2">: '+result[0].no_penjualan+'</td>\
                  </tr>\
                ';

        var dt = new Date();
        var dy = ('00'+dt.getDate()).slice(-2);
        var hr = ('00'+dt.getHours()).slice(-2);
        var mn = ('00'+dt.getMinutes()).slice(-2);
        var stamp = dy + ' ' + shortMonths[dt.getMonth()] + ' ' + dt.getFullYear() + ', ' + hr+':'+mn;
        var tgl = '\
                  <tr>\
                    <td>Tanggal</td>\
                    <td colspan="2">: '+stamp+'</td>\
                  </tr>\
                ';

        var op = '\
                  <tr>\
                    <td>Operator</td>\
                    <td colspan="2">: '+cpyProf.nama+'</td>\
                  </tr>\
                  <tr><td colspan="3" style="border-top: solid black 2px;"></tr>\
                ';

        var list = '';
        for(var i = 0; i < result.length; i++){
          var qty = parseInt(result[i].qty_jual).toLocaleString('id-ID');
          var hj = parseInt(result[i].harga_jual).toLocaleString('id-ID');
          var jml = (parseInt(result[i].harga_jual) * parseInt(result[i].qty_jual)).toLocaleString('id-ID');

          list += '\
                      <tr>\
                        <td colspan="3">\
                          '+result[i].nama_barang+'\
                          <br>Cttn: '+result[i].catatan+'\
                        </td>\
                      </tr>\
                      <tr>\
                        <td style="padding-left: 20px;">'+qty+' x '+hj+'</td>\
                        <td colspan="2" style="text-align: right;">'+jml+'</td>\
                      </tr>\
                    ';
        }

        list += '<tr><td colspan="3" style="border-bottom: solid black 2px;"></td></tr>';

        var stot = '\
                  <tr>\
                    <td>Subtotal</td>\
                    <td>:</td>\
                    <td style="text-align: right;">'+parseInt(result[0].total_jual).toLocaleString('id-ID')+'</td>\
                  </tr>\
                ';

        var dsc = '\
                  <tr>\
                    <td>Diskon</td>\
                    <td>:</td>\
                    <td style="text-align: right;">'+parseInt(result[0].disc_rp).toLocaleString('id-ID')+'</td>\
                  </tr>\
                ';

        var grd = '\
                  <tr>\
                    <td>Grand Total</td>\
                    <td>:</td>\
                    <td style="text-align: right;">'+parseInt(result[0].grantot_jual).toLocaleString('id-ID')+'</td>\
                  </tr>\
                ';

        var jn = '', bayar = '';
        switch($('#metode').val()){
          case '1':
            jn = 'Tunai';
            bayar = result[0].bayar_tunai;
            break;
          case '2':
            jn = 'Kartu Debit/Kredit';
            bayar = result[0].bayar_card;
            break;
          case '3':
            jn = ($('#platform').val() == 1 ? 'GO-PAY' : 'OVO');
            bayar = result[0].bayar_emoney;
            break;
        }
        /*var via = `
          <tr>
            <td>Via</td>
            <td>:</td>
            <td style="text-align: right;">${jn}</td>
          </tr>
        `;*/

        var paid = '\
                  <tr>\
                    <td>'+jn+'</td>\
                    <td>:</td>\
                    <td style="text-align: right;">'+parseInt(bayar).toLocaleString('id-ID')+'</td>\
                  </tr>\
                ';

        var chn = '\
                  <tr>\
                    <td>Change</td>\
                    <td>:</td>\
                    <td style="text-align: right;">'+parseInt(result[0].kembali_tunai).toLocaleString('id-ID')+'</td>\
                  </tr>\
                  <tr><td>&nbsp;</td></tr>\
                ';

        var thanks = '\
                    <tr>\
                      <td colspan="3" style="text-align: center;">Terima Kasih Atas Kunjungan Anda</td>\
                    </tr>\
                    <tr>\
                      <td colspan="3" style="text-align: center;">Powered by MediaPOS</td>\
                    </tr>\
                  </table>\
                ';

        var q = tbl + header + dtloutlet + tgl + notrans + op + list + stot + dsc + grd + /*via +*/ paid + chn + thanks;
        $('#preview_rcpt').html(q);
      })
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

      $.ajax({
        url: site+'/API/laporan/' +cpyProf.id_user+ '/',
        method: 'POST',
        data: JSON.stringify(sales),
        success: function(result){
          var pj = parseInt(result[0].penjualan);
          var km = parseInt(result[0].kasmasuk);
          var kk = parseInt(result[0].kaskeluar);
          var st = parseInt(result[0].starting_cash);
          var available = st + pj + km - kk;

          console.log(st, pj, km, kk);
          $("#availcash").val(available);
          $("#wang_kaskeluar").val(available.toLocaleString('id-id'));

        }
      })
      console.log('ini kas keluar');
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
}];
