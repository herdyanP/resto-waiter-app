// Dom7
// sudo cordova build android --release -- --keystore=lightpos.keystore --storePassword=bismillah --alias=lightpos --password=bismillah

// note to self: maybe can use: nyimpen cred login pake token, didapet dari hasil hash di server, yang direturn sama info company
var $$ = Dom7;

// Init App
var app = new Framework7({
  id: 'com.medianusamandiri.LightPOS',
  root: '#app',
  init: false,
  // theme: theme,
  routes: routes,
});

// JS SCRIPT SEMENTARA DISINI DULU YAKKK...
// NYOBA TEMPLATING

var db;
var shortMonths = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
var mtd = 1;
var txNmr = 0;
var retail, cabang, lastId, user, platform, jn, modalAwal, uid, updates;
var adid = {};
var cpyProf;

// var mainView = app.views.main;
// var chart = Highcharts.chart('container1', {});

// Highcharts.setOptions({
//   lang: {
//     months: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"],
//     shortMonths: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"],
//     weekdays: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]
//   }
// })

document.addEventListener('deviceready', function() {
  adid = {
    // banner: 'ca-app-pub-3940256099942544/6300978111',
    banner: 'ca-app-pub-8300135360648716/8651556341',
    interstitial: 'ca-app-pub-3940256099942544/1033173712'
  }

  AdMob.createBanner({
    adId: adid.banner,
    position: AdMob.AD_POSITION.BOTTOM_CENTER,
    autoShow: true
  });

  screen.orientation.lock('portrait');

  db = window.sqlitePlugin.openDatabase({
    name: 'LightPOS.db',
    location: 'default',
  });

  db.transaction(function(transaction) {
    var executeQuery = "DELETE FROM pj_dtl_tmp";
    transaction.executeSql(executeQuery);
  });

  // TODO: pj_dtl, tambahan untuk tipe jual, 1 = barang, 2 = combo (done)

  db.transaction(function(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS m_barang (id_barang INT PRIMARY KEY NOT NULL, nama_barang VARCHAR(200) NOT NULL, harga_jual DOUBLE, kategori INT)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS m_combo ( id_combo INTEGER NOT NULL PRIMARY KEY, nama_combo VARCHAR(20), harga_jual INT)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS combo_dtl (id_dtl INTEGER PRIMARY KEY AUTOINCREMENT, id_combo INTEGER, id_barang INTEGER)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS pj (id_pj INTEGER PRIMARY KEY AUTOINCREMENT, no_penjualan VARCHAR(30), no_faktur VARCHAR(30), tgl_penjualan DATE, jenis_jual int, jenis_bayar int, id_customer int, id_user  int, stamp_date datetime, disc_prs double, disc_rp double, sc_prs double, sc_rp double, ppn double, total_jual double, grantot_jual double, bayar_tunai double, bayar_card double, nomor_kartu varchar, ref_kartu varchar, kembali_tunai double, void_jual varchar, no_meja int, ip varchar, id_gudang int, pl_retail text, meja int, st int)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS pj_dtl (id_dtl_jual int, id_pj int, id_barang int, qty_jual double, harga_jual double, discprs double, discrp double, dtl_total double, harga_jual_cetak double, user int, dtpesan datetime, tipe_jual INT)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS pj_dtl_tmp (id_tmp INTEGER PRIMARY KEY AUTOINCREMENT, id_barang INT, qty INT, total DOUBLE, harga DOUBLE, nama_barang VARCHAR(20), id_combo INT, nama_combo VARCHAR(20), tipe INT)');
  });

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

  app.init();

  app.searchbar.create({
    el: '#foodSearch',
    backdrop: false,
    on: {
      disable: function(){
        tampilFood();
      }
    }
  })

  app.searchbar.create({
    el: '#bvrgSearch',
    backdrop: false,
    on: {
      disable: function(){
        tampilBvrg();
      }
    }
  })

  onLogin();
  tampilFood();
  tampilCombo();

  window.localStorage.setItem('test', 1);

  document.addEventListener("backbutton", onBackPressed, false);
  document.addEventListener("online", onOnline, false);
});

function onOnline(){
  // alert('you\'re online');
  cekStatus();
  db.transaction(function(tx){
    tx.executeSql('SELECT * FROM pj a JOIN pj_dtl b ON a.id_pj = b.id_pj WHERE a.st = 1', [],
      function(t, rs){
        var a = [];
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
          }

          a.push(temp);
          // console.log(temp);
        }

        // console.log(a);

        updatePj2();
        afterOnline(a);

      })
  })
}

function afterOnline(a){
  for(var i = 0; i < a.length; i++){
    // console.log(JSON.stringify(a[i]));
    $.ajax({
      url: 'http://demo.medianusamandiri.com/lightpos/API/data/',
      method: 'POST',
      data: JSON.stringify(a[i])
    }).done(function(data, text, XHR){
      console.log('sukses upload: ', data);
    }).fail(function(XHR, text, error){
      console.log('gagal upload: ', error);
    })
  }
}

function onConstruction(){
  app.toast.create({
    text: "Feature under construction...",
    closeTimeout: 3000,
    closeButton: true
  }).open();
}

function onNewLogin(q){
  $('#login_button').addClass('disabled');

  var temp = {
    'device' : device.uuid
  };

  $.each($(q).serializeArray(), function(){
    temp[this.name] = this.value;
  })

  console.log(temp);

  $.ajax({
    url: 'http://demo.medianusamandiri.com/lightpos/API/login/',
    method: 'POST',
    data: JSON.stringify(temp),
    timeout: 10000
  }).done(function(result){
    console.log(result);
    var c = 0;
    if(result != '0') {
      for(var i = 0; i < result.length; i++){
        if(result[i].nomor_device == device.uuid){
          temp.nama = result[i].nama_pegawai;
          temp.cabang = result[i].nama_cabang;
          temp.outlet = result[i].nama_outlet;
          temp.client = result[i].nama_client;
          temp.id_cabang = result[i].id_cabang;
          temp.id_client = result[i].id_client;
          temp.id_outlet = result[i].id_outlet;
          temp.id_pegawai = result[i].id_pegawai;

          console.log(temp);

          NativeStorage.setItem('akun', temp, onStoreSuccess, onStoreFail);
          app.views.main.router.navigate('/');

          break;
        }

        c++;
        console.log(c);
      }

      if(c > 0) {
        app.toast.create({
          text: "Device Belum Terdaftar, Mohon Tambahkan Device Melalui Menu Back-End",
          closeTimeout: 3000,
          closeButton: true
        }).open();
      } 
    } else {
      app.toast.create({
        text: "Cek lagi username / password anda",
        closeTimeout: 3000,
        closeButton: true
      }).open();
    }
  }).fail(function(){
    app.toast.create({
      text: "Koneksi ke Server Gagal",
      closeTimeout: 3000,
      closeButton: true
    }).open();
  }).always(function(){
    $('#login_button').removeClass('disabled');
  })
}

