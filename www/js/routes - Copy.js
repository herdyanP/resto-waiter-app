var routes = [
{
  path: '/home/',
  componentUrl: './pages/home.html',
  on: {
    pageAfterIn: function(){
      pauseFlag = 0;
      AdMob.showInterstitial();
      tampilMenu();
      keranjang();

      if(cpyProf.jenis == 1){
        $('#block-grid').css('display', 'block');
      } else if(cpyProf.jenis == 2){
        $('#block-row').css('display', 'block');
      }

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
    pageInit: function(){
      console.log('closing');
      $.ajax({
        url: site+"/API/closing/"+cpyProf.id_user+"/",
        method: "GET",
        success: function(result){
          // let result = JSON.parse(json);
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
  `,
  on: {
    pageAfterIn: function(e, page){
      $.ajax({
        url: site+'/API/penjualan/'+page.route.params.idpj+'/',
        method: 'GET'
      }).done(function(json){
        let result = JSON.parse(json);        
        // let kembali = parseInt(paid) - parseInt(totalGrand);

        let tbl = `
          <table style="width: 100%">
            <tr>
              <td style="width: 40%"></td>
              <td style="width: 20%"></td>
              <td style="width: 40%"></td>
            </tr>
        `;

        let header = `
          <tr>
            <td colspan="3" style="text-align: center;">Sales Receipt</td>
          </tr>
        `;

        let dtloutlet = `
          <tr>
            <td colspan="3" style="text-align: center;">${cpyProf.outlet}</td>
          </tr>
          <tr>
            <td colspan="3" style="text-align: center; border-bottom: solid black 2px;">${cpyProf.alamat}</td>
          </tr>
        `;

        let notrans = `
          <tr>
            <td>No. Trans</td>
            <td colspan="2">: ${result[0].no_penjualan}</td>
          </tr>
        `;

        let dt = new Date();
        let dy = ('00'+dt.getDate()).slice(-2);
        let hr = ('00'+dt.getHours()).slice(-2);
        let mn = ('00'+dt.getMinutes()).slice(-2);
        let stamp = dy + ' ' + shortMonths[dt.getMonth()] + ' ' + dt.getFullYear() + ', ' + hr+':'+mn;
        let tgl = `
          <tr>
            <td>Tanggal</td>
            <td colspan="2">: ${stamp}</td>
          </tr>
        `;

        let op = `
          <tr>
            <td>Operator</td>
            <td colspan="2">: ${cpyProf.nama}</td>
          </tr>
          <tr><td colspan="3" style="border-top: solid black 2px;"></tr>
        `;

        let list = '';
        for(let i = 0; i < result.length; i++){
          let qty = parseInt(result[i].qty_jual).toLocaleString('id-ID');
          let hj = parseInt(result[i].harga_jual).toLocaleString('id-ID');
          let jml = (parseInt(result[i].harga_jual) * parseInt(result[i].qty_jual)).toLocaleString('id-ID');

          list += `
            <tr>
              <td colspan="3">${result[i].nama_barang}</td>
            </tr>
            <tr>
              <td style="padding-left: 20px;">${qty} x ${hj}</td>
              <td colspan="2" style="text-align: right;">${jml}</td>
            </tr>
          `;
        }

        list += `<tr><td colspan="3" style="border-bottom: solid black 2px;"></tr>`;

        let stot = `
          <tr>
            <td>Subtotal</td>
            <td>:</td>
            <td style="text-align: right;">${parseInt(result[0].total_jual).toLocaleString('id-ID')}</td>
          </tr>
        `;

        let dsc = `
          <tr>
            <td>Diskon</td>
            <td>:</td>
            <td style="text-align: right;">${parseInt(result[0].disc_rp).toLocaleString('id-ID')}</td>
          </tr>
        `;

        let grd = `
          <tr>
            <td>Grand Total</td>
            <td>:</td>
            <td style="text-align: right;">${parseInt(result[0].grantot_jual).toLocaleString('id-ID')}</td>
          </tr>
        `;

        let jn = '', bayar = '';
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
        /*let via = `
          <tr>
            <td>Via</td>
            <td>:</td>
            <td style="text-align: right;">${jn}</td>
          </tr>
        `;*/

        let paid = `
          <tr>
            <td>${jn}</td>
            <td>:</td>
            <td style="text-align: right;">${parseInt(bayar).toLocaleString('id-ID')}</td>
          </tr>
        `;

        let chn = `
          <tr>
            <td>Change</td>
            <td>:</td>
            <td style="text-align: right;">${parseInt(result[0].kembali_tunai).toLocaleString('id-ID')}</td>
          </tr>
          <tr><td>&nbsp;</td></tr>
        `;

        let thanks = `
            <tr>
              <td colspan="3" style="text-align: center;">Terima Kasih Atas Kunjungan Anda</td>
            </tr>
            <tr>
              <td colspan="3" style="text-align: center;">Powered by MediaPOS</td>
            </tr>
          </table>
        `;

        let q = tbl + header + dtloutlet + tgl + notrans + op + list + stot + dsc + grd + /*via +*/ paid + chn + thanks;
        $('#preview_rcpt').html(q);
      })
    }
  }
}];
