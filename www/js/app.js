// Dom7
// sudo cordova build android --release -- --keystore=lightpos.keystore --storePassword=bismillah --alias=lightpos --password=bismillah
// C:\Program Files\Java\jre1.8.0_221\bin>keytool -genkey -v -keystore sisco.keystore -alias sisco -keyalg RSA -keysize 2048 -validity 10000

// Init App
var app = new Framework7({
  id: 'com.medianusamandiri.mediapos',
  root: '#app',
  init: false,
  // theme: theme,
  routes: routes,
  touch: {
    // Disable fast clicks
    fastClicks: true,
    tapHold: true //enable tap hold events
  }
});


// JS SCRIPT SEMENTARA DISINI DULU YAKKK...
// NYOBA TEMPLATING

var db;
var shortMonths = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
var mtd = 1;
var txNmr = 0;
var retail, cabang, lastId, user, platform, jn, uid, updates;
// var adid = {};
var cpyProf;
var diskonAmt = 0; totalSub = 0; totalGrand = 0; kembalian = 0;
var pingTimeout = 0;
var appVer = 0;

// var site = 'http://mediapos.cloudmnm.com';
var site = 'http://dev.cloudmnm.com/mediapos';

var trueHeight = window.innerHeight
var moddedHeight = Math.floor(trueHeight / 100) * 100;
var dailyModal = 0;
var refreshMenu, refreshKeranjang, refreshSession;
var logoByte64 = '';

var existing = 0;

var pauseFlag = 0;
var cl_tu, cl_cc, cl_em
var cl_km = 0, cl_kk = 0;
var cl_items = [];
var cl_kaskeluar = [];
var cl_kasmasuk = [];
var searchbar;

Highcharts.setOptions({
  lang: {
    months: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"],
    shortMonths: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"],
    weekdays: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]
  }
})

document.addEventListener('deviceready', function() {
  app.init();

  Dom7('#passlogin').on('taphold', function(){
    // getClipboardContents(this);
    var el = this;
    cordova.plugins.clipboard.paste(function (text) { 
      el.value = text;
      // alert(text); 
    });
  })

  // adid = {
  //   // banner: 'ca-app-pub-3940256099942544/6300978111', /*test ID*/
  //   // banner: 'ca-app-pub-8300135360648716/8651556341',  /*real ID*/
  //   banner: 'ca-app-pub-8300135360648716/5241305930', /*ID medusa*/
  //   // interstitial: 'ca-app-pub-3940256099942544/1033173712' /*test ID*/
  //   interstitial: 'ca-app-pub-8300135360648716/4160878738' /*ID medusa*/
  // }

  // if(AdMob) {
  //   AdMob.createBanner({
  //     adId: adid.banner,
  //     position: AdMob.AD_POSITION.BOTTOM_CENTER,
  //     autoShow: true
  //   }, function(){
  //     console.log('AdMob init success!');
  //   }, function(){
  //     console.log('AdMob init failed!');
  //   });

  //   AdMob.prepareInterstitial({
  //     adId: adid.interstitial,
  //     autoShow: false
  //   }, function(){
  //     console.log('interstitial ready');
  //   }, function(){
  //     console.log('interstitial not ready');
  //   });

  //   AdMob.showInterstitial();
  // }

  // if(AdMob) AdMob.prepareInterstitial( {adId: adid.interstitial, autoShow: false} );

  screen.orientation.lock('portrait');

  var d = new Date();
  var tgls=d.getFullYear()+"-"+("0" + (d.getMonth()+1)).slice(-2)+"-"+("0" + d.getDate()).slice(-2);
  var stime = window.localStorage.getItem("tgl");

  if(stime=="" || stime==null){
    window.localStorage.setItem("tgl",tgls);
    window.localStorage.setItem("inctrx",1);
  }
  if(stime!=tgls){
    window.localStorage.setItem("tgl",tgls);
    window.localStorage.setItem("inctrx",1);
  }



  cekStored();
  document.addEventListener("backbutton", onBackPressed, false);
  // document.addEventListener("online", onOnline, false);

  cordova.getAppVersion.getVersionNumber(function (version) {
    appVer = version;
    $('#appversion').html("v"+version);
    // alert(version);
  });
});

// async function getClipboardContents(el) {
//   try {
//     const text = await navigator.clipboard.readText();
//     el.value = text;
//     // console.log('Pasted content: ', text);
//   } catch (err) {
//     console.error('Failed to read clipboard contents: ', err);
//   }
// }

function initDB(){
  /*db.transaction(function(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS m_barang ( id_urut INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, id_barang INT NOT NULL UNIQUE, nama_barang VARCHAR(200) NOT NULL, harga_jual DOUBLE, kategori INT, st INT )');
    tx.executeSql('CREATE TABLE IF NOT EXISTS m_combo ( id_combo INTEGER NOT NULL PRIMARY KEY, nama_combo VARCHAR(20), harga_jual INT )');
    tx.executeSql('CREATE TABLE IF NOT EXISTS combo_dtl (id_dtl INTEGER PRIMARY KEY AUTOINCREMENT, id_combo INTEGER, id_barang INTEGER)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS pj (id_pj INTEGER PRIMARY KEY AUTOINCREMENT, no_penjualan VARCHAR(30), no_faktur VARCHAR(30), tgl_penjualan DATE, jenis_jual int, jenis_bayar int, id_customer int, id_user  int, stamp_date datetime, disc_prs double, disc_rp double, sc_prs double, sc_rp double, ppn double, total_jual double, grantot_jual double, bayar_tunai double, bayar_card double, nomor_kartu varchar, ref_kartu varchar, kembali_tunai double, void_jual varchar, no_meja int, ip varchar, id_gudang int, pl_retail text, meja int, st int)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS pj_dtl (id_dtl_jual int, id_pj int, id_barang int, qty_jual double, harga_jual double, discprs double, discrp double, dtl_total double, harga_jual_cetak double, user int, dtpesan datetime, tipe_jual INT)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS pj_dtl_tmp (id_tmp INTEGER PRIMARY KEY AUTOINCREMENT, id_barang INT, qty INT, total DOUBLE, harga DOUBLE, nama_barang VARCHAR(20), id_combo INT, nama_combo VARCHAR(20), tipe INT)');
  }, function(e){
    // console.log(e);
  }, function(msg){
    // console.log(msg);
  });*/
}

function clearDB(){
}

// function onOnline(){
//   console.log('back online');
//   tampilMenu();
//   keranjang();
// }

function afterOnline(a){
}

// ========== PROSES STARTING UP STARTS HERE ==========

function onConstruction(){
  app.toast.create({
    text: "Feature under construction...",
    closeTimeout: 3000,
    closeButton: true
  }).open();
}



function onRetSuccess(obj){
  $.ajax({
    url: site+'/API/login/',
    method: 'POST',
    data: JSON.stringify({'user':obj.user, 'pass':obj.pass, 'device':device.uuid})
  }).done(function(result){
    console.log(result);
    if(result != '0'){
      cpyProf = obj;
      // cpyProf.client = result[0].nama_client;
      cpyProf.outlet = result[0].nama_outlet;
      cpyProf.cabang = result[0].nama_cabang;
      cpyProf.alamat = result[0].alamat;
      cpyProf.jenis = result[0].jenis_outlet;
      console.log('succ');
      $('#panel_subTitle').html('<br><strong>MediaPOS '+(cpyProf.jenis == 1 ? "F&amp;B" : "Retail")+'</strong><br>POS Application<br>'+cpyProf.outlet);
      pauseFlag = 1;

      /* var image = new Image();
      image.onload = function() {
          var canvas = document.createElement('canvas');
          canvas.height = 60;
          canvas.width = 360;
          var context = canvas.getContext('2d');
          context.drawImage(image, 0, 0);
          logoByte64 = canvas.toDataURL().replace(/^data:image\/(png|jpg|jpeg|bmp);base64,/, ""); //remove mimetype
      };
      image.src = './img/logo_nama_bank_jogja.png'; */

      // logoByte64 = result[0].image;
      initGambar(result[0].image);

      app.views.main.router.navigate('/home/');
      NativeStorage.getItem('modal', onModalFound, onModalNotFound);

      // if(cpyProf.jenis == 1){
      //   $('#block-grid').css('display', 'block');
      // } else if(cpyProf.jenis == 2){
      //   $('#block-row').css('display', 'block');
      // }


      // if(updates != '0'){
      //   checkUpdates();
      //   checkUpdates2();
      // }

      // $('#bayarButton').removeAttr('disabled').removeClass('disabled');

      // $('#loginRow').css('display', 'none');
      // $('#logoutRow').css('display', 'block');

      // $('#currentUser').html('Operator: '+ (obj.nama ? obj.nama : obj.client));

      /*if(screen.width < 400){
        $('#icon_home').css('font-size', '18px');
        $('#title_home').css('font-size', '14px');
        $('#currentUser').css('font-size', '12px');
        $('#currentUser').css('margin-right', '14px');
      }*/

      // setTimeout(function(){
        // tampilMenu();
        // keranjang();
      //   // sendPing();
      //   // tampilFood();
      //   // tampilBvrg();
      //   // tampilCombo();
      //   // keranjang();
      // }, 3000)
    } else {
      // alert('gagal');
      onLogout();
    }
  })
}

function onRetFail(){
  console.log('fail');
}

function onBackPressed(){
  var mainView = app.views.main;
  if(modalModal.opened == true) {
    modalModal.close();
    onLogout();
  } else if($('.link.back').length > 0){
    mainView.router.back();
  } else{
    app.dialog.confirm('Keluar aplikasi?', 'Konfirmasi', function(){
      navigator.app.exitApp();
    }, function(){
      return;
    })
  }
}

function onSetModalSuccess(){
  var dt = new Date();
  var yr = dt.getFullYear();
  var mt = ('00'+(dt.getMonth() + 1)).slice(-2);
  var dy = ('00'+dt.getDate()).slice(-2);
  var hr = ('00'+dt.getHours()).slice(-2);
  var mn = ('00'+dt.getMinutes()).slice(-2);
  var sc = ('00'+dt.getSeconds()).slice(-2);

  // var timestamp_dtl = `${yr}-${mt}-${dy} ${hr}:${mn}:${sc}`;
  // var timestamp = `${yr}-${mt}-${dy}`;
  var timestamp_dtl = yr+'-'+mt+'-'+dy+' '+hr+':'+mn+':'+sc;
  var timestamp = yr+'-'+mt+'-'+dy;
  var temp = {
    id_client : cpyProf.id_client,
    id_outlet : cpyProf.id_outlet,
    id_user : cpyProf.id_user,
    st_cash : dailyModal,
    tgl : timestamp_dtl
  };

  console.log('existing b', existing);
  if(existing == 0){
    app.request({
      url: site+"/API/opening/",
      method: "POST",
      data: JSON.stringify(temp),
      success: function(json){
        console.log('uploaded starting cash');
      }
    });
  } else {
    app.toast.create({
      text: "Penjualan yang belum close ditemukan. Menggunakan data tersebut.",
      closeTimeout: 3000,
      closeButton: false
    }).open();
    console.log('unclosed existing');
  }

  $('#menu_penjualan').css('display', 'block');
  $('#modal_awal').css('display', 'none');

  NativeStorage.setItem('stamp', timestamp, onSetStampDone, onSetStampFail);
  console.log('set modal done');
}