function onStoreSuccess(obj){
  cpyProf = obj;
  app.dialog.create({
    title: 'Modal Awal',
    closeByBackdropClick: false,
    content: '<div class="list no-hairlines no-hairlines-between">\
    <ul>\
    <li class="item-content item-input">\
    <div class="item-inner">\
    <div class="item-input-wrap">\
    <input type="text" name="modal" id="modal" oninput="comma(this)" style="text-align: right;" />\
    </div>\
    </div>\
    </li>\
    </ul>\
    </div>',
    buttons: [
    {
      text: 'Simpan',
      onClick: function(dialog, e){
        var v = $('#modal').val();
        if(v != '' && v != '0'){
          modalAwal = v.replace(/\D/g, '');
          dialog.close();
            // window.open('http://kopdanamon.cloudmnm.com/cetak.php?nik='+user+'&bulan=12&tahun='+th+'&page=reportshu&type=android', '_self');
          }
        }
      } 
      
      ]
    }).open();

  // app.dialog.prompt('Masukkan modal awal', 'Konfirmasi', function(value){
  //   modalAwal = value;
  // }, function(){
  //   return;
  // })
  console.log('Store Success');

  initMenu();
  initCombo();
}

function onStoreFail(){
  console.log('Store Fail')
}

function onLogin(){
  NativeStorage.getItem('akun', onRetSuccess, onRetFail);
}

function onRetSuccess(obj){
  $.ajax({
    url: 'http://demo.medianusamandiri.com/lightpos/API/login/',
    method: 'POST',
    data: JSON.stringify({'user':obj.user, 'pass':obj.pass, 'device':device.uuid})
  }).done(function(result){
    if(result != '0'){
      cpyProf = obj;
      console.log('succ');
      sendPing();
      cekStatus();

      // if(updates != '0'){
      //   checkUpdates();
      //   checkUpdates2();
      // }

      // $('#bayarButton').removeAttr('disabled').removeClass('disabled');

      $('#loginRow').css('display', 'none');
      $('#logoutRow').css('display', 'block');

      $('#currentUser').html('Operator: '+ (obj.nama ? obj.nama : obj.client));
    } else {
      // alert('gagal');
      onLogout();
    }
  })
}

function onRetFail(){
  console.log('fail');

  app.views.main.router.navigate('/login/');

  // $('#bayarButton').attr('disabled', 'true').addClass('disabled');
  // $('#logoutRow').css('display', 'none');

  // $('#currentUser').html('Operator: Guest');

  db.transaction(function(tx){
    tx.executeSql('INSERT INTO m_barang VALUES (?,?,?,?)', ['1','TEST MENU 1','15000', '1']);
    tx.executeSql('INSERT INTO m_barang VALUES (?,?,?,?)', ['2','TEST MENU 2','12000', '1']);
    tx.executeSql('INSERT INTO m_barang VALUES (?,?,?,?)', ['3','TEST MENU 3','13000', '1']);
    tx.executeSql('INSERT INTO m_barang VALUES (?,?,?,?)', ['4','TEST MENU 4','10000', '2']);
    tx.executeSql('INSERT INTO m_barang VALUES (?,?,?,?)', ['5','TEST MENU 5','8000', '2']);

    tx.executeSql('INSERT INTO m_combo VALUES (?,?,?)', ['1', 'TEST COMBO 1', '12000']);
    tx.executeSql('INSERT INTO m_combo VALUES (?,?,?)', ['2', 'TEST COMBO 2', '10000']);

    tx.executeSql('INSERT INTO combo_dtl (id_combo, id_barang) VALUES (?,?)', ['1', '1']);
    tx.executeSql('INSERT INTO combo_dtl (id_combo, id_barang) VALUES (?,?)', ['1', '4']);
    tx.executeSql('INSERT INTO combo_dtl (id_combo, id_barang) VALUES (?,?)', ['2', '3']);
    tx.executeSql('INSERT INTO combo_dtl (id_combo, id_barang) VALUES (?,?)', ['2', '4']);
    tx.executeSql('INSERT INTO combo_dtl (id_combo, id_barang) VALUES (?,?)', ['2', '5']);
  }, function(error){
    console.log(error);
  }, function(){
    tampilFood();
    tampilBvrg();
    tampilCombo();
  })
}

function onLogout(){
  NativeStorage.remove('akun', onRemSuccess, onRemFail);
}

function onRemSuccess(){
  console.log('rem succ');
  // $('#bayarButton').attr('disabled', 'true').addClass('disabled');
  $('#currentUser').html('Operator: Guest');

  $('#logoutRow').css('display', 'none');
  $('#loginRow').css('display', 'block');

  emptyDB();

  db.transaction(function(tx){
    tx.executeSql('DROP TABLE m_barang');
    tx.executeSql('DROP TABLE m_combo');
    tx.executeSql('DROP TABLE combo_dtl');
    
    tx.executeSql('CREATE TABLE IF NOT EXISTS m_barang (id_barang INT PRIMARY KEY NOT NULL, nama_barang VARCHAR(200) NOT NULL, harga_jual DOUBLE, kategori INT)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS m_combo ( id_combo INTEGER NOT NULL PRIMARY KEY, nama_combo VARCHAR(20), harga_jual INT)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS combo_dtl (id_dtl INTEGER PRIMARY KEY AUTOINCREMENT, id_combo INTEGER, id_barang INTEGER)');
    
    tx.executeSql('INSERT INTO m_barang VALUES (?,?,?,?)', ['1','TEST MENU 1','15000', '1']);
    tx.executeSql('INSERT INTO m_barang VALUES (?,?,?,?)', ['2','TEST MENU 2','12000', '1']);
    tx.executeSql('INSERT INTO m_barang VALUES (?,?,?,?)', ['3','TEST MENU 3','13000', '1']);
    tx.executeSql('INSERT INTO m_barang VALUES (?,?,?,?)', ['4','TEST MENU 4','10000', '2']);
    tx.executeSql('INSERT INTO m_barang VALUES (?,?,?,?)', ['5','TEST MENU 5','8000', '2']);

    tx.executeSql('INSERT INTO m_combo VALUES (?,?,?)', ['1', 'TEST COMBO 1', '12000']);
    tx.executeSql('INSERT INTO m_combo VALUES (?,?,?)', ['2', 'TEST COMBO 2', '10000']);

    tx.executeSql('INSERT INTO combo_dtl (id_combo, id_barang) VALUES (?,?)', ['1', '1']);
    tx.executeSql('INSERT INTO combo_dtl (id_combo, id_barang) VALUES (?,?)', ['1', '4']);
    tx.executeSql('INSERT INTO combo_dtl (id_combo, id_barang) VALUES (?,?)', ['2', '3']);
    tx.executeSql('INSERT INTO combo_dtl (id_combo, id_barang) VALUES (?,?)', ['2', '4']);
    tx.executeSql('INSERT INTO combo_dtl (id_combo, id_barang) VALUES (?,?)', ['2', '5']);
  }, function(error){
    console.log(error);
  }, function(){
    tampilFood();
    tampilBvrg();
    tampilCombo();
  })
  // console.log('Remove Success');
}

function onRemFail(){
  console.log('rem fail');
}