function onSetModalFailed(){
  console.log('set modal fail');
}

function onModalFound(modal){
  dailyModal = modal;
}

function onModalNotFound(error){
  // modalModal.open();
  // $('#menu_penjualan').css('display', 'none');
  // $('#modal_awal').css('display', 'block');

  // $.ajax({
  //   url: site+"/API/closing/"+cpyProf.id_user+"/",
  //   method: "GET",
  //   success: function(json){
  //     console.log(json);
  //     if(json[0].closed == 0 && json[0].starting_cash > 0){
  //       existing = 1;
  //       console.log('existing', existing);
  //       // $('#modal').val(json[0].starting_cash);
  //       simpanModal(json[0].starting_cash);
  //     }
  //     // console.log('uploaded starting cash');
  //   }
  // });
}

function onRemModalSuccess(){
  console.log("remove modal success");
}

function onRemModalFailed(){
  console.log("remove modal failed");
}

function onSetStampDone(){
  console.log('set timestamp success');
}

function onSetStampFail(){
  console.log('set timestamp failed');
}

function onGetStampDone(stamp){
  console.log('get timestamp success');
  // laporanClosing(stamp);
}

function onGetStampFail(){
  console.log('get timestamp failed')
}

// ========== PROSES STARTING UP ENDS HERE ==========

// ========== PROSES MASTER STARTS HERE ==========

function addBarang(q){
  var temp = {'act': '1'};
  $.each($(q).serializeArray(), function(){
    temp[this.name] = this.value;
  })

  $.ajax({
    url: site+'/API/barang/'+cpyProf.id_client+'/',
    method: 'POST',
    data: JSON.stringify(temp),
    statusCode: {
      201: function(data, text, xhr){
        app.toast.create({
          text: "Sukses Tambah Barang",
          closeTimeout: 3000,
          closeButton: true
        }).open();

        $(q).trigger('reset');
        listBarang();
        // cekStatus();
      },
      200: function(){
        app.toast.create({
          text: "Kode Barang sudah terpakai!",
          closeTimeout: 3000,
          closeButton: true
        }).open();
      }
    }
  })
}

function listBarang(){
  var data = '<ul>';
  $.ajax({
    url: site+'/API/pricelist/'+cpyProf.id_client+'/',
    method: 'GET',
  }).done(function(result){
      // var tempArr = [];
      // var temp = {};
      // var result = JSON.parse(json);
      for(var i = 0; i < result.length; i++){
        if(result[i].id_barang == null || result[i].nama_barang == null) continue;
        var hrg = result[i].harga.split('-')[0];

        // data += `
        //   <li class="item-content ">
        //     <div class="item-inner">
        //       <div class="item-title">`+result[i].nama_barang+`</div>
        //       <div class="item-after">
        //         <a href="#" style="margin: 2px;" onclick="showEditBarang(`+result[i].id_barang+`,`+result[i].tipe+`,'`+result[i].kode_barang+`','`+result[i].nama_barang+`','`+hrg+`',`+result[i].id_satuan+`,`+result[i].status+`);"><i class="icon material-icons md-only">edit</i></a>
        //         <a href="#" style="margin: 2px;" onclick="hapusBarang(`+result[i].id_barang+`,'`+result[i].nama_barang+`')"><i class="icon material-icons md-only">close</i></a>
        //       </div>
        //     </div>
        //   </li>`;
        data += '\
                  <li class="item-content ">\
                    <div class="item-inner">\
                      <div class="item-title">'+result[i].nama_barang+'</div>\
                      <div class="item-after">\
                        <a href="#" style="margin: 2px;" onclick="showEditBarang('+result[i].id_barang+','+result[i].tipe+',\''+result[i].kode_barang+'\',\''+result[i].nama_barang+'\',\''+hrg+'\','+result[i].id_satuan+','+result[i].status+');"><i class="icon material-icons md-only">edit</i></a>\
                        <a href="#" style="margin: 2px;" onclick="hapusBarang('+result[i].id_barang+',\''+result[i].nama_barang+'\')"><i class="icon material-icons md-only">close</i></a>\
                      </div>\
                    </div>\
                  </li>';
      }

      data += '</ul>';
      $('#barang_list').html(data);
  })
}

function editBarang(q){
  var id = $('#id_barang').val();
  var temp = {
    'act' : '2',
    'id_client' : cpyProf.id_client
  };

  $.each($(q).serializeArray(), function(){
    temp[this.name] = this.value;
  })

  $.ajax({
    url: site+'/API/barang/'+id+'/',
    method: 'POST',
    data: JSON.stringify(temp)
  }).done(function(){
    app.toast.create({
      text: "Sukses Edit Barang",
      closeTimeout: 3000,
      closeButton: true
    }).open();

    // $(q).trigger('reset');
    hideEditBarang(q);
    listBarang();
  })
}

function showEditBarang(id, tipe, kode, nama, harga, satuan, status){
  document.getElementById('scrollable').scrollTop = 0;
  $('#button_addItem').css('display', 'none');
  $('#buttons_editRemove').css('display', 'flex');
  $('#_status').css('display', 'block');

  $('#id_barang').val(id);
  $('#tipe_barang').val(tipe);
  $('#kode_barang').val(kode);
  $('#nama_barang').val(nama);
  $('#harga_addItem').val(harga.split('-')[0]);
  $('#satuan_select').val(satuan);
  $('#status_sel').val(status);
}

function hideEditBarang(q){
  $('#button_addItem').css('display', 'block');
  $('#buttons_editRemove').css('display', 'none');
  $('#_status').css('display', 'none');

  $(q).trigger('reset');
}

function hapusBarang(id, nama){
  var temp = {'act': '3'};

  app.dialog.confirm('Yakin Hapus '+nama+'?', 'Konfirmasi', function(){
    $.ajax({
      url: site+'/API/barang/'+id+'/',
      method: 'POST',
      data: JSON.stringify(temp)
    }).done(function(){
      app.toast.create({
        text: "Sukses Hapus dari Menu",
        closeTimeout: 3000,
        closeButton: true
      }).open();

      listBarang();
    })
  }, function(){
    return;
  })
}

function addSatuan(q){
  var temp = {
    act: 1
  };

  $.each($(q).serializeArray(), function(){
    temp[this.name] = this.value;
  })

  $.ajax({
    url: site+'/API/satuan/'+cpyProf.id_client+'/',
    method: 'POST',
    data: JSON.stringify(temp),
    statusCode: {
      200: function(){
        app.toast.create({
          text: "Satuan sudah terpakai!",
          closeTimeout: 3000,
          closeButton: true
        }).open();
      },
      201: function(){
        app.toast.create({
          text: "Sukses Tambah Satuan",
          closeTimeout: 3000,
          closeButton: true
        }).open();

        $(q).trigger('reset');
        listSatuan();
      }
    }
  });
}

function listSatuan(){
  var data = '<ul>';
  /*$.ajax({
    url: site+'/API/satuan/'+cpyProf.id_client+'/',
    method: 'GET',
  }).done(function(result){
    for(var i = 0; i < result.length; i++){
      if(result[i].id_satuan == null || result[i].nama_satuan == null) continue;

      data += `
        <li class="item-content ">
          <div class="item-inner">
            <div class="item-title">`+result[i].nama_satuan+`</div>
            <div class="item-after">
              <a href="#" style="margin: 2px;" onclick="showEditSatuan(`+result[i].id_satuan+`,'`+result[i].nama_satuan+`');"><i class="icon material-icons md-only">edit</i></a>
              <a href="#" style="margin: 2px;" onclick="hapusSatuan(`+result[i].id_satuan+`,'`+result[i].nama_satuan+`')"><i class="icon material-icons md-only">close</i></a>
              </div>
          </div>
        </li>`;
    }

    data += '</ul>';
    $('#satuan_list').html(data);
  })*/
}

function showEditSatuan(id, nama){
  document.getElementById('scrollable').scrollTop = 0;
  $('#button_addSatuan').css('display', 'none');
  $('#buttons_editSatuan').css('display', 'flex');

  $('#id_satuan').val(id);
  $('#nama_satuan').val(nama);
}

function hideEditSatuan(q){
  $('#button_addSatuan').css('display', 'block');
  $('#buttons_editSatuan').css('display', 'none');

  $(q).trigger('reset');
}

function editSatuan(q){
  var id = $('#id_satuan').val();
  var temp = {
    'act' : '2',
    'id_client' : cpyProf.id_client
  };

  $.each($(q).serializeArray(), function(){
    temp[this.name] = this.value;
  })

  $.ajax({
    url: site+'/API/satuan/'+id+'/',
    method: 'POST',
    data: JSON.stringify(temp)
  }).done(function(){
    app.toast.create({
      text: "Sukses Edit Satuan",
      closeTimeout: 3000,
      closeButton: true
    }).open();

    // $(q).trigger('reset');

    hideEditSatuan(q);
    listSatuan();
  })
}

function hapusSatuan(id, nama){
  var temp = {'act': '3'};

  app.dialog.confirm('Yakin Hapus '+nama+'?', 'Konfirmasi', function(){
      $.ajax({
        url: site+'/API/satuan/'+id+'/',
        method: 'POST',
        data: JSON.stringify(temp)
      }).done(function(){
        app.toast.create({
          text: "Sukses Hapus Satuan",
          closeTimeout: 3000,
          closeButton: true
        }).open();

        listSatuan();
      })
    }, function(){
      return;
    })
}

function addKategori(q){
  var temp = {
    act: 1
  };

  $.each($(q).serializeArray(), function(){
    temp[this.name] = this.value;
  })

  $.ajax({
    url: site+'/API/kategori/'+cpyProf.id_client+'/',
    method: 'POST',
    data: JSON.stringify(temp)
  }).done(function(){
    app.toast.create({
      text: "Sukses Tambah Kategori",
      closeTimeout: 3000,
      closeButton: true
    }).open();

    $(q).trigger('reset');
    listKategori();
  })
}

function listKategori(){
  var data = '<ul>';
  /*$.ajax({
    url: site+'/API/kategori/'+cpyProf.id_client+'/',
    method: 'GET',
  }).done(function(result){
    for(var i = 0; i < result.length; i++){
      if(result[i].id_kategori == null || result[i].nama_kategori == null) continue;

      data += `
        <li class="item-content ">
          <div class="item-inner">
            <div class="item-title">`+result[i].nama_kategori+`</div>
            <div class="item-after">
              <a href="#" style="margin: 2px;" onclick="showEditKategori(`+result[i].id_kategori+`,'`+result[i].nama_kategori+`');"><i class="icon material-icons md-only">edit</i></a>
              <a href="#" style="margin: 2px;" onclick="hapuskategori(`+result[i].id_kategori+`,'`+result[i].nama_kategori+`')"><i class="icon material-icons md-only">close</i></a>
            </div>
          </div>
        </li>`;
    }

    data += '</ul>';
    $('#kategori_list').html(data);
  })*/
}

function showEditKategori(id, nama){
  document.getElementById('scrollable').scrollTop = 0;
  $('#button_addKategori').css('display', 'none');
  $('#buttons_editKategori').css('display', 'flex');

  $('#id_kategori').val(id);
  $('#nama_kategori').val(nama);
}

function hideEditKategori(q){
  $('#button_addKategori').css('display', 'block');
  $('#buttons_editKategori').css('display', 'none');

  $(q).trigger('reset');
}

function editKategori(q){
  var id = $('#id_kategori').val();
  var temp = {
    'act' : '2',
    'id_client' : cpyProf.id_client
  };

  $.each($(q).serializeArray(), function(){
    temp[this.name] = this.value;
  })

  $.ajax({
    url: site+'/API/kategori/'+id+'/',
    method: 'POST',
    data: JSON.stringify(temp)
  }).done(function(){
    app.toast.create({
      text: "Sukses Edit Kategori",
      closeTimeout: 3000,
      closeButton: true
    }).open();

    // $(q).trigger('reset');

    hideEditKategori(q);
    listKategori();
  })
}

function hapusKategori(id, nama){
  var temp = {'act': '3'};

  app.dialog.confirm('Yakin Hapus '+nama+'?', 'Konfirmasi', function(){
      $.ajax({
        url: site+'/API/kategori/'+id+'/',
        method: 'POST',
        data: JSON.stringify(temp)
      }).done(function(){
        app.toast.create({
          text: "Sukses Hapus Kategori",
          closeTimeout: 3000,
          closeButton: true
        }).open();

        listKategori();
      })
    }, function(){
      return;
    })
}

function editPricelist(q){
  var id = $('#id_barang').val();
  var dt = new Date();
  // var tglnow = `${dt.getFullYear()}-${dt.getMonth()+1}-${dt.getDate()}`;

  var temp = {
    'id_barang' : id,
    'id_client' : cpyProf.id_client,
    'id_gudang' : cpyProf.id_outlet,
    'tgl' : tglnow
  };

  $.each($(q).serializeArray(), function(){
    temp[this.name] = this.value;
  })

  $.ajax({
    url: site+'/API/pricelist/',
    method: 'POST',
    data: JSON.stringify(temp)
  }).done(function(){
    app.toast.create({
      text: "Sukses Edit Pricelist",
      closeTimeout: 3000,
      closeButton: true
    }).open();

    hideEditPricelist(q);
    listPricelist();
  })
}

function listPricelist(){
  var data = '<ul>';
  $.ajax({
    url: site+'/API/pricelist/'+cpyProf.id_client+'/',
    method: 'GET',
  }).done(function(result){
      // var tempArr = [];
      // var temp = {};
      // var result = JSON.parse(json);
      for(var i = 0; i < result.length; i++){
        if(result[i].id_barang == null || result[i].nama_barang == null) continue;
        var hrg = result[i].harga.split('-')[0];

        // <a href="#" style="margin: 3px;" onclick="app.views.main.router.navigate({name: 'dtlpricel', params: {client: ${cpyProf.id_client}, barang: ${result[i].id_barang}}})"><i class="icon material-icons md-only">search</i></a>

        // data += `
        //   <li class="item-content ">
        //     <div class="item-inner">
        //       <div class="item-title">${result[i].nama_barang} (${parseInt(result[i].harga.split('-')[0]).toLocaleString('id-ID')})</div>
        //       <div class="item-after">
                
        //         <a href="#" style="margin: 3px;" onclick="showEditPricelist(`+result[i].id_barang+`,`+result[i].tipe+`,'`+result[i].kode_barang+`','`+result[i].nama_barang+`','`+hrg+`',`+result[i].id_satuan+`,`+result[i].status+`);"><i class="icon material-icons md-only">edit</i></a>
        //       </div>
        //     </div>
        //   </li>`;
      }

      data += '</ul>';
      $('#barang_list').html(data);
  })
}

function showEditPricelist(id, tipe, kode, nama, harga, satuan, status){
  document.getElementById('scrollable').scrollTop = 0;
  // $('#button_addItem').css('display', 'none');
  $('#buttons_editRemove').css('display', 'flex');
  $('#_status').css('display', 'block');

  $('#id_barang').val(id);
  // $('#tipe_barang').val(tipe);
  // $('#kode_barang').val(kode);
  // $('#nama_barang').val(nama);
  $('#harga_addItem').val(harga.split('-')[0]);
  $('#id_satuan').val(satuan);
  // $('#status_sel').val(status);
}

function hideEditPricelist(q){
  // $('#button_addItem').css('display', 'block');
  $('#buttons_editRemove').css('display', 'none');
  $('#_status').css('display', 'none');

  $(q).trigger('reset');
}

// ========== PROSES MASTER ENDS HERE ==========


// ========== PROSES UTILITY STARTS HERE ==========

function listOutlet(id){
  app.request({
    url: site+'/API/cabang/ol/'+cpyProf.id_client+'/',
    method: 'GET',
    success: function(json){
      var isi = '<option value="0">-- Semua outlet --</option>';
      var result = JSON.parse(json);

      for(var i = 0; i < result.length; i++){
        // isi += `<option value="${result[i].id_gudang}">${result[i].nama_gudang}</option>`
      }

      $('#id_gudang').html(isi);
    }
  })
}

function dialogCetak(id){
  app.dialog.create({
    title: 'Confirmation',
    text: 'Print receipt?',
    buttons: [{
      text: 'No',
      close: true
    }, {
      text: 'Yes',
      onClick: function(){cetakReceipt(id);}
    }, {
      text: 'WhatsApp',
      onClick: function(){cetakWhatsApp(id);}
    }]
  }).open();
}

function connectToPrinter(q, el){
  $(el).addClass('disabled');

  BTPrinter.list(function(data){
      BTPrinter.connect(function(){
          BTPrinter.printBase64(function(){
              setTimeout(function(){
                BTPrinter.disconnect(function(){
  

                    window.DatecsPrinter.connect(data[1], function(){
                        window.DatecsPrinter.printText(q, 'ISO-8859-1', function(){
                          window.DatecsPrinter.disconnect(function(){
                            $(el).removeClass('disabled');
                          }, function(error){
                            alert('Datecs disconnect: ' +JSON.stringify(error));  
                          });
                          // BTPrinter.disconnect();
                        }, function(error){
                          alert('Datecs PrintText: ' +JSON.stringify(error));
                          window.DatecsPrinter.disconnect(function(){
                            $(el).removeClass('disabled');
                          }, function(error){
                            alert('Datecs disconnect: ' +JSON.stringify(error));  
                          });
                          // BTPrinter.disconnect();
                        })
                    }, function(error){
                      alert('Datecs connect: ' +JSON.stringify(error));
                    })


                }, function(error){alert('BTPrinter disconnect: ' +error)})
              }, 1000);
          }, function(error){alert(error)}, logoByte64, '0')
      }, function(error){alert(error)}, data[0])
  }, function(error){alert(error)})
}