function onBackPressed(){
  var mainView = app.views.main;
  
  if(mainView.router.currentPageEl.f7Page.name == 'login' || mainView.router.currentPageEl.f7Page.name == 'register'){
    mainView.router.navigate('/');
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

function tampilFood(){
  console.log('food');
  db.transaction(function(tx) {
    tx.executeSql('SELECT * FROM m_barang WHERE kategori = "1" ORDER BY nama_barang ASC LIMIT 30', [], function(tx, rs) {
      var len, i;
      if(rs.rows.length > 20) {
        len = 20
      } else {
        len = rs.rows.length
      }

      var all_rows = [];
      var datanya = '';
      for (i = 0; i < len; i++){

        datanya += '<div onclick="simpan('+rs.rows.item(i).id_barang+', 1,'+rs.rows.item(i).harga_jual+',\''+rs.rows.item(i).nama_barang+'\')" class="col-33" style="height: 100px;\"><p style="margin: unset; position: relative; top: 50%; transform: translateY(-50%);">'+rs.rows.item(i).nama_barang+'</p></div>';
        // datanya += '<div onclick="simpan('+rs.rows.item(i).id_barang+','+1+','+rs.rows.item(i).harga_jual+',\''+rs.rows.item(i).nama_barang+'\')" class="col-33" style="height: 100px;\"><br><br><br>'+rs.rows.item(i).nama_barang+'<br><strong>Rp. '+parseInt(rs.rows.item(i).harga_jual).toLocaleString('id-ID')+'</strong></div>';
      }

      datanya += '<div class="col-33" style="height: 100px; visibility: hidden;\"><p style="margin: unset; position: relative; top: 50%; transform: translateY(-50%);">NIL</p></div>';

      $('#foodlist').html(datanya);
    }, function(tx, error) {
      alert('SELECT error: ' + error.message);
    });
  });
}

function cariFood(q){
  db.transaction(function(tx){
    tx.executeSql('SELECT * FROM m_barang WHERE kategori = "1" AND nama_barang LIKE "%'+q+'%" ORDER BY nama_barang ASC LIMIT 30', [], 
      function(tx, rs){
        var len = rs.rows.length, i;
        var all_rows = [];
        var datanya = '';
        for (i = 0; i < len; i++){

          datanya += '<div onclick="simpan('+rs.rows.item(i).id_barang+', 1,'+rs.rows.item(i).harga_jual+',\''+rs.rows.item(i).nama_barang+'\')" class="col-33" style="height: 100px;\"><p style="margin: unset; position: relative; top: 50%; transform: translateY(-50%);">'+rs.rows.item(i).nama_barang+'</p></div>';
          // datanya += '<div onclick="simpan('+rs.rows.item(i).id_barang+','+1+','+rs.rows.item(i).harga_jual+',\''+rs.rows.item(i).nama_barang+'\')" class="col-33" style="height: 100px;\"><br><br><br>'+rs.rows.item(i).nama_barang+'<br><strong>Rp. '+parseInt(rs.rows.item(i).harga_jual).toLocaleString('id-ID')+'</strong></div>';
        }

        datanya += '<div class="col-33" style="height: 100px; visibility: hidden;\"><p style="margin: unset; position: relative; top: 50%; transform: translateY(-50%);">NIL</p></div>';

        $('#foodlist').html(datanya);
      }, function(tx, error){
        alert('SELECT error: ' + error.message);
      })
  })
}

function tampilBvrg(){
  console.log('drinks');
  db.transaction(function(tx) {
    tx.executeSql('SELECT * FROM m_barang WHERE kategori = "2" ORDER BY nama_barang ASC LIMIT 30', [], function(tx, rs) {
      var len, i;
      if(rs.rows.length > 20) {
        len = 20
      } else {
        len = rs.rows.length
      }

      var all_rows = [];
      var datanya = '';
      for (i = 0; i < len; i++){

        datanya += '<div onclick="simpan('+rs.rows.item(i).id_barang+', 1,'+rs.rows.item(i).harga_jual+',\''+rs.rows.item(i).nama_barang+'\')" class="col-33" style="height: 100px;\"><p style="margin: unset; position: relative; top: 50%; transform: translateY(-50%);">'+rs.rows.item(i).nama_barang+'</p></div>';
        // datanya += '<div onclick="simpan('+rs.rows.item(i).id_barang+','+1+','+rs.rows.item(i).harga_jual+',\''+rs.rows.item(i).nama_barang+'\')" class="col-33" style="height: 100px;text-align:left;\"><br><br><br>'+rs.rows.item(i).nama_barang+'<br><strong>Rp. '+parseInt(rs.rows.item(i).harga_jual).toLocaleString('id-ID')+'</strong></div>';
      }

      datanya += '<div class="col-33" style="height: 100px; visibility: hidden;\"><p style="margin: unset; position: relative; top: 50%; transform: translateY(-50%);">NIL</p></div>';

      $('#bvrglist').html(datanya);
    }, function(tx, error) {
      alert('SELECT error: ' + error.message);
    });
  });
}

function cariBvrg(q){
  db.transaction(function(tx){
    tx.executeSql('SELECT * FROM m_barang WHERE kategori = "2" AND nama_barang LIKE "%'+q+'%" ORDER BY nama_barang ASC LIMIT 30', [], 
      function(tx, rs){
        var len = rs.rows.length, i;
        var all_rows = [];
        var datanya = '';
        for (i = 0; i < len; i++){

          datanya += '<div onclick="simpan('+rs.rows.item(i).id_barang+', 1,'+rs.rows.item(i).harga_jual+',\''+rs.rows.item(i).nama_barang+'\')" class="col-33" style="height: 100px;\"><p style="margin: unset; position: relative; top: 50%; transform: translateY(-50%);">'+rs.rows.item(i).nama_barang+'</p></div>';
          // datanya += '<div onclick="simpan('+rs.rows.item(i).id_barang+','+1+','+rs.rows.item(i).harga_jual+',\''+rs.rows.item(i).nama_barang+'\')" class="col-33" style="height: 100px;text-align:left;\"><br><br><br>'+rs.rows.item(i).nama_barang+'<br><strong>Rp. '+parseInt(rs.rows.item(i).harga_jual).toLocaleString('id-ID')+'</strong></div>';
        }

        datanya += '<div class="col-33" style="height: 100px; visibility: hidden;\"><p style="margin: unset; position: relative; top: 50%; transform: translateY(-50%);">NIL</p></div>';

        $('#bvrglist').html(datanya);
      }, function(tx, error){
        alert('SELECT error: ' + error.message);
      })
  })
}

function tampilCombo(){
  console.log('combos');
  db.transaction(function(tx) {
    tx.executeSql('SELECT * FROM m_combo ORDER BY nama_combo ASC LIMIT 30', [], function(tx, rs) {
      var len, i;
      if(rs.rows.length > 20) {
        len = 20
      } else {
        len = rs.rows.length
      }

      var all_rows = [];
      var datanya = '';
      for (i = 0; i < len; i++){

        datanya += '<div onclick="simpanCombo('+rs.rows.item(i).id_combo+', 1,'+rs.rows.item(i).harga_jual+',\''+rs.rows.item(i).nama_combo+'\')" class="col-33" style="height: 100px;\"><p style="margin: unset; position: relative; top: 50%; transform: translateY(-50%);">'+rs.rows.item(i).nama_combo+'</p></div>';
        // datanya += '<div onclick="simpan('+rs.rows.item(i).id_barang+','+1+','+rs.rows.item(i).harga_jual+',\''+rs.rows.item(i).nama_barang+'\')" class="col-33" style="height: 100px;text-align:left;\"><br><br><br>'+rs.rows.item(i).nama_barang+'<br><strong>Rp. '+parseInt(rs.rows.item(i).harga_jual).toLocaleString('id-ID')+'</strong></div>';
      }

      datanya += '<div class="col-33" style="height: 100px; visibility: hidden;\"><p style="margin: unset; position: relative; top: 50%; transform: translateY(-50%);">NIL</p></div>';

      $('#combolist').html(datanya);
    }, function(tx, error) {
      alert('SELECT error: ' + error.message);
    });
  });
}

function getCombo(a){
  db.transaction(function(tx){
    tx.executeSql('SELECT * FROM m_combo a JOIN combo_dtl b ON a.id_combo = b.id_combo JOIN m_barang c ON b.id_barang = c.id_barang WHERE a.id_combo = ?', [a],
      function(t, rs){
        for(var i = 0; i < rs.rows.length; i++){
          simpan(rs.rows.item(i).id_barang, '1', rs.rows.item(i).harga_jual, rs.rows.item(i).nama_barang);
        }
      })
  })
}

// id_barang INT, id_combo INT, qty INT, total DOUBLE, harga DOUBLE, nama_barang VARCHAR(20), nama_combo VARCHAR(20)

function simpan(a,b,c,d){
  db.transaction(function(transaction) {
    var c1=0;
    var qty=0;
    transaction.executeSql('SELECT count(*) as c, qty, harga FROM pj_dtl_tmp where id_barang=?', [a], function(tx, rs) {
      if(rs.rows.item(0).c<1){
        var executeQuery = "INSERT INTO pj_dtl_tmp (id_barang, qty, total, nama_barang, harga, tipe) VALUES (?,?,?,?,?,?)";
        transaction.executeSql(executeQuery, [a,b,c,d,c,1]
          , function(tx, result) {
            keranjang(a,b,c,d);
          },
          function(error){
            alert('Error occurred'); 
          });
      } else { //update apabila ada data dikeranjang

        var q=parseInt(rs.rows.item(0).qty)+1;
        var t=parseInt(rs.rows.item(0).harga)*q;
        var executeQuery = "UPDATE pj_dtl_tmp SET qty="+ q +", total="+t+" where id_barang=?";             
        transaction.executeSql(executeQuery, [a], 
          function(tx, result) {
            keranjang(a,b,c,d);
          },
          function(error){
            alert('Error occurred'); 
          });
      }
    }, function(tx, error) {
      alert('SELECT error: ' + error.message);
    });
  });
}

function simpanCombo(a,b,c,d){
  db.transaction(function(transaction) {
    var c1=0;
    var qty=0;
    transaction.executeSql('SELECT count(*) as c, qty, harga FROM pj_dtl_tmp where id_combo=?', [a], function(tx, rs) {
      if(rs.rows.item(0).c<1){
        var executeQuery = "INSERT INTO pj_dtl_tmp (id_combo, qty, total, nama_combo, harga, tipe) VALUES (?,?,?,?,?,?)";
        transaction.executeSql(executeQuery, [a,b,c,d,c,2]
          , function(tx, result) {
            keranjang(a,b,c,d);
          },
          function(error){
            alert('Error occurred'); 
          });
      } else { //update apabila ada data dikeranjang

        var q=parseInt(rs.rows.item(0).qty)+1;
        var t=parseInt(rs.rows.item(0).harga)*q;
        var executeQuery = "UPDATE pj_dtl_tmp SET qty="+ q +", total="+t+" where id_combo=?";             
        transaction.executeSql(executeQuery, [a], 
          function(tx, result) {
            keranjang(a,b,c,d);
          },
          function(error){
            alert('Error occurred'); 
          });
      }
    }, function(tx, error) {
      alert('SELECT error: ' + error.message);
    });
  });
}

function keranjang(a,b,c,d){
  var data = '<ul>'
  var jumlah = 0;
  db.transaction(function(tx) {
    tx.executeSql('SELECT * FROM pj_dtl_tmp', [], function(tx, rs) {
      var len = rs.rows.length;
      var all_rows = [];
      for (i = 0; i < len; i++){
        if(rs.rows.item(i).nama_barang){
          data += '<li class="item-content ">\
          <div class="item-inner">\
          <div class="item-title">'+rs.rows.item(i).nama_barang+'\
          <div class="item-footer">'+rs.rows.item(i).qty+' x '+rs.rows.item(i).harga+'</div>\
          </div>\
          <div class="item-after"><a href="#" onclick="pilihHapus('+rs.rows.item(i).id_tmp+','+rs.rows.item(i).qty+')"><i class="icon material-icons md-only">remove_shopping_cart</i></a></div>\
          </div>\
          </li>'
          // data+="<li class=\"swipeout deleted-callback\" data-id=\""+rs.rows.item(i).id_tmp+"\"><div class=\"item-content swipeout-content\"><div class=\"item-inner\"><div class=\"item-title\"><div class=\"item-header\">"+rs.rows.item(i).nama_barang+"</div>"+rs.rows.item(i).total.toLocaleString()+"</div><div>"+rs.rows.item(i).qty+"</div></div></div><div class=\"swipeout-actions-right\"><a href=\"#\" onclick=\"hapusKeranjang('"+rs.rows.item(i).id_tmp+"')\" class=\"swipeout-delete\">Delete</a></div></li>";
          jumlah += parseInt(rs.rows.item(i).qty * rs.rows.item(i).harga) * 1.1;
        } else {
          data += '<li class="item-content ">\
          <div class="item-inner">\
          <div class="item-title">'+rs.rows.item(i).nama_combo+'\
          <div class="item-footer">'+rs.rows.item(i).qty+' x '+rs.rows.item(i).harga+'</div>\
          </div>\
          <div class="item-after"><a href="#" onclick="pilihHapus('+rs.rows.item(i).id_tmp+','+rs.rows.item(i).qty+')"><i class="icon material-icons md-only">remove_shopping_cart</i></a></div>\
          </div>\
          </li>'
          // data+="<li class=\"swipeout deleted-callback\" data-id=\""+rs.rows.item(i).id_tmp+"\"><div class=\"item-content swipeout-content\"><div class=\"item-inner\"><div class=\"item-title\"><div class=\"item-header\">"+rs.rows.item(i).nama_barang+"</div>"+rs.rows.item(i).total.toLocaleString()+"</div><div>"+rs.rows.item(i).qty+"</div></div></div><div class=\"swipeout-actions-right\"><a href=\"#\" onclick=\"hapusKeranjang('"+rs.rows.item(i).id_tmp+"')\" class=\"swipeout-delete\">Delete</a></div></li>";
          jumlah += parseInt(rs.rows.item(i).qty * rs.rows.item(i).harga) * 1.1;
        }
      }

      // if(len == 0){
      //   data += '<li class="item-content "><div class="item-inner"><div class="item-title">Kosong</div></div></li>';
      // }

      data += '</ul>';
      $('#keranjang').html(data);
      $('#subtotal').html(jumlah.toLocaleString('id-ID'));
      // var ppn=jumlah*(10/100);
      // var gt=jumlah+ppn;
      // $('#ppn').html(ppn.toLocaleString());
      // $('#grandtot').html(gt.toLocaleString());
    }, function(tx, error) {
      alert('SELECT error: ' + error.message);
    });
  });
}

function pilihHapus(a, b){
  if(b > 1) {
    hapusSatu(a)
  } else {
    hapusKeranjang(a)
  }
}

function hapusSatu(a){
  // if(c == '1'){
    db.transaction(function(t){
      t.executeSql('UPDATE pj_dtl_tmp SET qty = qty - 1 WHERE id_tmp = ?', [a], 
        function(tx, result){
          keranjang("a","b","c","d");
        }, function(error){
          alert(error);
        })
    })
  // } else {
  //   db.transaction(function(t){
  //     t.executeSql('UPDATE pj_dtl_tmp SET qty = qty - 1 WHERE id_tmp = ?', [a], 
  //       function(tx, result){
  //         comboItems("a","b","c","d");
  //       }, function(error){
  //         alert(error);
  //       })
  //   })
  // }
}

function hapusKeranjang(a){
  var b = a;
  // if(c == '1'){
    db.transaction(function(transaction) {
      var executeQuery = "DELETE FROM pj_dtl_tmp where id_tmp = ?";
      transaction.executeSql(executeQuery, [b],
        function(tx, result) {
          keranjang("a","b","c","d");
        });
    });
  // } else {
  //   db.transaction(function(transaction) {
  //     var executeQuery = "DELETE FROM pj_dtl_tmp where id_tmp = ?";
  //     transaction.executeSql(executeQuery, [b],
  //       function(tx, result) {
  //         comboItems("a","b","c","d");
  //       });
  //   });
  // }
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

function bayar(){
  var list = '';
  platform = $('#platform').val();

  if(mtd == '1'){
    jn = 'Tunai';
  } else if (mtd == '2'){
    jn = 'Kartu Kredit';
  } else if (mtd == '3'){
    if(platform == '1'){
      jn = 'GO-PAY';
    } else if(platform == '2'){
      jn = 'OVO';
    }
  }

  app.dialog.create({
    title: 'Konfirmasi',
    text: 'Cetak receipt via:',
    buttons: [{
      text: 'Cancel',
      close: true
    }, {
      text: 'Print',
      onClick: function(){
        db.transaction(function(tx){
          tx.executeSql('SELECT * FROM pj_dtl_tmp', [], 
            function(t, rs){
              for(var i = 0; i < rs.rows.length; i++){
                var ws = '';
                var satuan = parseInt(rs.rows.item(i).harga).toLocaleString('id-ID');
                var jumlah = (parseInt(rs.rows.item(i).harga) * parseInt(rs.rows.item(i).qty)).toLocaleString('id-ID');

                for(var j = 0; j < 27 - satuan.length - jumlah.length; j++){
                  ws += ' ';
                }

                list += '{left}'+rs.rows.item(i).nama_barang+'{br}  '+rs.rows.item(i).qty+' x '+parseInt(rs.rows.item(i).harga)+ws+(parseInt(rs.rows.item(i).harga) * parseInt(rs.rows.item(i).qty)).toLocaleString('id-ID')+'{br}';
              }

              list += '--------------------------------{br}{left}';
              txNmr = nomor();

              connectToPrinter(list);
            }, function(t, error){
              alert('error')
            })
        })
      }
    }, {
      text: 'WhatsApp',
      onClick: function(){
        app.dialog.prompt('Masukkan nomor WhatsApp (+62):', 'Konfirmasi', function(result){
          if(result != ''){
            txNmr = nomor();
            db.transaction(function(tx){
              tx.executeSql('SELECT * FROM pj_dtl_tmp', [], 
                function(t, rs){
                  var dt = new Date();
                  var tot = $('#subtotal').html();
                  var totInt = tot.replace(/\D/g, '');
                  var paid = $('#bayar').val().replace(/\D/g, ''); if(mtd != '1') paid = totInt;
                  var kembali = parseInt(paid) - parseInt(totInt);

                  var kop = '';
                  var cab = '';

                  var dy = ('00'+dt.getDate()).slice(-2);
                  var hr = ('00'+dt.getHours()).slice(-2);
                  var mn = ('00'+dt.getMinutes()).slice(-2);

                  var sub = 'Sub-total';
                  var byr = 'Via: ' + jn;
                  var crd = 'CC';
                  var kbl = 'Kembali';

                  for(var i = 0; i < (31 - cpyProf.outlet.length)/2; i++){
                    kop += ' ';
                  } kop += cpyProf.outlet + '\n';

                  for(var i = 0; i < (24 - cpyProf.cabang.length)/2; i++){
                    cab += ' ';
                  } cab += 'Cabang ' + cpyProf.cabang + '\n';

                  var header = '```\n          Sales Receipt\n\n'+kop+cab+'--------------------------------\nNo. Trans : '+txNmr+'\nTanggal   : '+dy+' '+shortMonths[dt.getMonth()]+' '+dt.getFullYear()+', '+hr+':'+mn+'\nOperator  : '+cpyProf.nama+'\n--------------------------------\n';
                  var thanks = ' \n--------------------------------\n\n        Terima Kasih Atas\n         Kunjungan Anda\n';


                  for(var i = 0; i < 22-tot.length; i++){
                    sub += ' ';
                  } sub += tot + ' \n';

                  for(var i = 0; i < 29-tot.length; i++){
                    crd += ' ';
                  } crd += tot + ' \n';

                  for(var i = 0; i < 26 - jn.length - parseInt(paid).toLocaleString().length; i++){
                    byr += ' ';
                  } byr += parseInt(paid).toLocaleString('id-ID') + ' \n';

                  for(var i = 0; i < 24-parseInt(kembali).toLocaleString().length; i++){
                    kbl += ' ';
                  } kbl += parseInt(kembali).toLocaleString('id-ID');
                  
                  for(var i = 0; i < rs.rows.length; i++){
                    var ws = '';
                    var q = parseInt(rs.rows.item(i).qty).toLocaleString('id-ID');
                    var satuan = parseInt(rs.rows.item(i).harga).toLocaleString('id-ID');
                    var jumlah = (parseInt(rs.rows.item(i).harga) * parseInt(rs.rows.item(i).qty)).toLocaleString('id-ID');

                    console.log('q: '+q.length+', satuan: '+satuan.length+', jumlah: '+jumlah.length);

                    var tlen = 26 - (satuan.length + jumlah.length + q.length);

                    for(var j = 0; j < tlen; j++){
                      ws += ' ';
                    }

                    list += rs.rows.item(i).nama_barang+'\n  '+ q +' x '+ satuan + ws + jumlah +' \n';
                  }

                  list += '--------------------------------\n';

                  ordernya(kembali, totInt, paid);
                  window.location = 'https://wa.me/62'+result+'?text='+encodeURI(header + list + sub + byr + kbl + thanks + '```');
                  
                }, function(t, error){
                  alert('error')
                })
            })
          }
        }, function(){})
      }
    }]
  }).open();
}

function nomor(){
  var d = new Date();
  var inc = (parseInt(window.localStorage.getItem("inctrx")) + 1);
  var str = ""+inc;
  var gud = ""+1;
  var pad = "0000";
  var pad1 = "000";

  var dayTrans = ('0000'+inc.toString()).slice(-4);

  // susunan nomor adalah YYYYMMDD{IDOUTLET}{SEQDAY}
  // db.transaction(function(tx) {
  //   tx.executeSql('SELECT count(id_pj) as ok FROM pj', [], function(tx, rs) {
  //     var len = rs.rows.length, i;
  //     var all_rows = [];
  //     var datanya="";
  //     for (i = 0; i < len; i++){
  //       all_rows=rs.rows.item(i);
  //     }
  //     alert(rs.rows.item(0).ok);
  //   }, function(tx, error) {
  //    alert('SELECT error: ' + error.message);
  //  });
  // });

  var ans = pad.substring(0, pad.length - str.length) + str;
  var ans1 = pad1.substring(0, pad1.length - gud.length) + gud;

  // var nomornya=d.getFullYear()+""+(d.getMonth()+1)+""+d.getDate()+""+ans1+""+ans;

  var nomornya = 'TX/' + '01/' + d.getFullYear() + (('0'+(d.getMonth()+1)).slice(-2)) + '/' + (('0'+d.getDate()).slice(-2)) + '/' + dayTrans;
  window.localStorage.setItem("inctrx",inc);
  return nomornya;
}

function ordernya(kembali, subTot, uang){

  if(mtd != '1') {
    kembali = 0;
    uang = 0;
  }

  var d = new Date();
  var tgl = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+("0" + d.getDate()).slice(-2);
  var tgltime = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+("0" + d.getDate()).slice(-2)+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();

  // var uang = 0;
  // var subTot = parseInt($('#subtotal').html().replace(/\D/g, ''));
  
  db.transaction(function(transaction) {
    var executeQuery = "INSERT INTO pj (no_penjualan, no_faktur, tgl_penjualan, jenis_jual, id_user, stamp_date, no_meja, id_gudang, meja, st, total_jual, grantot_jual, bayar_tunai, bayar_card, kembali_tunai, jenis_bayar) \
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    transaction.executeSql(executeQuery, [txNmr, txNmr, tgl, '1', '1', tgltime, '0', '1', '1', '1', subTot, subTot, uang, subTot, kembali, mtd], 
      function(tx, result) {
        orderdtl(result.insertId);
      },
      function(error){
        alert('Error occurred'); 
      });
  });
}

function orderdtl(id){
  db.transaction(function(tx) {
    tx.executeSql('SELECT *,'+id+' as idpj FROM pj_dtl_tmp', [], function(tx, rs) {
      var len = rs.rows.length, i;
      var all_rows = [];
      var idnya = '';
      var datanya = '';

      for (i = 0; i < len; i++){
        idnya = rs.rows.item(i).id_tmp;
        all_rows.push(rs.rows.item(i));
      }

      again(all_rows);
    }, function(tx, error) {
      alert('SELECT error: ' + error.message);
    });
  });
}

function again(a){
  var d = new Date();
  var tgltime = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();

  $('#bayar').val('');
  for (var i = 0; i < a.length; i++) {
    var insert = function(id_pj, id_barang, qty_jual, harga_jual, discprs, discrp, dtl_total, harga_jual_cetak, user, dtpesan, id_tmp, tipe){
      db.transaction(function(t){
        t.executeSql('SELECT COUNT(*) c FROM pj_dtl WHERE id_pj = ? AND id_barang = ?', [id_pj, id_barang], 
          function(t, result){
            db.transaction(function(transaction) {
              var executeQuery = "INSERT INTO pj_dtl (id_pj, id_barang, qty_jual, harga_jual, discprs, discrp, dtl_total, harga_jual_cetak, user, dtpesan, tipe_jual) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
              transaction.executeSql(executeQuery, [id_pj, id_barang, qty_jual, harga_jual, discprs, discrp, dtl_total, harga_jual_cetak, user, dtpesan, tipe], 
                function(tx, result) {
                  hapusKeranjang(id_tmp);
                },
                function(error){
                  alert('Error occurred'); 
                })
            });
          }, function(error){})
      })
    }(a[i].idpj, a[i].id_barang, a[i].qty, a[i].harga, "0", "0", a[i].total, a[i].harga, "1", tgltime, a[i].id_tmp, a[i].tipe)
  }

  setTimeout(function(){
    uploadPenjualan();
  }, 10 * 1000);
}

// function ordernya(){
//   var c1=1;
//   var qty=0;

//   var nomorx=nomor();
//   var d=new Date();
//   var tgl=d.getFullYear()+"-"+(d.getMonth()+1)+"-"+("0" + d.getDate()).slice(-2);
//   var tgltime=d.getFullYear()+"-"+(d.getMonth()+1)+"-"+("0" + d.getDate()).slice(-2)+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();

//   if(st == 2){
//     nomormeja = -1;
//     c1 = 0;
//   }else if(nomormeja==0){
//     alert('Harap memilih meja dahulu!');
//     return;
//   }

//   db.transaction(function(tx){
//     tx.executeSql("SELECT COUNT(*) c FROM pj WHERE id_pj = ?", [idtemp],
//       function(t, result){
//         if(result.rows.item(0).c < 1){
//           db.transaction(function(transaction) {
//             var executeQuery = "INSERT INTO pj (no_penjualan,no_faktur,tgl_penjualan,jenis_jual,id_user,stamp_date,no_meja,id_gudang,meja,st) VALUES (?,?,?,?,?,?,?,?,?,?)";
//             transaction.executeSql(executeQuery, [nomorx,nomorx,tgl,st,'1',tgltime,nomormeja,'1','1',c1]
//               , function(tx, result) {
//                 orderdtl(result.insertId);
//                 listmeja();
//               },
//               function(error){
//                 alert('Error occurred'); 
//               });
//           });
//         } else{
//           orderdtl(idtemp);
//         }
//       })
//   })
// }

// function orderdtl(id){
//   db.transaction(function(tx) {
//     tx.executeSql('SELECT *,'+id+' as idpj FROM pj_dtl_tmp', [], function(tx, rs) {
//       var len = rs.rows.length, i;
//       var all_rows = [];
//       var idnya="";
//       var datanya="";
//       for (i = 0; i < len; i++){
//         idnya=rs.rows.item(i).id_tmp;
//         all_rows.push(rs.rows.item(i));
//       }
//       again(all_rows);
//     }, function(tx, error) {
//       alert('SELECT error: ' + error.message);
//     });
//   });
// }

// function again(a){
//   var mainView = app.views.main;
//   var d = new Date();
//   var tgltime = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
//   for (var i = 0; i < a.length; i++) {
//     var insert = function(id_pj, id_barang, qty_jual, harga_jual, discprs, discrp, dtl_total, harga_jual_cetak, user, dtpesan, id_tmp){
//       db.transaction(function(t){
//         t.executeSql('SELECT COUNT(*) c FROM pj_dtl WHERE id_pj = ? AND id_barang = ?', [id_pj, id_barang], 
//           function(t, result){
//             if(result.rows.item(0).c < 1){
//               db.transaction(function(transaction) {
//                 var executeQuery = "INSERT INTO pj_dtl (id_pj, id_barang, qty_jual, harga_jual, discprs, discrp, dtl_total, harga_jual_cetak, user, dtpesan) VALUES (?,?,?,?,?,?,?,?,?,?)";
//                 transaction.executeSql(executeQuery, [id_pj, id_barang, qty_jual, harga_jual, discprs, discrp, dtl_total, harga_jual_cetak, user, dtpesan]
//                   , function(tx, result) {
//                     hapusKeranjang(id_tmp);
//                   },
//                   function(error){
//                     alert('Error occurred'); 
//                   })
//               });
//             } else{
//               db.transaction(function(transaction) {
//                 var executeQuery = "UPDATE pj_dtl SET qty_jual = qty_jual + ?, dtl_total = dtl_total + ? WHERE id_pj = ? AND id_barang = ?";
//                 transaction.executeSql(executeQuery, [qty_jual, dtl_total, id_pj, id_barang], 
//                   function(tx, result) {
//                     hapusKeranjang(id_tmp);
//                   }, 
//                   function(error){
//                     alert('Error occured');
//                   })
//               });
//             }
//           }, function(error){})
//       })
//     }(a[i].idpj, a[i].id_barang, a[i].qty, a[i].harga,"0","0",a[i].total,a[i].harga,"1",tgltime, a[i].id_tmp)
//   }
//   idtemp = 0;
//   mainView.router.back();
// }

function connectToPrinter(q){
  window.DatecsPrinter.listBluetoothDevices(
    function (devices) {
      window.DatecsPrinter.connect(devices[0].address, 
        function() {
          printBayar(q);
        },
        function() {
          alert(JSON.stringify(error));
        }
        );
    },
    function (error) {
      alert(JSON.stringify(error));
    });
}

function printBayar(q) {
  var tot = $('#subtotal').html();
  var totInt = tot.replace(/\D/g, '');
  var paid = $('#bayar').val().replace(/\D/g, ''); if(mtd != '1') paid = totInt;
  var kembali = parseInt(paid) - parseInt(totInt);
  var dt = new Date();

  var dy = ('00'+dt.getDate()).slice(-2);
  var hr = ('00'+dt.getHours()).slice(-2);
  var mn = ('00'+dt.getMinutes()).slice(-2);

  var header = '{br}{center}{h}LightPOS{/h}{br}Sales Receipt{br}--------------------------------{br}';
  var subheader = '{left}No. Trans : '+txNmr+'{br}Tanggal   : '+dy+' '+shortMonths[dt.getMonth()]+' '+dt.getFullYear()+', '+hr+':'+mn+'{br}Operator  : '+user+'{br}--------------------------------{br}';
  var thanks = '{br}{center}Terima Kasih Atas {br}Kunjungan Anda {br}{br}{br}{br}{br}';
  var sub = 'Sub-total';
  var byr = 'Via :' + jn;
  var crd = 'CC';
  var kbl = 'Kembali';

  for(var i = 0; i < 23-tot.length; i++){
    sub += ' ';
  } sub += tot + '{br}';

  for(var i = 0; i < 30-tot.length; i++){
    crd += ' ';
  } crd += tot + '{br}';

  for(var i = 0; i < 26 - jn.length - parseInt(paid).toLocaleString().length; i++){
    byr += ' ';
  } byr += parseInt(paid).toLocaleString('id-ID') + '{br}';

  for(var i = 0; i < 25-parseInt(kembali).toLocaleString().length; i++){
    kbl += ' ';
  } kbl += parseInt(kembali).toLocaleString('id-ID');

  // if(mtd == '1'){
    window.DatecsPrinter.printText(header + subheader + q + sub + byr + kbl +'{br}' + thanks, 'ISO-8859-1', 
      function(){
        alert('success!');
        ordernya(kembali, totInt, paid);
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
}

function comma(el){
  if(el.value == '') el.value = 0;
  el.value = parseInt((el.value).replace(/\D/g, '')).toLocaleString('id-ID');
}

function emptyDB(){
  db.transaction(function(t){
    t.executeSql("DELETE FROM pj_dtl_tmp", [],
      function(){
        console.log('delet this');
        keranjang('a', 'b', 'c', 'd');
        // comboItems('a', 'b', 'c', 'd');
      }, function(error){
        console.log(error);
      })
  })
}

function listPenjualan(){
  db.transaction(function(tx){
    tx.executeSql('SELECT * FROM pj', [], 
      function(tx, rs){
        var datanya = '<ul>';
        for(var i = 0; i < rs.rows.length; i++){
          datanya = '<li class="item-content"><div class="item-inner"><div class="item-title">'+rs.rows.item(i).no_penjualan+'</div></div></li>';
        }

        datanya += '</ul>';
        $('#penjualanList').html(datanya);
      })
  })
}

// function checkUpdates(){
//   $.ajax({
//     url: 'http://demo.medianusamandiri.com/lightpos/API/data/',
//     type: 'GET'
//   }).done(function(obj){

//     db.transaction(function(t){
//       t.executeSql('DROP TABLE m_barang');
//       t.executeSql('CREATE TABLE IF NOT EXISTS m_barang (id_barang INT PRIMARY KEY NOT NULL, nama_barang VARCHAR(200) NOT NULL, harga_jual DOUBLE, kategori INT)');
//     })

//     for (var i = 0; i < obj.length; i++) {
//       // var harga = obj[i].harga.split('-');
//       var insert = function(id_barang, nama_barang, harga_jual, kategori){
//         db.transaction(function(t){
//           t.executeSql('INSERT INTO m_barang VALUES (?,?,?,?)', [id_barang, nama_barang, harga_jual, kategori], function(t, success){}, 
//             function(error){
//               console.log(error.message);
//             })
//         })
//       }(obj[i].id_barang, obj[i].nama_barang, obj[i].harga.split('-')[0], obj[i].tipe);
//     }
//   }).fail(function(a,b,error){
//     alert(error);
//   }).always(function(){
//     tampilFood();
//     tampilBvrg();
//   })
// }

// function checkUpdates(){
//   $.ajax({
//     url: 'http://demo.medianusamandiri.com/lightpos/API/menu/',
//     type: 'GET'
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
//     url: 'http://demo.medianusamandiri.com/lightpos/API/combo/',
//     type: 'GET'
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

function initMenu(){
  $.ajax({
    url: 'http://demo.medianusamandiri.com/lightpos/API/menu/'+cpyProf.id_outlet+'/',
    type: 'GET'
  }).done(function(obj){
    db.transaction(function(t){
      t.executeSql('DROP TABLE m_barang');
      t.executeSql('CREATE TABLE IF NOT EXISTS m_barang (id_barang INT PRIMARY KEY NOT NULL, nama_barang VARCHAR(200) NOT NULL, harga_jual DOUBLE, kategori INT)');
    })

    for (var i = 0; i < obj.length; i++) {
      if(cpyProf.id_cabang == obj[i].id_cabang && cpyProf.id_client == obj[i].id_client){
        var insert = function(id_barang, nama_barang, harga_jual, kategori){
          db.transaction(function(t){
            t.executeSql('INSERT INTO m_barang VALUES (?,?,?,?)', [id_barang, nama_barang, harga_jual, kategori], function(t, success){}, 
              function(error){
                console.log(error);
              })
          })
        }(obj[i].id_barang, obj[i].nama_barang, obj[i].harga.split('-')[0], 1);
      }
    }
  }).fail(function(a,b,error){
    alert(error);
  }).always(function(){
    tampilFood();
    tampilBvrg();
  })
}

function initCombo(){
  $.ajax({
    url: 'http://demo.medianusamandiri.com/lightpos/API/combo/',
    type: 'GET'
  }).done(function(obj){

    db.transaction(function(t){
      t.executeSql('DROP TABLE m_combo');
      t.executeSql('DROP TABLE combo_dtl');

      t.executeSql('CREATE TABLE IF NOT EXISTS m_combo (id_combo INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, nama_combo VARCHAR(20), harga_jual INT)');
      t.executeSql('CREATE TABLE IF NOT EXISTS combo_dtl (id_dtl INTEGER PRIMARY KEY AUTOINCREMENT, id_combo INTEGER, id_barang INTEGER)');
    }, function(error){
      console.log(error);
    }, function(){

      for (var i = 0; i < obj.length; i++) {
        if(obj[i].id_client == cpyProf.id_client){
          var insert = function(id_combo, nama_combo, harga){
            db.transaction(function(t){
              t.executeSql('INSERT INTO m_combo VALUES (?,?,?)', [id_combo, nama_combo, harga], function(t, success){}, 
                function(error){
                  console.log(error.message);
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
                  console.log(error.message);
                })
            })
          }(obj[i].id_combo, obj[i].id_barang);
        }
      }

    })
    
  }).fail(function(a,b,error){
    alert(error);
  }).always(function(){
    tampilCombo();
  })
}

function uploadPenjualan(){
  db.transaction(function(tx){
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
          }

          console.log(temp);

          $.ajax({
            url: 'http://demo.medianusamandiri.com/lightpos/API/data/',
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
        console.log(error.message);
      })
  })
}

function updatePj(idpj){
  db.transaction(function(tx){
    tx.executeSql('UPDATE pj SET st = 0 WHERE id_pj = ?', [idpj]);
  })
}

function updatePj2(){
  db.transaction(function(tx){
    tx.executeSql('UPDATE pj SET st = 0 WHERE st = 1');
  })
}

function cariSesuatu(a, b, c){
  var data = {
    'jenis_cari' : a,
    'tgl' : b,
    'tglsd' : c
  }

  $.ajax({
    url: 'http://demo.medianusamandiri.com/lightpos/API/cari/',
    method: 'POST',
    data: JSON.stringify(data)
  }).done(function(result){
    console.log(result);
  }).fail(function(a,b,error){
    console.log(error);
  })
}

function cariLaporan(){
  var a = 2;
  var b = document.getElementById('tgl_awal');
  var c = document.getElementById('tgl_akhir');
  var jenis;
  var datanya =   '<table>\
  <thead>\
  <tr>\
  <th class="label-cell">No. Penjualan</th>\
  <th>Tanggal Penjualan</th>\
  <th class="numeric-cell">Total Penjualan</th>\
  <th>Jenis Pembayaran</th>\
  </tr>\
  </thead>\
  <tbody>';
  
  var data = {
    'jenis_cari' : a,
    'tgl' : b.value,
    'tglsd' : c.value
  }

  $.ajax({
    url: 'http://demo.medianusamandiri.com/lightpos/API/cari/',
    method: 'POST',
    data: JSON.stringify(data)
  }).done(function(result){
    for(var i = 0; i < result.length; i++){
      switch (result[i].jenis_bayar){
        case '1':
        jenis = 'Tunai';
        break;
        case '2':
        jenis = 'Kartu Kredit';
        break;
        case '3':
        jenis = 'E-Money';
        break;
      }

      if(i == 0){
        datanya += '<tr><td class="label-cell">'+result[i].no_penjualan+'</td><td>'+result[i].tgl_penjualan+'</td><td class="numeric-cell">'+parseInt(result[i].total_jual).toLocaleString('id-ID')+'</td><td>'+jenis+'</td></tr>';
      }else if(result[i].no_penjualan != result[i-1].no_penjualan){
        datanya += '<tr><td class="label-cell">'+result[i].no_penjualan+'</td><td>'+result[i].tgl_penjualan+'</td><td class="numeric-cell">'+parseInt(result[i].total_jual).toLocaleString('id-ID')+'</td><td>'+jenis+'</td></tr>';
      }
    }

    datanya += '</tbody></table>';
    $('#table_penjualan').html(datanya);


  }).fail(function(a,b,error){
    console.log(error);
  })
}

function sendPing(){
  cekStatus();

  var d = new Date();

  var mo = ('0' + (d.getMonth()+1)).slice(-2);
  var dy = ('0' + d.getDate()).slice(-2);
  var hr = ('0' + d.getHours()).slice(-2);
  var mn = ('0' + d.getMinutes()).slice(-2);
  var sc = ('0' + d.getSeconds()).slice(-2);

  var tgls = d.getFullYear() + '-' + mo + '-' + dy + ' ' + hr + ':' + mn + ':' + sc;
  console.log(tgls);

  var stamp = {
    'tgl_log' : tgls
  }

  $.ajax({
    url: 'http://demo.medianusamandiri.com/lightpos/API/log/',
    method: 'POST',
    data: JSON.stringify(stamp)
  }).done(function(result){
    console.log(result);
    setTimeout(function(){
      sendPing();
    }, 300 * 1000);
  }).fail(function(a,b,error){
    console.log(error);
  })
}

function cekUUID(){
  alert('Nomor ID device: '+device.uuid);
}

function cekStatus(){
  console.log('cekstatus in:');
  $.ajax({
    url: 'http://demo.medianusamandiri.com/lightpos/API/status/',
    method: 'GET',
  }).done(function(result){
    console.log('cekstatus ajax');
    var c = 0;
    
    $.each(result, function(i,j){
      if(j.nomor_device == device.uuid){
        switch(j.kode){
          case 'A':
          console.log('tambahBarang');
          tambahBarang(j.id_barang, j.jenis_ubah);
          c++;
          break;

          case 'B':
          console.log('updateMenu');
          updateMenu(j.id_menu, j.jenis_ubah);
          c++;
          break;

          case 'C':
          console.log('updateCombo');
          updateCombo(j.id_combo, j.jenis_ubah);
          c++;
          break;

          case 'D':
          console.log('updateHarga');
          updateHarga(j.id_harga, j.jenis_ubah);
          c++;
          break;
        }
      }
    })
    updates = c;
  })
}

function tambahBarang(j, ubah){

  uploadStatus('A', ubah);

  $.ajax({
    url: 'http://demo.medianusamandiri.com/lightpos/API/data/',
    method: 'GET'
  }).done(function(result){
    for(var i = 0; i < result.length; i++){
      if(result[i].id_barang != j) continue;

      var a = function(id_barang, nama_barang, harga, tipe){
        db.transaction(function(tx){
          tx.executeSql('INSERT INTO m_barang VALUES (?,?,?,?)', [id_barang, nama_barang, harga, tipe]);
        }) 
      }(result[i].id_barang, result[i].nama_barang, result[i].harga.split('-')[0], result[i].tipe)
    }
  })
}

function updateMenu(j, ubah){

  uploadStatus('B', ubah);

  $.ajax({
    url: 'http://demo.medianusamandiri.com/lightpos/API/data/',
    method: 'GET'
  }).done(function(result){
    for(var i = 0; i < result.length; i++){
      if(result[i].id_barang != j) continue;

      var a = function(id_barang, nama_barang, harga){
        db.transaction(function(tx){
          tx.executeSql('UPDATE m_barang SET nama_barang = ?, harga_jual = ? WHERE id_barang = ?', [nama_barang, harga, id_barang, '1']);
        }) 
      }(result[i].id_barang, result[i].nama_barang, result[i].harga.split('-')[0])
    }
  })
}

function updateCombo(j, ubah){

  uploadStatus('C', ubah);

  $.ajax({
    url: 'http://demo.medianusamandiri.com/lightpos/API/data/',
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
  })
}

function updateHarga(j, ubah){

  uploadStatus('D', ubah);

  $.ajax({
    url: 'http://demo.medianusamandiri.com/lightpos/API/data/',
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
}

function uploadStatus(kode, jenis_ubah){
  var temp = {
    'jnotif' : jenis_ubah,
    'no_device' : device.uuid,
    'kode' : kode,
    'id_client' : cpyProf.id_client

    // TODO: kirim status update beserta id_client
  }

  $.ajax({
    url: 'http://demo.medianusamandiri.com/lightpos/API/status/',
    method: 'POST',
    data: JSON.stringify(temp)
  }).done(function(result){
    console.log(result);
  })
}

function register(q){
  $('#register_button').addClass('disabled');
  var temp = {
    'device' : device.uuid
  };

  $.each($(q).serializeArray(), function(){
    temp[this.name] = this.value;
  })

  $.ajax({
    url: 'http://demo.medianusamandiri.com/lightpos/API/daftar/',
    method: 'POST',
    data: JSON.stringify(temp),
    timeout: 10000
  }).always(function(result){
    $('#register_button').removeClass('disabled');
    console.log(result);

    if(result.responseText.slice(0, 1) == '0'){
      app.dialog.alert('Sukses mendaftar!', 'Register', function(){
        $('#register_cred').trigger('reset');
        app.views.main.router.navigate('/login/');
        $('#userlogin').val(temp.user);
        $('#passlogin').val(temp.pass);
      })
    } else {
      alert('Sudah Terdaftar');
    }
  })

  console.log(temp);      
}

/*
status => 2,  Silahkan Konfirmasi Register di Email Anda
status => 3, Data Anda Sudah Terdaftar, silahkan upgrade Premium
status => 4,  Data Anda Sudah Terdaftar, dengan status premium
*/