function cetakWhatsApp(id){
  console.log("whatsApp", id);
  $.ajax({
    url: site+'/API/penjualan/'+id+'/',
    method: 'GET'
  }).done(function(json){
    var result = JSON.parse(json);
    app.dialog.create({
      title: 'Konfirmasi',
      text: 'Masukkan nomor WhatsApp tujuan:',
      closeByBackdropClick: false,
      on: {
        opened: function(){
          var ac = app.autocomplete.create({
            inputEl: '#no_hp',
            openIn: 'dropdown',
            preloader: true,
            limit: 10,
            source: function(query, render){
              var autoc = this;
              var results = [];
              var nohp = $('#no_hp').val();
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
        }
      },
      /*content: 
        `<div class="block" style="height: 30vh;">
          <div class="list no-hairlines no-hairlines-between">
            <ul>
              <li class="item-content item-input">
                <div class="item-inner">
                  <div class="item-input-wrap">
                    <input type="number" name="no_hp" id="no_hp" style="text-align: center;"/>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>`,*/
      buttons: [
      {
        text: 'Send',
        onClick: function(dialog, e){
          var nohp = $('#no_hp').val();
          var temp = {
            nohp: nohp,
            id_client: cpyProf.id_client
          }

          app.request({
            url: site+"/API/cust/",
            method: "POST",
            data: JSON.stringify(temp),
            statusCode: {
              200: function(){
                console.log('returned OK');
              },
              201: function(){
                console.log('created OK');
              }
            }
          })

          var dt = new Date();
          var tot = $('#subtotal').html();
          var totInt = tot.replace(/\D/g, '');
          var kembali = parseInt(paid) - parseInt(totInt);
          var jn = '';
          switch($('#metode').val()){
            case '1':
              jn = "Tunai";
              via = result[0].bayar_tunai;
              break;
            case '2':
              jn = "Kartu Debit/Kredit";
              via = result[0].bayar_card;
              break;
            case '3':
              jn = ($('#platform').val() == 1 ? 'GO-PAY' : 'OVO');
              via = result[0].bayar_emoney;
              break;
          }

          var kop = '';
          var cab = '';

          var dy = ('00'+dt.getDate()).slice(-2);
          var hr = ('00'+dt.getHours()).slice(-2);
          var mn = ('00'+dt.getMinutes()).slice(-2);
          var stamp = 'Tanggal   : ' + dy + ' ' + shortMonths[dt.getMonth()] + ' ' + dt.getFullYear() + ', ' + hr+':'+mn;

          // var via = "Via"
          var sub = 'Sub-total';
          var paid = jn;
          // var byr = 'Via: ' + jn;
          // var crd = 'CC';
          var kbl = 'Change';
          var list = '';

          for(var i = 0; i < (31 - cpyProf.outlet.length)/2; i++){
            kop += ' ';
          } kop += cpyProf.outlet + '\n';

          for(var i = 0; i < (24 - cpyProf.cabang.length)/2; i++){
            cab += ' ';
          } cab += 'Cabang ' + cpyProf.cabang + '\n';

          // var header = '```\n          Sales Receipt\n\n' + kop + cab + '--------------------------------\nNo. Trans : ' +result[0].no_penjualan+ '\n' +stamp+ '\nOperator  : '+(cpyProf.nama ? cpyProf.nama : cpyProf.client)+'\n--------------------------------\n';
          var thanks = ' \n--------------------------------\n\n        Terima Kasih Atas\n         Kunjungan Anda\n';

          for(var i = 0; i < 31 - 'Sub-total'.length - parseInt(result[0].total_jual).toLocaleString('id-ID').length; i++){
            sub += ' ';
          } sub += parseInt(result[0].total_jual).toLocaleString('id-ID') + ' \n';

          var dsc = 'Diskon';
          for(var i = 0; i < 31 - 'Diskon'.length - parseInt(result[0].disc_rp).toLocaleString('id-ID').length; i++){
            dsc += ' ';
          } dsc += parseInt(result[0].disc_rp).toLocaleString('id-ID') + ' \n';

          var grd = 'Grand Total';
          for(var i = 0; i < 31 - 'Grand Total'.length - parseInt(result[0].grantot_jual).toLocaleString('id-ID').length; i++){
            grd += ' ';
          } grd += parseInt(result[0].grantot_jual).toLocaleString('id-ID') + ' \n';

          // for(var i = 0; i < 29-tot.length; i++){
          //   crd += ' ';
          // } crd += tot + ' \n';

          for(var i = 0; i < 31 - jn.length - parseInt(via).toLocaleString('id-ID').length; i++){
            paid += ' ';
          } paid += parseInt(via).toLocaleString('id-ID') + ' \n';

          for(var i = 0; i < 31 - 'Change'.length - parseInt(result[0].kembali_tunai).toLocaleString('id-ID').length; i++){
            kbl += ' ';
          } kbl += parseInt(result[0].kembali_tunai).toLocaleString('id-ID');

          // for(var i = 0; i < 32 - 'Via'.length - jn.length; i++){
          //   via += ' ';
          // } via += jn;

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

            // list += result[i].nama_barang+'\n  '+ q +' x '+ satuan + ws + jumlah +' \n';
            list += result[i].nama_barang+ '\n  Cttn: ' +result[i].catatan+ '\n  '+ q +' x '+ satuan + ws + jumlah +' \n';
          }

          list += '--------------------------------\n';
          // window.location = 'https://wa.me/62' +nohp.substring(1)+ '?text='+encodeURI(header + list + sub + /*via +*/ paid + kbl + thanks + '```');

          dialog.close();
        }
      },
      {
        text: 'Cancel',
        onClick: function(dialog, e){
          dialog.close();
          dialogCetak(id);
        }
      }]
    }).open();
    /*app.dialog.create({
      title: 'Konfirmasi',
      text: 'Masukkan nomor WhatsApp tujuan:',
      closeByBackdropClick: false,
      content: 
        `<div class="list no-hairlines no-hairlines-between">
          <ul>
            <li class="item-content item-input">
              <div class="item-inner">
                <div class="item-input-wrap">
                  <input type="number" name="no_hp" id="no_hp" />
                </div>
              </div>
            </li>
          </ul>
        </div>`,
      buttons: [
      {
        text: 'Send',
        onClick: function(dialog, e){
          var dt = new Date();
          var tot = $('#subtotal').html();
          var totInt = tot.replace(/\D/g, '');
          var kembali = parseInt(paid) - parseInt(totInt);

          var kop = '';
          var cab = '';

          var dy = ('00'+dt.getDate()).slice(-2);
          var hr = ('00'+dt.getHours()).slice(-2);
          var mn = ('00'+dt.getMinutes()).slice(-2);
          var stamp = 'Tanggal   : ' + dy + ' ' + shortMonths[dt.getMonth()] + ' ' + dt.getFullYear() + ', ' + hr+':'+mn;

          var sub = 'Sub-total';
          var paid = 'Paid';
          // var byr = 'Via: ' + jn;
          // var crd = 'CC';
          var kbl = 'Change';
          var list = '';

          for(var i = 0; i < (31 - cpyProf.outlet.length)/2; i++){
            kop += ' ';
          } kop += cpyProf.outlet + '\n';

          for(var i = 0; i < (24 - cpyProf.cabang.length)/2; i++){
            cab += ' ';
          } cab += 'Cabang ' + cpyProf.cabang + '\n';

          var header = '```\n          Sales Receipt\n\n' + kop + cab + '--------------------------------\nNo. Trans : ' +result[0].no_penjualan+ '\n' +stamp+ '\nOperator  : '+(cpyProf.nama ? cpyProf.nama : cpyProf.client)+'\n--------------------------------\n';
          var thanks = ' \n--------------------------------\n\n        Terima Kasih Atas\n         Kunjungan Anda\n';


          for(var i = 0; i < 31 - 'Sub-total'.length - parseInt(result[0].grantot_jual).toLocaleString('id-ID').length; i++){
            sub += ' ';
          } sub += parseInt(result[0].grantot_jual).toLocaleString('id-ID') + ' \n';

          // for(var i = 0; i < 29-tot.length; i++){
          //   crd += ' ';
          // } crd += tot + ' \n';

          for(var i = 0; i < 31 - 'Paid'.length - parseInt(result[0].bayar_tunai).toLocaleString('id-ID').length; i++){
            paid += ' ';
          } paid += parseInt(result[0].bayar_tunai).toLocaleString('id-ID') + ' \n';

          for(var i = 0; i < 31 - 'Change'.length - parseInt(result[0].kembali_tunai).toLocaleString('id-ID').length; i++){
            kbl += ' ';
          } kbl += parseInt(result[0].kembali_tunai).toLocaleString('id-ID');

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

            list += result[i].nama_barang+'\n  '+ q +' x '+ satuan + ws + jumlah +' \n';
          }

          list += '--------------------------------\n';
          window.location = 'https://wa.me/62' +$("#no_hp").val()+ '?text='+encodeURI(header + list + sub + paid + kbl + thanks + '```');

          dialog.close();
        }
      }]
    }).open();*/
  })
}

function comma(el){
  if(el.value == '') el.value = 0;
  el.value = parseInt((el.value).replace(/\D/g, '')).toLocaleString('id-ID');
}

function commaNumber(el){
  if(el.value == '') el.value = 0;

  $(el).prop('type', 'text');
  el.value = parseInt((el.value).replace(/\D/g, '')).toLocaleString('id-ID');
}

function comma_keluar(el){
  var avail = parseInt($("#availcash").val());
  var clean = (el.value == '' ? 0 : parseInt((el.value).replace(/\D/g, '')));

  
  if(clean == 0) el.value = 0;
  if(clean <= avail){
    el.value = parseInt((el.value).replace(/\D/g, '')).toLocaleString('id-ID');
  } else {
    alert("Pengeluaran Melebihi Uang Tersedia!");
    el.value = avail.toLocaleString('id-ID');
  }
}

function changeType(el){
  el.value = el.value.replace(/\D/g, '');
  $(el).prop('type', 'number');
}

function hitungKembalian(val){
  if(val != ''){
    var tot = parseInt($('#subtotal').html().replace(/\D/g, ''));
    kembalian = parseInt(val) - tot;
    $('#kembalian').html(kembalian.toLocaleString('id-ID'));
  }
}

function cekDiskon(val){
  /* console.log(el);
  console.log(el.value.includes('%'));

  // if(el.value.includes('%')){
    // var subtot = parseInt($("#subtotal").html().replace(/\D/g, ''));
    var disc_pr = parseFloat(el.value.replace(/\D/g, ''));
    var disc_rp = disc_pr / 100 * totalSub;

    el.value = Math.round(disc_rp).toLocaleString('id-ID');
  // } */

  var disc_pr = parseFloat(val);
  var disc_rp = disc_pr / 100 * totalSub;

  if(totalSub != 0){
    $("#disk_rp").val(Math.round(disc_rp).toLocaleString('id-ID')).trigger('change');
  }
}

function hitungDiskon(){
  var val = $('#disk_rp').val().replace(/\D/g, '');
  var bayar = $('#bayar').val().replace(/\D/g, '');
  if(val != ''){
    // var tot = parseInt($('#subtotal').html().replace(/\D/g, ''));
    // var tot = totalSub;

    if(totalSub > 0){
      var disk_pr = val / totalSub * 100;
      $('#disk_pr').val(disk_pr);
    }

    totalGrand = totalSub - parseInt(val);
    $('#subtotal').html(totalGrand.toLocaleString('id-ID'));
    hitungKembalian(bayar);
    // $('#bayar').val(totalGrand.toLocaleString('id-ID'));
  }
}

function metode(a){
  mtd = a;
  if(a == '1'){
    $('.bayar-tunai').css('display', 'block');
    $('.bayar-card').css('display', 'none');
    $('.bayar-ewallet').css('display', 'none');
  } else if(a == '2'){
    $('.bayar-tunai').css('display', 'none');
    $('.bayar-card').css('display', 'block');
    $('.bayar-ewallet').css('display', 'none');
  } else if(a == '3'){
    $('.bayar-tunai').css('display', 'none');
    $('.bayar-card').css('display', 'none');
    $('.bayar-ewallet').css('display', 'block');
  }
}

function debug(){
  navigator.screenshot.save(function(error,res){
    if(error){
      console.error(error);
    }else{
      window.plugins.socialsharing.share(null, null, 'file://'+res.filePath);
    }
  });
  // var socOptions = {
  //   files : ['file:///storage/emulated/0/Pictures/screenshot_1572428635396.png']
  // };
  // window.plugins.socialsharing.share(null, null, 'file:///storage/emulated/0/Pictures/screenshot_1572428635396.png');
  // window.plugins.socialsharing.share(null, null, 'file:///storage/emulated/0/Pictures/screenshot_1572428635396.png');
  /*navigator.screenshot.save(function(error,res){
    if(error){
      console.error(error);
    }else{
      window.resolveLocalFileSystemURL('file://'+res.filePath, function (dirEntry) {
        console.log(dirEntry);
        console.log('file system open: ' + dirEntry.name);
        // var isAppend = true;
        // createFile(dirEntry, "fileToAppend.txt", isAppend);
      }, function(){
        console.log('failed');
      });
      // alert(`Screenshot saved at ${res.filePath}`);
      // console.log(res);

      // window.plugins.socialsharing.share(null, null, 'file://'+res.filePath);

      // var socOptions = {
      //   files : ['file://'+res.filePath]
      // };

      // window.plugins.socialsharing.shareWithOptions(socOptions, function(){
      //   console.log('share success');
      // }, function(){
      //   console.log('share failed');
      // });

    }
  });*/
}

function reScreen(){
  // console.log('a');
  // $('#login_page').css('height', moddedHeight);
}

function returnScreen(){
  // console.log('a');
  // $('#login_page').css('height', trueHeight);
}

function dialogShare(id){
  $.ajax({
    url: site+'/API/penjualan/'+id+'/',
    method: 'GET'
  }).done(function(json){
    var result = JSON.parse(json);        
    // var kembali = parseInt(paid) - parseInt(totalGrand);

    var tbl = 
    '<table style="width: 100%">\
      <tr>\
        <td style="width: 40%"></td>\
        <td style="width: 20%"></td>\
        <td style="width: 40%"></td>\
      </tr>';

    var header = 
    '<tr>\
      <td colspan="3" style="text-align: center;">Sales Receipt</td>\
    </tr>';

    var dtloutlet = 
    '<tr>\
      <td colspan="3" style="text-align: center;">'+cpyProf.outlet+'</td>\
    </tr>\
    <tr>\
      <td colspan="3" style="text-align: center; border-bottom: solid black 2px;">'+cpyProf.alamat+'</td>\
    </tr>';

    var notrans = 
    '<tr>\
      <td>No. Trans</td>\
      <td colspan="2">: '+result[0].no_penjualan+'</td>\
    </tr>';

    var dt = new Date();
    var dy = ('00'+dt.getDate()).slice(-2);
    var hr = ('00'+dt.getHours()).slice(-2);
    var mn = ('00'+dt.getMinutes()).slice(-2);
    var stamp = dy + ' ' + shortMonths[dt.getMonth()] + ' ' + dt.getFullYear() + ', ' + hr+':'+mn;
    
    var tgl = 
    '<tr>\
      <td>Tanggal</td>\
      <td colspan="2">: '+stamp+'</td>\
    </tr>';

    var op = 
    '<tr>\
      <td>Operator</td>\
      <td colspan="2">: '+cpyProf.nama+'</td>\
    </tr>\
    <tr><td colspan="3" style="border-top: solid black 2px;"></td></tr>';

    var list = '';
    for(var i = 0; i < result.length; i++){
      var qty = parseInt(result[i].qty_jual).toLocaleString('id-ID');
      var hj = parseInt(result[i].harga_jual).toLocaleString('id-ID');
      var jml = (parseInt(result[i].harga_jual) * parseInt(result[i].qty_jual)).toLocaleString('id-ID');

      list += 
      '<tr>\
        <td colspan="3">\
          '+result[i].nama_barang+'\
          <br>Cttn: '+result[i].catatan+'\
        </td>\
      </tr>\
      <tr>\
        <td style="padding-left: 20px;">'+qty+' x '+hj+'</td>\
        <td colspan="2" style="text-align: right;">'+jml+'</td>\
      </tr>'
    }

    list += '<tr><td colspan="3" style="border-bottom: solid black 2px;"></td></tr>';

    var stot = 
    '<tr>\
      <td>Subtotal</td>\
      <td>:</td>\
      <td style="text-align: right;">'+parseInt(result[0].total_jual).toLocaleString('id-ID')+'</td>\
    </tr>';

    var dsc = 
    '<tr>\
      <td>Diskon</td>\
      <td>:</td>\
      <td style="text-align: right;">'+parseInt(result[0].disc_rp).toLocaleString('id-ID')+'</td>\
    </tr>';

    var grd = 
    '<tr>\
      <td>Grand Total</td>\
      <td>:</td>\
      <td style="text-align: right;">'+parseInt(result[0].grantot_jual).toLocaleString('id-ID')+'</td>\
    </tr>';

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

    var paid = 
    '<tr>\
      <td>'+jn+'</td>\
      <td>:</td>\
      <td style="text-align: right;">'+parseInt(bayar).toLocaleString('id-ID')+'</td>\
    </tr>';

    var chn = 
    '<tr>\
      <td>Change</td>\
      <td>:</td>\
      <td style="text-align: right;">'+parseInt(result[0].kembali_tunai).toLocaleString('id-ID')+'</td>\
    </tr>\
    <tr><td>&nbsp;</td></tr>';

    var thanks = 
      '<tr>\
        <td colspan="3" style="text-align: center;">Terima Kasih Atas Kunjungan Anda</td>\
      </tr>\
      <tr>\
        <td colspan="3" style="text-align: center;">Powered by MediaPOS</td>\
      </tr>\
    </table>';

    var q = tbl + header + dtloutlet + tgl + notrans + op + list + stot + dsc + grd + /*via +*/ paid + chn + thanks;
    var options = {
      documentSize: 'A4',
      type: 'base64'
    }

    pdf.fromData(q, options)
        .then(function(base64){
          window.plugins.socialsharing.share(null, null, 'data:application/pdf;base64,'+base64, null);
          // console.log(base64);
        })
        .catch(function(err){
          console.log(err);
        })
    // $('#preview_rcpt').html(q);
  })
}

function cetakEmail(id){
  alert('receipt akan dikirim via email');
}

/*function pauseState(){
  if(pauseFlag == 1){
    pauseFlag = 0;
  } else {
    pauseFlag = 1;
  }
}*/

function enablePause(){
  pauseFlag = 1;
}

function disablePause(){
  pauseFlag = 0;
}

function hitungLain(uang){
  var cl_uang = parseInt(uang.replace(/\D/g,''));
  var cl_modal = parseInt($('#cl_modal').val().replace(/\D/g,''));
  var cl_sales = parseInt($('#cl_sales').val().replace(/\D/g,''));

  console.log(cl_uang, cl_modal, cl_sales);
  $('#ul_uang_lain').val(Math.abs(cl_modal + cl_sales - cl_uang).toLocaleString('id-ID'));
}

function misc(){
  $('#login-title').css('position', '');
  $('#img-logo').css('margin', '5vh 0 0 10vw');
  $('#backfood').css('display', 'none');
}

function unmisc(){
  $('#login-title').css('position', 'absolute');
  $('#img-logo').css('margin', '');
  $('#backfood').css('display', 'block');
}

function openScanBarcode(){
  cordova.plugins.barcodeScanner.scan(
    function (result) {
      searchbar.search(result.text);
        /* alert("We got a barcode\n" +
              "Result: " + result.text + "\n" +
              "Format: " + result.format + "\n" +
              "Cancelled: " + result.cancelled); */
    },
    function (error) {
        alert("Scanning failed: " + error);
    }
 );
}

// ========== PROSES UTILITY ENDS HERE ==========



// ========== ACCOUNT RELATED PROCESS STARTS HERE ==========

function register(q){
  $('#register_button').addClass('disabled');
  var temp = {
    'act' : 'register',
    'device' : device.uuid
  };

  $.each($(q).serializeArray(), function(){
    temp[this.name] = this.value;
  })

  $.ajax({
    url: site+'/API/daftar/',
    // url: 'https://bprbangli.cloudmnm.com/lightpos/getDaftar.php',
    method: 'POST',
    data: JSON.stringify(temp),
    statusCode: {
      201: function(result, textStatus, jqXHR){
        if(result.status == 1){
          app.dialog.alert('Email konfirmasi berisi link untuk aktivasi akun akan segera dikirim ke email anda. Harap lakukan aktivasi terlebih dahulu sebelum melakukan login.', 'Register', function(){
            $('#register_cred').trigger('reset');
            app.views.main.router.navigate('/');
          });
        }
      },
      200: function(result, textStatus, jqXHR){
        app.dialog.alert('Email atau Username sudah terdaftar.', 'Register', function(){
          return 0;
        });
      }
    },
    timeout: 30 * 1000
  }).fail(function(jqXHR, textStatus, errorThrown){
    console.log(jqXHR);
    console.log(textStatus);
    console.log(errorThrown);
  }).always(function(xhr, textStatus){
    // console.log(textStatus);
    $('#register_button').removeClass('disabled');
  })      
}

function updateProfil(){
  var temp = app.form.convertToData("#profil_cred");
  console.log(temp);

  if(temp.pass1 == temp.pass2){
    $.ajax({
      url: site+'/API/profil/'+cpyProf.id_client+'/',
      method: "POST",
      data: JSON.stringify(temp)
    }).done(function(json){
      if(json){
        alert("Sukses update profil");
        app.views.main.router.navigate('/home/');
      }
    })
  } else {
    alert("Password baru tidak sama");
  }
}

function resetPass(q){
  var temp = {
    act : 'lupa'
  };

  $.each($(q).serializeArray(), function(){
    temp[this.name] = this.value;
  })

  $.ajax({
    url: site+'/API/daftar/',
    // url: 'https://bprbangli.cloudmnm.com/lightpos/getDaftar.php',
    method: 'POST',
    data: JSON.stringify(temp),
    timeout: 30 * 1000
  }).done(function(json){
    app.toast.create({
      text: json[0].status,
      closeTimeout: 3000,
      closeButton: true
    }).open();
  }).fail(function(jqXHR, textStatus, errorThrown){
    console.log(jqXHR);
    console.log(textStatus);
    console.log(errorThrown);
  }).always(function(xhr, textStatus){
    // console.log(textStatus);
    $('#register_button').removeClass('disabled');
  }) 
}

// ========== ACCOUNT RELATED PROCESS ENDS HERE ==========

/*
  $.ajax({
    url: site+"/API/view_penjualan.php?id_client="+cpyProf.id_outlet
  }).done(function(result){
    var json = JSON.parse(result.slice(1, result.length-1));
    var temp = {
      no_penjualan : json[0].no_penjualan,
      tgl_penjualan : json[1].tgl_penjualan,
      jenis : json[2].jns_jual,
      bayar : json[3].jns_bayar,
      cust : json[4].nama_cus,
      total : json[5].total_jual,
      bt : json[6].bayar_tunai,
      kt : json[7].kembali_tunai,   
      disc_rp : json[8].disc_rp   

    }

    var tot = temp.total;
    var totInt = tot.replace(/\D/g, '');
    var paid = $('#bayar').val().replace(/\D/g, ''); if(mtd != '1') paid = totInt;
    var kembali = parseInt(paid) - parseInt(totInt);
    var byr = 'Via :' + temp.bayar;
    var kbl = 'Kembali';
    var uang = 'Pembayaran';  
    var disk = 'Diskon (Rp)';
    var sub = 'Sub-total';
    var crd = 'CC';

    var header = '{br}{center}{h}MediaPOS{/h}{br}Sales Receipt{br}--------------------------------{br}';
    var subheader = '{left}No. Trans : '+temp.no_penjualan+'{br}Tanggal   : '+temp.tgl_penjualan+'{br}Operator  : '+cpyProf.client+'{br}--------------------------------{br}';
    var thanks = '{br}{center}Terima Kasih Atas {br}Kunjungan Anda {br}{br}{br}{br}{br}';
    var eol = '{br}{left}';

    // for(var i = 0; i < 23-tot.length; i++){
    //   sub += ' ';
    // } sub += tot + '{br}';

    for(var i = 0; i < 30-tot.length; i++){
      crd += ' ';
    } crd += tot + '{br}';
   
   
    for(var i = 0; i < 27-temp.bayar.length-parseInt(temp.total-temp.disc_rp).toLocaleString('id-ID').length; i++){
      byr += ' ';
    } byr += parseInt(temp.total-temp.disc_rp).toLocaleString('id-ID') + '{br}';

    for(var i = 0; i < 21-parseInt(temp.disc_rp).toLocaleString('id-ID').length; i++){
      disk += ' ';
    } disk += parseInt(temp.disc_rp).toLocaleString('id-ID') + '{br}';

    for(var i = 0; i < 22-parseInt(temp.bt).toLocaleString('id-ID').length; i++){
      uang += ' ';
    } uang += parseInt(temp.bt).toLocaleString('id-ID') + '{br}';

    for(var i = 0; i < 25-parseInt(temp.kt).toLocaleString('id-ID').length; i++){
      kbl += ' ';
    } kbl += parseInt(temp.kt).toLocaleString('id-ID');
  

    // if(mtd == '1'){
      console.log(header + subheader + q + disk + byr +  uang +  kbl +'{br}' + thanks);
      var image = new Image();
      image.onload = function() {
          var canvas = document.createElement('canvas');
          canvas.height = 41;
          canvas.width = 200;
          var context = canvas.getContext('2d');
          context.drawImage(image, 0, 0);
          var imageData = canvas.toDataURL('image/bmp').replace(/^data:image\/(png|jpg|jpeg|bmp);base64,/, ""); //remove mimetype
          window.DatecsPrinter.printImage(
              imageData, //base64
              canvas.width, 
              canvas.height, 
              1, 
              function() {
                // printMyBarcode();
                
                window.DatecsPrinter.printText(header + subheader + q + disk + byr +  uang +  kbl +'{br}' + thanks + eol, 'ISO-8859-1', 
                  function(){
                    alert('success!');
                    // ordernya(kembali, totInt, paid);
                  }, function() {
                    alert(JSON.stringify(error));
                  });
                
                // }else if (mtd == '2'){
                //   window.DatecsPrinter.printText(header + subheader + q + sub + crd +'{br}' + thanks, 'ISO-8859-1', 
                //     function(){
                //       alert('success!');
                //       ordernya(kembali, totInt, paid);
                //     }, function() {
                //       alert(JSON.stringify(error));
                //     });
                // }
              },
              function(error) {
                  alert(JSON.stringify(error));
              }
          )
      };
      image.src = './img/mediapos_supermini_white.bmp';
  })
  */

/*$.ajax({
    url: site+"/API/view_penjualan_dtl.php?id_client="+cpyProf.id_outlet
  }).done(function(result){
    var json = JSON.parse(result.slice(1, result.length-1));
    var item = json.length / 5;
    var itemArray = [];
    var step = 0;
    var c = 0;
    var list = '';

    // console.log(json[step+1].id_barang);
    // console.log(json[step+2].nama_barang);
    // console.log(json[step+10].harga);

    // console.log(item);

    while(c < item){
      var temp = {
        id_barang : json[step+3].id_barang,
        nama_barang : json[step].nama_barang,
        qty : json[step+1].qty_jual,
        harga : json[step+2].harga_jual,
        total : json[step+4].dtl_total
      };

      itemArray.push(temp);
      step = step + 5;
      c++;
    }

    for(i = 0; i < itemArray.length; i++){
      var ws = '';
      var satuan = parseInt(itemArray[i].harga).toLocaleString('id-ID');
      var jumlah = (parseInt(itemArray[i].harga) * parseInt(itemArray[i].qty)).toLocaleString('id-ID');
  
      for(var j = 0; j < 27 - satuan.length - jumlah.length; j++){
        ws += ' ';
      }
  
      list += '{left}'+itemArray[i].nama_barang+'{br}  '+itemArray[i].qty+' x '+parseInt(itemArray[i].harga)+ws+(parseInt(itemArray[i].harga) * parseInt(itemArray[i].qty)).toLocaleString('id-ID')+'{br}';
    }
  
    list += '--------------------------------{br}{left}';
  
    connectToPrinter(list);
  })*/

/*function connectToPrinter(q){
  window.DatecsPrinter.listBluetoothDevices(
    function (devices) {
      window.DatecsPrinter.connect(devices[0].address, 
        function() {
          window.DatecsPrinter.printText(q);
          // printBayar(q);
        },
        function() {
          alert(JSON.stringify(error));
        }
        );
    },
    function (error) {
      alert(JSON.stringify(error));
    });
}*/

function printBayar(q) {
  /*$.ajax({
    url: site+"/API/view_penjualan.php?id_client="+cpyProf.id_outlet
  }).done(function(result){
    var json = JSON.parse(result.slice(1, result.length-1));
    var temp = {
      no_penjualan : json[0].no_penjualan,
      tgl_penjualan : json[1].tgl_penjualan,
      jenis : json[2].jns_jual,
      bayar : json[3].jns_bayar,
      cust : json[4].nama_cus,
      total : json[5].total_jual,
      bt : json[6].bayar_tunai,
      kt : json[7].kembali_tunai,   
      disc_rp : json[8].disc_rp   

    }

    var tot = temp.total;
    var totInt = tot.replace(/\D/g, '');
    var paid = $('#bayar').val().replace(/\D/g, ''); if(mtd != '1') paid = totInt;
    var kembali = parseInt(paid) - parseInt(totInt);
    var byr = 'Via :' + temp.bayar;
    var kbl = 'Kembali';
    var uang = 'Pembayaran';  
    var disk = 'Diskon (Rp)';
    var sub = 'Sub-total';
    var crd = 'CC';

    var header = '{br}{center}{h}MediaPOS{/h}{br}Sales Receipt{br}--------------------------------{br}';
    var subheader = '{left}No. Trans : '+temp.no_penjualan+'{br}Tanggal   : '+temp.tgl_penjualan+'{br}Operator  : '+cpyProf.client+'{br}--------------------------------{br}';
    var thanks = '{br}{center}Terima Kasih Atas {br}Kunjungan Anda {br}{br}{br}{br}{br}';
    var eol = '{br}{left}';

    // for(var i = 0; i < 23-tot.length; i++){
    //   sub += ' ';
    // } sub += tot + '{br}';

    for(var i = 0; i < 30-tot.length; i++){
      crd += ' ';
    } crd += tot + '{br}';
   
   
    for(var i = 0; i < 27-temp.bayar.length-parseInt(temp.total-temp.disc_rp).toLocaleString('id-ID').length; i++){
      byr += ' ';
    } byr += parseInt(temp.total-temp.disc_rp).toLocaleString('id-ID') + '{br}';

    for(var i = 0; i < 21-parseInt(temp.disc_rp).toLocaleString('id-ID').length; i++){
      disk += ' ';
    } disk += parseInt(temp.disc_rp).toLocaleString('id-ID') + '{br}';

    for(var i = 0; i < 22-parseInt(temp.bt).toLocaleString('id-ID').length; i++){
      uang += ' ';
    } uang += parseInt(temp.bt).toLocaleString('id-ID') + '{br}';

    for(var i = 0; i < 25-parseInt(temp.kt).toLocaleString('id-ID').length; i++){
      kbl += ' ';
    } kbl += parseInt(temp.kt).toLocaleString('id-ID');
  

    // if(mtd == '1'){
      console.log(header + subheader + q + disk + byr +  uang +  kbl +'{br}' + thanks);
      var image = new Image();
      image.onload = function() {
          var canvas = document.createElement('canvas');
          canvas.height = 41;
          canvas.width = 200;
          var context = canvas.getContext('2d');
          context.drawImage(image, 0, 0);
          var imageData = canvas.toDataURL('image/bmp').replace(/^data:image\/(png|jpg|jpeg|bmp);base64,/, ""); //remove mimetype
          window.DatecsPrinter.printImage(
              imageData, //base64
              canvas.width, 
              canvas.height, 
              1, 
              function() {
                // printMyBarcode();
                
                window.DatecsPrinter.printText(header + subheader + q + disk + byr +  uang +  kbl +'{br}' + thanks + eol, 'ISO-8859-1', 
                  function(){
                    alert('success!');
                    // ordernya(kembali, totInt, paid);
                  }, function() {
                    alert(JSON.stringify(error));
                  });
                
                // }else if (mtd == '2'){
                //   window.DatecsPrinter.printText(header + subheader + q + sub + crd +'{br}' + thanks, 'ISO-8859-1', 
                //     function(){
                //       alert('success!');
                //       ordernya(kembali, totInt, paid);
                //     }, function() {
                //       alert(JSON.stringify(error));
                //     });
                // }
              },
              function(error) {
                  alert(JSON.stringify(error));
              }
          )
      };
      image.src = './img/mediapos_supermini_white.bmp';
  })*/
}

// function emptyDB(){
//   db.transaction(function(t){
//     t.executeSql("DELETE FROM pj_dtl_tmp", [],
//       function(){
//         // console.log('devar this');
//         keranjang('a', 'b', 'c', 'd');
//         // comboItems('a', 'b', 'c', 'd');
//       }, function(error){
//         // console.log(error);
//       })
//   })
// }

function listPenjualan(){
  /*db.transaction(function(tx){
    tx.executeSql('SELECT * FROM pj', [], 
      function(tx, rs){
        var datanya = '<ul>';
        for(var i = 0; i < rs.rows.length; i++){
          datanya = '<li class="item-content"><div class="item-inner"><div class="item-title">'+rs.rows.item(i).no_penjualan+'</div></div></li>';
        }

        datanya += '</ul>';
        $('#penjualanList').html(datanya);
      })
  })*/
}

// function checkUpdates(){
  // $.ajax({
  //   url: site+'/API/data/',
  //   method: 'GET'
  // }).done(function(obj){

  //   db.transaction(function(t){
  //     t.executeSql('DROP TABLE m_barang');
  //     t.executeSql('CREATE TABLE IF NOT EXISTS m_barang (id_barang INT PRIMARY KEY NOT NULL, nama_barang VARCHAR(200) NOT NULL, harga_jual DOUBLE, kategori INT)');
  //   })

  //   for (var i = 0; i < obj.length; i++) {
  //     // var harga = obj[i].harga.split('-');
  //     var insert = function(id_barang, nama_barang, harga_jual, kategori){
  //       db.transaction(function(t){
  //         t.executeSql('INSERT INTO m_barang VALUES (?,?,?,?)', [id_barang, nama_barang, harga_jual, kategori], function(t, success){}, 
  //           function(error){
  //             console.log(error.message);
  //           })
  //       })
  //     }(obj[i].id_barang, obj[i].nama_barang, obj[i].harga.split('-')[0], obj[i].tipe);
  //   }
  // }).fail(function(a,b,error){
  //   alert(error);
  // }).always(function(){
  //   tampilFood();
  //   tampilBvrg();
  // })
// }

// function checkUpdates(){
//   $.ajax({
//     url: site+'/API/menu/',
//     method: 'GET'
//   }).done(function(obj){
//     db.transaction(function(t){
//       t.executeSql('DROP TABLE m_barang');
//       t.executeSql('CREATE TABLE IF NOT EXISTS m_barang (id_barang INT PRIMARY KEY NOT NULL, nama_barang VARCHAR(200) NOT NULL, harga_jual DOUBLE, kategori INT)');
//     })

//     for (var i = 0; i < obj.length; i++) {
//       if(cpyProf.id_cabang == obj[i].id_cabang && cpyProf.id_client == obj[i].id_client){
//       // var harga = obj[i].harga.split('-');
//         var insert = function(id_barang, nama_barang, harga_jual, kategori){
//           db.transaction(function(t){
//             t.executeSql('INSERT INTO m_barang VALUES (?,?,?,?)', [id_barang, nama_barang, harga_jual, kategori], function(t, success){}, 
//               function(error){
//                 console.log(error.message);
//               })
//           })
//         }(obj[i].id_barang, obj[i].nama_barang, obj[i].harga.split('-')[0], 1);
//       }
//     }
//   }).fail(function(a,b,error){
//     alert(error);
//   }).always(function(){
//     tampilFood();
//     tampilBvrg();
//   })
// }

// function checkUpdates2(){
//   $.ajax({
//     url: site+'/API/combo/',
//     method: 'GET'
//   }).done(function(obj){

//     db.transaction(function(t){
//       t.executeSql('DROP TABLE m_combo');
//       t.executeSql('DROP TABLE combo_dtl');

//       t.executeSql('CREATE TABLE IF NOT EXISTS m_combo ( id_combo INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, nama_combo VARCHAR(20))');
//       t.executeSql('CREATE TABLE IF NOT EXISTS combo_dtl (id_dtl INTEGER PRIMARY KEY AUTOINCREMENT, id_combo INTEGER, id_barang INTEGER, qty INTEGER )');
//     })

//     for (var i = 0; i < obj.length; i++) {
//       if(obj[i].id_client == cpyProf.id_client)
//       var insert = function(id_combo, nama_combo){
//         db.transaction(function(t){
//           t.executeSql('INSERT INTO m_combo VALUES (?,?)', [id_combo, nama_combo], function(t, success){}, 
//             function(error){
//               console.log(error.message);
//             })
//         })
//       }(obj[i].id_combo, obj[i].nama_combo);
//     }

//     for (var i = 0; i < obj.length; i++) {
//       var insert = function(id_combo, id_barang, qty){
//         db.transaction(function(t){
//           t.executeSql('INSERT INTO combo_dtl (id_combo, id_barang, qty) VALUES (?,?,?)', [id_combo, id_barang, qty], function(t, success){}, 
//             function(error){
//               console.log(error.message);
//             })
//         })
//       }(obj[i].id_combo, obj[i].id_barang, '1');
//     }
//   }).fail(function(a,b,error){
//     alert(error);
//   }).always(function(){
//     tampilCombo();
//   })
// }

// function initMenu(){
//   $.ajax({
//     url: site+'/API/menu/'+cpyProf.id_outlet+'/',
//     method: 'GET'
//   }).done(function(obj){
//     // console.log(obj);
//     db.transaction(function(t){
//       t.executeSql('DROP TABLE m_barang');
//       t.executeSql('CREATE TABLE IF NOT EXISTS m_barang ( id_urut INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, id_barang INT NOT NULL UNIQUE, nama_barang VARCHAR(200) NOT NULL, harga_jual DOUBLE, kategori INT, st INT )');

//       if(!obj[0]){
//         t.executeSql('INSERT INTO m_barang (id_barang, nama_barang, harga_jual, kategori, st) VALUES (?,?,?,?,?)', ['997','TEST FOOD 1','15000', '1', '1']);
//         t.executeSql('INSERT INTO m_barang (id_barang, nama_barang, harga_jual, kategori, st) VALUES (?,?,?,?,?)', ['998','TEST FOOD 2','10000', '1', '1']);
//         t.executeSql('INSERT INTO m_barang (id_barang, nama_barang, harga_jual, kategori, st) VALUES (?,?,?,?,?)', ['999','TEST DRINK 1','8000', '2', '1']);
//       }

//       // t.executeSql('INSERT INTO m_combo VALUES (?,?,?)', ['2', 'TEST COMBO 2', '10000']);

//       // t.executeSql('INSERT INTO combo_dtl (id_combo, id_barang) VALUES (?,?)', ['1', '1']);
//       // t.executeSql('INSERT INTO combo_dtl (id_combo, id_barang) VALUES (?,?)', ['1', '4']);
//       // t.executeSql('INSERT INTO combo_dtl (id_combo, id_barang) VALUES (?,?)', ['2', '3']);
//       // t.executeSql('INSERT INTO combo_dtl (id_combo, id_barang) VALUES (?,?)', ['2', '4']);
//       // t.executeSql('INSERT INTO combo_dtl (id_combo, id_barang) VALUES (?,?)', ['2', '5']);
//     }, function(error){
//       console.log(error);
//     }, function(msg){
//       console.log('init m_barang');
//     })

//     for (var i = 0; i < obj.length; i++) {
//       if(/*cpyProf.id_cabang == obj[i].id_cabang && cpyProf.id_client == obj[i].id_client && */obj[i].id_barang != null && obj[i].nama_barang != null){
//         // console.log(obj[i])
//         var insert = function(id_barang, nama_barang, harga_jual, kategori){
//           db.transaction(function(t){
//             t.executeSql('SELECT COUNT(*) AS jml FROM m_barang WHERE id_barang = ?', [id_barang], function(rt, result){
//                 if(result.rows.item(0).jml > 0){
//                   t.executeSql('UPDATE m_barang SET nama_barang = ?, harga_jual = ?, kategori = ? WHERE id_barang = ?', [nama_barang, harga_jual, kategori, id_barang],
//                     function(){
//                       console.log('sukses update initMenu');
//                     }, function(){
//                       console.log('error update initMenu');
//                     })
//                 } else {
//                   t.executeSql('INSERT INTO m_barang (id_barang, nama_barang, harga_jual, kategori, st) VALUES (?,?,?,?,?)', [id_barang, nama_barang, harga_jual, kategori, 1],
//                     function(){
//                       console.log('sukses insert initMenu');
//                     }, function(){
//                       console.log('error insert (initMenu)');
//                     })
//                 }              
//             })
//           })
//         }(obj[i].id_barang, obj[i].nama_barang, obj[i].harga.split('-')[0], obj[i].tipe);
//       }
//     }
//   }).fail(function(a,b,error){
//     alert('connection error');
//   }).then(function(){
//     tampilFood();
//     tampilBvrg();
//   })
// }

function initCombo(){
  /*$.ajax({
    url: site+'/API/combo/',
    method: 'GET'
  }).done(function(obj){

    // db.transaction(function(t){
    //   t.executeSql('DROP TABLE m_combo');
    //   t.executeSql('DROP TABLE combo_dtl');

    //   t.executeSql('CREATE TABLE IF NOT EXISTS m_combo (id_combo INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, nama_combo VARCHAR(20), harga_jual INT)');
    //   t.executeSql('CREATE TABLE IF NOT EXISTS combo_dtl (id_dtl INTEGER PRIMARY KEY AUTOINCREMENT, id_combo INTEGER, id_barang INTEGER)');
    // }, function(error){
    //   console.log(error);
    // }, function(){

      for (var i = 0; i < obj.length; i++) {
        if(obj[i].id_client == cpyProf.id_client){
          var insert = function(id_combo, nama_combo, harga){
            db.transaction(function(t){
              t.executeSql('INSERT INTO m_combo VALUES (?,?,?)', [id_combo, nama_combo, harga], function(t, success){}, 
                function(error){
                  // console.log(error.message);
                })
            })
          }(obj[i].id_combo, obj[i].nama_combo, obj[i].hj.split('-')[0]);
        }
      }

      for (var i = 0; i < obj.length; i++) {
        if(obj[i].id_client == cpyProf.id_client){
          var insert = function(id_combo, id_barang){
            db.transaction(function(t){
              t.executeSql('INSERT INTO combo_dtl (id_combo, id_barang) VALUES (?,?)', [id_combo, id_barang], function(t, success){}, 
                function(error){
                  // console.log(error.message);
                })
            })
          }(obj[i].id_combo, obj[i].id_barang);
        }
      }

    // })
    
  }).fail(function(a,b,error){
    alert('connection error');
  }).then(function(){
    tampilCombo();
  })*/
}

function uploadPenjualan(){
  /*db.transaction(function(tx){
    tx.executeSql('SELECT * FROM pj a JOIN pj_dtl b ON a.id_pj = b.id_pj WHERE a.id_pj = (SELECT id_pj from pj ORDER BY id_pj DESC LIMIT 1)', [],
      function(t, rs){
        for(var i = 0; i < rs.rows.length; i++){
          var idpj = rs.rows.item(i).id_pj;
          var temp = {
            "no_jual": rs.rows.item(i).no_penjualan,
            "tanggal": rs.rows.item(i).tgl_penjualan,
            "tipe_jual": rs.rows.item(i).tipe_jual,
            "jenis_bayar": rs.rows.item(i).jenis_bayar,
            "user": cpyProf.id_client,
            "total": rs.rows.item(i).total_jual,
            "grantot": rs.rows.item(i).grantot_jual,
            "bayar_tunai": rs.rows.item(i).bayar_tunai,
            "bayar_card": rs.rows.item(i).bayar_card,
            "nomor_kartu": rs.rows.item(i).nomor_kartu,
            "kembali_tunai": rs.rows.item(i).kembali_tunai,
            "meja": "1",
            "id_barang": rs.rows.item(i).id_barang,
            "qty": rs.rows.item(i).qty_jual,
            "harga_jual": rs.rows.item(i).harga_jual,
            "id_outlet": cpyProf.id_outlet,
          }

          // console.log(temp);

          $.ajax({
            url: site+'/API/data/',
            method: 'POST',
            data: JSON.stringify(temp)
          }).done(function(data, text, XHR){
            updatePj(idpj);
            console.log('sukses upload: ', data);
          }).fail(function(XHR, text, error){
            console.log('gagal upload: ', error);
          })
        }
      }, function(error){
        // console.log(error.message);
      })
  })*/
}

function updatePj(idpj){
  /*db.transaction(function(tx){
    tx.executeSql('UPDATE pj SET st = 0 WHERE id_pj = ?', [idpj]);
  })*/
}

function updatePj2(){
  /*db.transaction(function(tx){
    tx.executeSql('UPDATE pj SET st = 0 WHERE st = 1');
  })*/
}

function cariSesuatu(a, b, c){
  /*var data = {
    'jenis_cari' : a,
    'tgl' : b,
    'tglsd' : c
  }

  $.ajax({
    url: site+'/API/cari/',
    method: 'POST',
    data: JSON.stringify(data)
  }).done(function(result){
    // console.log(result);
  }).fail(function(a,b,error){
    // console.log(error);
  })*/
}

function sendPing(){
  /*cekStatus();

  var d = new Date();

  var mo = ('0' + (d.getMonth()+1)).slice(-2);
  var dy = ('0' + d.getDate()).slice(-2);
  var hr = ('0' + d.getHours()).slice(-2);
  var mn = ('0' + d.getMinutes()).slice(-2);
  var sc = ('0' + d.getSeconds()).slice(-2);

  var tgls = d.getFullYear() + '-' + mo + '-' + dy + ' ' + hr + ':' + mn + ':' + sc;
  // console.log(tgls);

  var stamp = {
    'tgl_log' : tgls
  }

  $.ajax({
    url: site+'/API/log/',
    method: 'POST',
    data: JSON.stringify(stamp)
  }).done(function(result){
    // console.log(result);
    pingTimeout = setTimeout(function(){
      sendPing();
    }, 300 * 1000);
  }).fail(function(a,b,error){
    // console.log(error);
  })*/
}

function stopPing(){
  if(pingTimeout){
    clearTimeout(pingTimeout);
    pingTimeout = 0;
  }
}

function cekUUID(){
  alert('Nomor ID device: '+device.uuid);
}

function cekStatus(){
  // console.log('cekstatus in:');
  // initMenu();
  // initCombo();
  // $.ajax({
  //   url: site+'/API/status/'+cpyProf.id_client+'/',
  //   method: 'GET',
  // }).done(function(result){
  //   console.log('cekstatus ajax');
  //   var c = 0;
    
  //   $.each(result, function(i,j){
  //     if(j.nomor_device == device.uuid){
  //       switch(j.kode){
  //         case 'A':
  //         console.log('tambahBarang');
  //         tambahBarang(j.id_barang, j.jenis_ubah);
  //         c++;
  //         break;

  //         case 'B':
  //         console.log('updateMenu');
  //         updateMenu(j.id_menu, j.jenis_ubah);
  //         c++;
  //         break;

  //         case 'C':
  //         console.log('updateCombo');
  //         updateCombo(j.id_combo, j.jenis_ubah);
  //         c++;
  //         break;

  //         case 'D':
  //         console.log('updateHarga');
  //         updateHarga(j.id_harga, j.jenis_ubah, j.id_harga_status);
  //         c++;
  //         break;
  //       }
  //     }
  //   })
  //   updates = c;
  // })
}

function tambahBarang(j, ubah){

  /*uploadStatus('A', ubah);

  $.ajax({
    url: site+'/API/data/',
    method: 'GET'
  }).done(function(result){
    for(var i = 0; i < result.length; i++){
      if(result[i].id_barang != j) continue;

      var a = function(id_barang, nama_barang, harga, tipe){
        db.transaction(function(tx){
          tx.executeSql('INSERT INTO m_barang (id_barang, nama_barang, harga_jual, kategori, st) VALUES (?,?,?,?,?)', [id_barang, nama_barang, harga, tipe, 1]);
        }) 
      }(result[i].id_barang, result[i].nama_barang, result[i].harga.split('-')[0], result[i].tipe)
    }
  })*/
}

function updateMenu(j, ubah){

  /*uploadStatus('B', ubah);

  $.ajax({
    url: site+'/API/data/',
    method: 'GET'
  }).done(function(result){
    db.transaction(function(tx){
      tx.executeSql('UPDATE m_barang SET st = 0');
    }, function(error){}, function(){
      for(var i = 0; i < result.length; i++){
        if(result[i].id_barang != j) continue;

        var a = function(id_barang, nama_barang, harga){
            tx.executeSql('UPDATE m_barang SET st = 1 WHERE id_barang = ?', [id_barang]);
            // tx.executeSql('UPDATE m_barang SET nama_barang = ?, harga_jual = ? WHERE id_barang = ?', [nama_barang, harga, id_barang, '1']);
        }(result[i].id_barang, result[i].nama_barang, result[i].harga.split('-')[0])
      }
    })
    
  })*/
}

function updateCombo(j, ubah){

  /*uploadStatus('C', ubah);

  $.ajax({
    url: site+'/API/data/',
    method: 'GET'
  }).done(function(result){
    for(var i = 0; i < result.length; i++){
      if(result[i].id_barang != j) continue;

      var a = function(id_barang, nama_barang, harga){
        db.transaction(function(tx){
          tx.executeSql('', [id_barang, nama_barang, harga, '1']);
        }) 
      }(result[i].id_barang, result[i].nama_barang, result[i].harga.split('-')[0])
    }
  })*/
}

function updateHarga(j, ubah, jenis){

  /*uploadStatus('D', ubah);

  if(jenis == '1'){
    $.ajax({
      url: site+'/API/data/',
      method: 'GET'
    }).done(function(result){
      for(var i = 0; i < result.length; i++){
        if(result[i].id_price != j) continue;

        var a = function(id_barang, harga){
          db.transaction(function(tx){
            tx.executeSql('UPDATE m_barang SET harga_jual = ? WHERE id_barang = ?', [harga, id_barang]);
          }) 
        }(result[i].id_barang, result[i].harga.split('-')[0])
      }
    })
  }else {
    $.ajax({
      url: site+'/API/combo/',
      method: 'GET'
    }).done(function(result){
      for(var i = 0; i < result.length; i++){
        if(result[i].id_price != j) continue;

        var a = function(id_barang, harga){
          db.transaction(function(tx){
            tx.executeSql('UPDATE m_combo SET harga_jual = ? WHERE id_combo = ?', [harga, id_barang]);
          }) 
        }(result[i].id_barang, result[i].harga.split('-')[0])
      }
    })
  }*/
}

function uploadStatus(kode, jenis_ubah){
  var temp = {
    'jnotif' : jenis_ubah,
    'no_device' : device.uuid,
    'kode' : kode,
    'id_client' : cpyProf.id_client
  }

  $.ajax({
    url: site+'/API/status/',
    method: 'POST',
    data: JSON.stringify(temp)
  }).done(function(result){
    tampilFood();
    tampilBvrg();
    tampilCombo();
    console.log('Hasil uploadStatus: '+result);
  })
}

function prosesKas(jenis, form){
  var dt = new Date();
  var fulldate = dt.getFullYear()+ '-' +('00' +(dt.getMonth()+1)).slice(-2)+ '-' +('00' +dt.getDate()).slice(-2);
  var formData = app.form.convertToData(form);
  var dest = '';
  var form;


  switch(jenis){
    case 'masuk':
      dest = 'kasmasuk';
      form = '#form_kasmasuk';
      break;
    case 'keluar':
      dest = 'kaskeluar';
      form = '#form_kaskeluar';
      break;
  }

  formData.tgl = fulldate;
  formData.user = cpyProf.id_user;
  formData.cab = cpyProf.id_cabang;

  $.ajax({
    url: site+ '/API/' +dest+ '/',
    method: 'POST',
    data: JSON.stringify(formData)
  }).done(function(result){
    if(result){
      alert('Sukses');
      $(form).trigger('reset');
    }
    console.log(result);
  })
}

function initGambar(img){
  var image = new Image();
  image.onload = function() {
    var canvas = document.createElement('canvas');
    var cont = '';
    var dWidth, dHeight;
    canvas.width = 150;
    canvas.height = 150;

    if(image.width > image.height){
      dHeight = 150 / image.width * image.height;
      dWidth = 150;
    } else {
      dWidth = 150 / image.height * image.width;
      dHeight = 150;
    }

    var context = canvas.getContext('2d');
    // context.drawImage(image, 0, 0);
    context.drawImage(image, (canvas.width/2 - dWidth/2), (canvas.height/2 - dHeight/2), dWidth, dHeight);
    logoByte64 = canvas.toDataURL().replace(/^data:image\/(png|jpg|jpeg|bmp);base64,/, ""); //remove mimetype
  }

  if(img){
    image.src = 'data:image/jpeg;base64,' +img;
  } else {
    image.src = './img/ic_launcher.png';
  }
}

function printGambar(){
  // if(logoByte64 == ''){
    var image = new Image();
    image.onload = function() {
        var canvas = document.createElement('canvas');
        var cont = '';
        var dWidth, dHeight;
        canvas.width = 200;
        canvas.height = 200;

        if(image.width > image.height){
          dHeight = 200 / image.width * image.height;
          dWidth = 200;
        } else {
          dWidth = 200 / image.height * image.width;
          dHeight = 200;
        }

        var context = canvas.getContext('2d');
        // context.drawImage(image, 0, 0);
        context.drawImage(image, (canvas.width/2 - dWidth/2), (canvas.height/2 - dHeight/2), dWidth, dHeight);
        cont = canvas.toDataURL().replace(/^data:image\/(png|jpg|jpeg|bmp);base64,/, ""); //remove mimetype

        BTPrinter.list(function(data){
            BTPrinter.connect(function(){
                BTPrinter.printBase64(function(){
                    BTPrinter.disconnect(function(){
      
                    }, function(error){alert('BTPrinter disconnect: ' +error)})
                }, function(error){alert(error)}, cont, '0')
            }, function(error){alert(error)}, data[0])
        }, function(error){alert(error)})
    };
    image.src = './img/mediapos.png';
    // image.src = 'data:image/jpeg;base64,' +logoByte64;
  // }
}

/*function diskon(a){
  if(a.length <= 3){
    diskonAmt = (parseFloat(a) / 100);
    totalGrand = (totalSub - (diskonAmt * totalSub));
    $('#subtotal').html(totalGrand.toLocaleString('id-ID'));
    $('#bayar').val(totalGrand.toLocaleString('id-ID'));
  } else {
    diskonAmt = (parseInt(a));
    totalGrand = (totalSub - diskonAmt)
    $('#subtotal').html(totalGrand.toLocaleString('id-ID'));
    $('#bayar').val(totalGrand.toLocaleString('id-ID'));
  }

  

  // return;
  // var sub = parseInt($('#subtotal').html().replace(/\D/g,''));
  // var dis = parseFloat(a / 100);
  // var fin = parseFloat(sub - sub * dis).toLocaleString('id-ID');
  
  
}*/

/* var modalModal = app.dialog.create({
  title: 'Modal Awal',
  closeByBackdropClick: false,
  content: 
    '<div class="list no-hairlines no-hairlines-between">\
      <ul>\
        <li class="item-content item-input">\
          <div class="item-inner">\
            <div class="item-input-wrap">\
              <input type="tel" pattern="[0-9]" name="modal" id="modal" oninput="comma(this)" style="text-align: right;" />\
            </div>\
          </div>\
        </li>\
      </ul>\
    </div>',
  buttons: [
  {
    text: 'Dashboard',
    onClick: function(dialog, e){
      app.views.main.router.navigate('/dashboard/');
      dialog.close();
    }
  },{
    text: 'Reports',
    onClick: function(dialog, e){
      app.dialog.create({
        title: 'Choose Reports',
        closeByBackdropClick: false,
        buttons: [
        {
          text: 'Sales',
          onClick: function(dialog, e){
            app.views.main.router.navigate('/penjualan/');
            dialog.close();
          }
        },{
          text: 'Item Sales',
          onClick: function(dialog, e){
            app.views.main.router.navigate('/penjualan_item/');
            dialog.close();
          }
        },{
          text: 'Cancel',
          onClick: function(dialog, e){
            dialog.close();
            NativeStorage.getItem('modal', onModalFound, onModalNotFound);
          }
        }]
      }).open();
      dialog.close();
    }
  },{
    text: 'Simpan',
    onClick: function(dialog, e){
      var modal = $('#modal').val().replace(/\D/g, '');
      dailyModal = modal;

      if(modal == ''){
        NativeStorage.getItem('modal', onModalFound, onModalNotFound);
      } else {
        NativeStorage.setItem('modal', modal, onSetModalSuccess, onSetModalFailed);
      }

      dialog.close();
    }
  }]
}); */

/*
status => 2,  Silahkan Konfirmasi Register di Email Anda
status => 3, Data Anda Sudah Terdaftar, silahkan upgrade Premium
status => 4,  Data Anda Sudah Terdaftar, dengan status premium
*/

// TODO: pengeluaran kas dibuat menu sendiri
// TODO: isian note untuk masing2 item pesanan
// TODO: diskon bisa berupa persentase atau nominal
// TODO: sambungkan waiter sama mediapos (?)
// TODO: bug tidak bisa back
// TODO: menu penerimaan
// TODO: logo outlet di atas struk, copyright by mediapos di bawah struk

// TODO: proses pembayaran -> simpan di tabel tmp saat user akan membuat outlet baru -> arahkan ke halaman pembayaran -> user upload bukti pembayaran -> approve kemudian bikin outlet dengan data yg disubmit
// TODO: penambahan role kasir dan pembatasan menu terkait

// 8 September 2020
// TODO: referal code sales
// TODO: pada laporan closing, total uang kas cuma yang jenisnya cash
// TODO: saat register harus cek apakah email valid atau tidak
// TODO: taphold event dari framework7