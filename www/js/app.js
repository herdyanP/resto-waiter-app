// Dom7
//var $$ = Dom7;
// sudo cordova build android --release -- --keystore=lightpos.keystore --storePassword=bismillah --alias=lightpos --password=bismillah
var $$ = Dom7;

// Theme
var theme = 'auto';
if (document.location.search.indexOf('theme=') >= 0) {
  theme = document.location.search.split('theme=')[1].split('&')[0];
}

// Init App
var app = new Framework7({
  id: 'com.medianusamandiri.LightPOS',
  root: '#app',
  init: false,
  theme: theme,
  panel: {
    swipe: 'left'
  },
  routes: routes,
});

// JS SCRIPT SEMENTARA DISINI DULU YAKKK...
// NYOBA TEMPLATING

var db;
var shortMonths = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
var mtd = 1;
var txNmr = 0;
var retail;
var cabang;
var lastId;
var user = 'user testing';

// var mainView = app.views.main;
// var chart = Highcharts.chart('container1', {});

Highcharts.setOptions({
  lang: {
    months: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"],
    shortMonths: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"],
    weekdays: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]
  }
})

document.addEventListener('deviceready', function() {
  screen.orientation.lock('portrait');

  db = window.sqlitePlugin.openDatabase({
    name: 'LightPOS.db',
    location: 'default',
  });

  db.transaction(function(transaction) {
    var executeQuery = "DELETE FROM pj_dtl_tmp";
    transaction.executeSql(executeQuery, [],
      function(tx, result) {},
      function(error){});
  });

  db.transaction(function(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS m_barang (id_barang INT PRIMARY KEY NOT NULL, kode_barang VARCHAR(20)  NOT NULL,nama_barang VARCHAR(200) NOT NULL, harga_jual DOUBLE, kategori INT)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS pj (id_pj INTEGER PRIMARY KEY AUTOINCREMENT, no_penjualan VARCHAR(30), no_faktur VARCHAR(30), tgl_penjualan DATE, jenis_jual int, jenis_bayar int, id_customer int, id_user  int, stamp_date datetime, disc_prs double, disc_rp double, sc_prs double, sc_rp double, ppn double, total_jual double, grantot_jual double, bayar_tunai double, bayar_card double, nomor_kartu varchar, ref_kartu varchar, kembali_tunai double, void_jual varchar, no_meja int, ip varchar,   id_gudang int, pl_retail text, meja int, st int)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS pj_dtl (id_dtl_jual int, id_pj int, id_barang int, qty_jual double, harga_jual double, discprs double, discrp double, dtl_total double, harga_jual_cetak double, user int, dtpesan datetime, ready int default 0)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS pj_dtl_tmp (id_tmp INTEGER PRIMARY KEY AUTOINCREMENT,id_barang INT NOT NULL UNIQUE, qty INT  NOT NULL,total DOUBLE, harga DOUBLE,nama_barang VARCHAR(20) NOT NULL)');

    tx.executeSql('INSERT INTO m_barang VALUES (?,?,?,?,?)', ['1', 'B00001','AYAM GORENG KALASAN','15000', '1']);
    tx.executeSql('INSERT INTO m_barang VALUES (?,?,?,?,?)', ['2', 'B00002','AYAM OPOR','20000', '1']);
    tx.executeSql('INSERT INTO m_barang VALUES (?,?,?,?,?)', ['3', 'B00003','AYAM RENDANG','20000', '1']);
    tx.executeSql('INSERT INTO m_barang VALUES (?,?,?,?,?)', ['4', 'B00004','AYAM SAUCE LADA HITAM','20000', '1']);
    tx.executeSql('INSERT INTO m_barang VALUES (?,?,?,?,?)', ['5', 'B00005','IKAN BAKAR SAMBAL MATA','20000', '1']);
    tx.executeSql('INSERT INTO m_barang VALUES (?,?,?,?,?)', ['6', 'B00006','IKAN WOKU BELANGA','20000', '1']);
    tx.executeSql('INSERT INTO m_barang VALUES (?,?,?,?,?)', ['7', 'B00007','SAPI SEMUR','20000', '1']);
    tx.executeSql('INSERT INTO m_barang VALUES (?,?,?,?,?)', ['8', 'B00008','SATE LILIT','20000', '1']);
    tx.executeSql('INSERT INTO m_barang VALUES (?,?,?,?,?)', ['9', 'B00009','SOTO AYAM','20000', '1']);
    tx.executeSql('INSERT INTO m_barang VALUES (?,?,?,?,?)', ['10', 'B00010','7UP','20000', '2']);
    tx.executeSql('INSERT INTO m_barang VALUES (?,?,?,?,?)', ['11', 'B00011','JUS JERUK','10000', '2']);
    tx.executeSql('INSERT INTO m_barang VALUES (?,?,?,?,?)', ['12', 'B00012','JUS ANGGUR MERAH','10000', '2']);
    tx.executeSql('INSERT INTO m_barang VALUES (?,?,?,?,?)', ['13', 'B00013','ABON AYAM','20000', '1']);
    tx.executeSql('INSERT INTO m_barang VALUES (?,?,?,?,?)', ['14', 'B00014','ABON IKAN','20000', '1']);
    tx.executeSql('INSERT INTO m_barang VALUES (?,?,?,?,?)', ['15', 'B00015','ABON SAPI','20000', '1']);
    tx.executeSql('INSERT INTO m_barang VALUES (?,?,?,?,?)', ['16', 'B00016','ADAS MANIS','20000', '1']);
    tx.executeSql('INSERT INTO m_barang VALUES (?,?,?,?,?)', ['17', 'B00017','ADAS PEDAS','20000', '1']);
  }, 
  function(error) {}, 
  function() {});

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

  tampilFood();
  tampilBvrg();
});

// function tampilFood(){
//   db.transaction(function(tx) {
//     tx.executeSql('SELECT * FROM m_barang WHERE kategori = "1" ORDER BY nama_barang ASC', [], function(tx, rs) {
//       var len = rs.rows.length, i;
//       var all_rows = [];
//       var datanya = '<ul>';
//       for (i = 0; i < len; i++){
//         datanya += '<li>\
//         <a href="#" onclick="simpan('+rs.rows.item(i).id_barang+','+1+','+rs.rows.item(i).harga_jual+',\''+rs.rows.item(i).nama_barang+'\')" class="item-link item-content ">\
//         <div class="item-inner">\
//         <div class="item-title">'+rs.rows.item(i).nama_barang+'</div>\
//         </div>\
//         </a>\
//         </li>'
//       }

//       datanya += '</ul>';
//       $('#foodlist').html(datanya);
//     }, function(tx, error) {
//       alert('SELECT error: ' + error.message);
//     });
//   });
// }

// function tampilBvrg(){
//   db.transaction(function(tx) {
//     tx.executeSql('SELECT * FROM m_barang WHERE kategori = "2" ORDER BY nama_barang ASC', [], function(tx, rs) {
//       var len = rs.rows.length, i;
//       var all_rows = [];
//       var datanya = '<ul>';
//       for (i = 0; i < len; i++){
//         datanya += '<li>\
//         <a href="#" onclick="simpan('+rs.rows.item(i).id_barang+','+1+','+rs.rows.item(i).harga_jual+',\''+rs.rows.item(i).nama_barang+'\')" class="item-link item-content ">\
//         <div class="item-inner">\
//         <div class="item-title">'+rs.rows.item(i).nama_barang+'</div>\
//         </div>\
//         </a>\
//         </li>'
//       }

//       datanya += '</ul>';
//       $('#bvrglist').html(datanya);
//     }, function(tx, error) {
//       alert('SELECT error: ' + error.message);
//     });
//   });
// }

function kodeBarang(id){
  var q = 'B';
  for(var i = 0; i < 5 - id.toString().length; i++){
    q += '0';
  }

  return q+id;
}

function tampilFood(){
  db.transaction(function(tx) {
    tx.executeSql('SELECT * FROM m_barang WHERE kategori = "1" ORDER BY nama_barang ASC', [], function(tx, rs) {
      var len, i;
      if(rs.rows.length > 20) {
        len = 20
      } else {
        len = rs.rows.length
      }

      var all_rows = [];
      var datanya = '';
      for (i = 0; i < len; i++){

        datanya += '<div onclick="simpan('+rs.rows.item(i).id_barang+','+1+','+rs.rows.item(i).harga_jual+',\''+rs.rows.item(i).nama_barang+'\')" class="col-33" style="height: 100px;\"><p style="margin: unset; position: relative; top: 50%; transform: translateY(-50%);">'+rs.rows.item(i).nama_barang+'</p></div>';
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
    tx.executeSql('SELECT * FROM m_barang WHERE kategori = "1" AND nama_barang LIKE "%'+q+'%" ORDER BY nama_barang ASC', [], 
      function(tx, rs){
        var len = rs.rows.length, i;
        var all_rows = [];
        var datanya = '';
        for (i = 0; i < len; i++){

          datanya += '<div onclick="simpan('+rs.rows.item(i).id_barang+','+1+','+rs.rows.item(i).harga_jual+',\''+rs.rows.item(i).nama_barang+'\')" class="col-33" style="height: 100px;\"><p style="margin: unset; position: relative; top: 50%; transform: translateY(-50%);">'+rs.rows.item(i).nama_barang+'</p></div>';
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
  db.transaction(function(tx) {
    tx.executeSql('SELECT * FROM m_barang WHERE kategori = "2" ORDER BY nama_barang ASC', [], function(tx, rs) {
      var len, i;
      if(rs.rows.length > 20) {
        len = 20
      } else {
        len = rs.rows.length
      }

      var all_rows = [];
      var datanya = '';
      for (i = 0; i < len; i++){

        datanya += '<div onclick="simpan('+rs.rows.item(i).id_barang+','+1+','+rs.rows.item(i).harga_jual+',\''+rs.rows.item(i).nama_barang+'\')" class="col-33" style="height: 100px;\"><p style="margin: unset; position: relative; top: 50%; transform: translateY(-50%);">'+rs.rows.item(i).nama_barang+'</p></div>';
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
    tx.executeSql('SELECT * FROM m_barang WHERE kategori = "2" AND nama_barang LIKE "%'+q+'%" ORDER BY nama_barang ASC', [], 
      function(tx, rs){
        var len = rs.rows.length, i;
        var all_rows = [];
        var datanya = '';
        for (i = 0; i < len; i++){

          datanya += '<div onclick="simpan('+rs.rows.item(i).id_barang+','+1+','+rs.rows.item(i).harga_jual+',\''+rs.rows.item(i).nama_barang+'\')" class="col-33" style="height: 100px;\"><p style="margin: unset; position: relative; top: 50%; transform: translateY(-50%);">'+rs.rows.item(i).nama_barang+'</p></div>';
          // datanya += '<div onclick="simpan('+rs.rows.item(i).id_barang+','+1+','+rs.rows.item(i).harga_jual+',\''+rs.rows.item(i).nama_barang+'\')" class="col-33" style="height: 100px;text-align:left;\"><br><br><br>'+rs.rows.item(i).nama_barang+'<br><strong>Rp. '+parseInt(rs.rows.item(i).harga_jual).toLocaleString('id-ID')+'</strong></div>';
        }

        datanya += '<div class="col-33" style="height: 100px; visibility: hidden;\"><p style="margin: unset; position: relative; top: 50%; transform: translateY(-50%);">NIL</p></div>';

        $('#bvrglist').html(datanya);
      }, function(tx, error){
        alert('SELECT error: ' + error.message);
      })
  })
}

function simpan(a,b,c,d){
  // app.toast.create({text: a+', '+b+', '+c+', '+d, closeTimeout: 2000, closeButton: true, destroyOnClose: true}).open();
  db.transaction(function(transaction) {
    var c1=0;
    var qty=0;
    transaction.executeSql('SELECT count(*) as c, qty, harga FROM pj_dtl_tmp where id_barang=?', [a], function(tx, rs) {
      if(rs.rows.item(0).c<1){
        var executeQuery = "INSERT INTO pj_dtl_tmp (id_barang, qty,total,nama_barang,harga) VALUES (?,?,?,?,?)";
        transaction.executeSql(executeQuery, [a,b,c,d,c]
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

function keranjang(a,b,c,d){
  var data = '<ul>'
  var jumlah = 0;
  db.transaction(function(tx) {
    tx.executeSql('SELECT * FROM pj_dtl_tmp', [], function(tx, rs) {
      var len = rs.rows.length;
      var all_rows = [];
      for (i = 0; i < len; i++){
        data += '<li class="item-content ">\
        <div class="item-inner">\
        <div class="item-title">'+rs.rows.item(i).nama_barang+'\
        <div class="item-footer">'+rs.rows.item(i).qty+' x '+rs.rows.item(i).harga+'</div>\
        </div>\
        <div class="item-after"><a href="#" onclick="pilihHapus('+rs.rows.item(i).id_tmp+','+rs.rows.item(i).qty+', \'1\')"><i class="icon material-icons md-only">remove_shopping_cart</i></a></div>\
        </div>\
        </li>'
        // data+="<li class=\"swipeout deleted-callback\" data-id=\""+rs.rows.item(i).id_tmp+"\"><div class=\"item-content swipeout-content\"><div class=\"item-inner\"><div class=\"item-title\"><div class=\"item-header\">"+rs.rows.item(i).nama_barang+"</div>"+rs.rows.item(i).total.toLocaleString()+"</div><div>"+rs.rows.item(i).qty+"</div></div></div><div class=\"swipeout-actions-right\"><a href=\"#\" onclick=\"hapusKeranjang('"+rs.rows.item(i).id_tmp+"')\" class=\"swipeout-delete\">Delete</a></div></li>";
        jumlah += parseInt(rs.rows.item(i).qty * rs.rows.item(i).harga) * 1.1;
      }

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

function pilihHapus(a, b, c){
  if(b > 1) {
    hapusSatu(a, c)
  } else {
    hapusKeranjang(a, c)
  }
}

function hapusSatu(a, c){
  if(c == '1'){
    db.transaction(function(t){
      t.executeSql('UPDATE pj_dtl_tmp SET qty = qty - 1 WHERE id_tmp = ?', [a], 
        function(tx, result){
          keranjang("a","b","c","d");
        }, function(error){
          alert(error);
          // app.dialog.alert('Item Gagal Dihapus');
          // keranjang("a","b","c","d");
        })
    })
  } else {
    db.transaction(function(t){
      t.executeSql('UPDATE pj_dtl_tmp SET qty = qty - 1 WHERE id_tmp = ?', [a], 
        function(tx, result){
          comboItems("a","b","c","d");
        }, function(error){
          alert(error);
          // app.dialog.alert('Item Gagal Dihapus');
          // keranjang("a","b","c","d");
        })
    })
  }
}

function hapusKeranjang(a, c){
  var b = a;
  if(c == '1'){
    db.transaction(function(transaction) {
      var executeQuery = "DELETE FROM pj_dtl_tmp where id_tmp = ?";
      transaction.executeSql(executeQuery, [b],
        function(tx, result) {
          keranjang("a","b","c","d");
        });
    });
  } else {
    db.transaction(function(transaction) {
      var executeQuery = "DELETE FROM pj_dtl_tmp where id_tmp = ?";
      transaction.executeSql(executeQuery, [b],
        function(tx, result) {
          comboItems("a","b","c","d");
        });
    });
  }
}

function metode(a){
  mtd = a;
  if(a == '1'){
    $('.bayar-tunai').css('display', 'block');
    $('.bayar-card').css('display', 'none');
  } else if(a == '2'){
    $('.bayar-tunai').css('display', 'none');
    $('.bayar-card').css('display', 'block');
  }
}

function bayar(){
  var list = '';
  app.dialog.create({
    title: 'Konfirmasi',
    text: 'Cetak receipt via:',
    buttons: [{
      text: 'Cetak',
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
            db.transaction(function(tx){
              tx.executeSql('SELECT * FROM pj_dtl_tmp', [], 
                function(t, rs){
                  var dt = new Date();
                  var paid = $('#bayar').val().replace(/\D/g, '');
                  var tot = $('#subtotal').html();
                  var totInt = tot.replace(/\D/g, '');
                  var kembali = parseInt(paid) - parseInt(totInt);

                  var dy = ('00'+dt.getDate()).slice(-2);
                  var hr = ('00'+dt.getHours()).slice(-2);
                  var mn = ('00'+dt.getMinutes()).slice(-2);

                  var sub = 'Sub-total';
                  var byr = 'Tunai';
                  var crd = 'CC';
                  var kbl = 'Kembali';

                  var header = '```         Sales Receipt\n\n--------------------------------\nNo. Trans : '+nomor()+'\nTanggal   : '+dy+' '+shortMonths[dt.getMonth()]+' '+dt.getFullYear()+', '+hr+':'+mn+'\nUser      : '+user+'\n--------------------------------\n';
                  var thanks = '       Terima Kasih Atas\n        Kunjungan Anda\n'

                  for(var i = 0; i < 23-tot.length; i++){
                    sub += ' ';
                  } sub += tot + '\n';

                  for(var i = 0; i < 30-tot.length; i++){
                    crd += ' ';
                  } crd += tot + '\n';

                  for(var i = 0; i < 27-parseInt(paid).toLocaleString().length; i++){
                    byr += ' ';
                  } byr += parseInt(paid).toLocaleString('id-ID') + '\n';

                  for(var i = 0; i < 25-parseInt(kembali).toLocaleString().length; i++){
                    kbl += ' ';
                  } kbl += parseInt(kembali).toLocaleString('id-ID');
                  
                  for(var i = 0; i < rs.rows.length; i++){
                    var ws = '';
                    var satuan = parseInt(rs.rows.item(i).harga).toLocaleString('id-ID');
                    var jumlah = (parseInt(rs.rows.item(i).harga) * parseInt(rs.rows.item(i).qty)).toLocaleString('id-ID');

                    for(var j = 0; j < 27 - satuan.length - jumlah.length; j++){
                      ws += ' ';
                    }

                    list += rs.rows.item(i).nama_barang+'\n  '+rs.rows.item(i).qty+' x '+parseInt(rs.rows.item(i).harga)+ws+(parseInt(rs.rows.item(i).harga) * parseInt(rs.rows.item(i).qty)).toLocaleString('id-ID')+'\n';
                  }

                  list += '--------------------------------\n';

                  window.location = 'https://wa.me/62'+result+'?text='+encodeURI(header + list + sub + byr + kbl + '```');
                }, function(t, error){
                  alert('error')
                })
            })
          }
        }, function(){})
        // alert('dua');
        // console.log('dua');
      }
    }]
  }).open();
  // navigator.notification.confirm('Pilih metode untuk receipt:', function(buttonIndex){
  //   if(buttonIndex == '3'){
      // db.transaction(function(tx){
      //   tx.executeSql('SELECT * FROM pj_dtl_tmp', [], 
      //     function(t, rs){
      //       for(var i = 0; i < rs.rows.length; i++){
      //         var ws = '';
      //         var satuan = parseInt(rs.rows.item(i).harga).toLocaleString('id-ID');
      //         var jumlah = (parseInt(rs.rows.item(i).harga) * parseInt(rs.rows.item(i).qty)).toLocaleString('id-ID');

      //         for(var j = 0; j < 27 - satuan.length - jumlah.length; j++){
      //           ws += ' ';
      //         }

      //         list += '{left}'+rs.rows.item(i).nama_barang+'{br}  '+rs.rows.item(i).qty+' x '+parseInt(rs.rows.item(i).harga)+ws+(parseInt(rs.rows.item(i).harga) * parseInt(rs.rows.item(i).qty)).toLocaleString('id-ID')+'{br}';
      //       }

      //       list += '--------------------------------{br}{left}';
      //       txNmr = nomor();

      //       connectToPrinter(list);
      //     }, function(t, error){
      //       alert('error')
      //     })
      // })
  //   } else {
  //     navigator.notification.prompt('Masukkan nomor WhatsApp (+62):', function(results){
  //       if(results.buttonIndex == '1'){
  //         window.location = 'https://wa.me/62'+results.input1+'?text='+encodeURI('Abc \n Def \n *Ghi*');
  //       } else {
  //         return;
  //       }
  //     }, 'Konfirmasi')
  //   }
  // }, 'Konfirmasi', ['WhatsApp', '', 'Cetak']);
  // app.dialog.prompt('Nomor meja:', 'Konfirmasi', 
  //         function(nomor){
  //           if(arr.includes(parseInt(nomor))){
  //             app.toast.create({text: 'Meja dipilih sedang terpakai. Mohon pilih meja lain.', closeButton: true, destroyOnClose: true}).open();
  //             return;
  //           }else {
  //             nomormeja = parseInt(nomor);
  //             app.toast.create({text: 'Sukses meja '+nomormeja, closeTimeout: 2000, destroyOnClose: true}).open();
  //           }
  //         },
  //         function(){
  //           app.toast.create({text: 'Batal', closeTimeout: 2000}).open()
  //         });
        // window.location = 'https://wa.me/6285854633291?text='+encodeURI(list);
  // db.transaction(function(tx){
  //   tx.executeSql('SELECT * FROM pj_dtl_tmp', [], 
  //     function(t, rs){
  //       for(var i = 0; i < rs.rows.length; i++){
  //         var ws = '';
  //         var satuan = parseInt(rs.rows.item(i).harga).toLocaleString('id-ID');
  //         var jumlah = (parseInt(rs.rows.item(i).harga) * parseInt(rs.rows.item(i).qty)).toLocaleString('id-ID');

  //         for(var j = 0; j < 27 - satuan.length - jumlah.length; j++){
  //           ws += ' ';
  //         }

  //         list += '{left}'+rs.rows.item(i).nama_barang+'{br}  '+rs.rows.item(i).qty+' x '+parseInt(rs.rows.item(i).harga)+ws+(parseInt(rs.rows.item(i).harga) * parseInt(rs.rows.item(i).qty)).toLocaleString('id-ID')+'{br}';
  //       }

  //       list += '--------------------------------{br}{left}';
  //       txNmr = nomor();

  //       connectToPrinter(list);
  //       // ordernya();
  //     }, function(t, error){
  //       alert('error')
  //     })
  // })
}

function nomor(){
  var d = new Date();
  var inc=(parseInt(window.localStorage.getItem("inctrx")) + 1);
  var str = ""+inc;
  var gud = ""+1;
  var pad = "0000";
  var pad1 = "000";

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

  var nomornya=d.getFullYear()+""+(d.getMonth()+1)+""+d.getDate()+""+ans1+""+ans;
  window.localStorage.setItem("inctrx",inc);
  return nomornya;
}

function ordernya(kembali, subTot, uang){
  var qty = 0;
  var d = new Date();
  var tgl = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+("0" + d.getDate()).slice(-2);
  var tgltime = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+("0" + d.getDate()).slice(-2)+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
  // var uang = 0;
  // var subTot = parseInt($('#subtotal').html().replace(/\D/g, ''));

  if(mtd != '1') {
    kembali = 0;
    uang = 0;
  }
  
  db.transaction(function(transaction) {
    var executeQuery = "INSERT INTO pj (no_penjualan, no_faktur, tgl_penjualan, jenis_jual, id_user, stamp_date, no_meja, id_gudang, meja, st, total_jual, grantot_jual, bayar_tunai, bayar_card, kembali_tunai) \
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    transaction.executeSql(executeQuery, [txNmr, txNmr, tgl, '1', '1', tgltime, '0', '1', '1', '1', subTot, subTot * 1.1, uang, subTot, kembali], 
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
  for (var i = 0; i < a.length; i++) {
    var insert = function(id_pj, id_barang, qty_jual, harga_jual, discprs, discrp, dtl_total, harga_jual_cetak, user, dtpesan, id_tmp){
      db.transaction(function(t){
        t.executeSql('SELECT COUNT(*) c FROM pj_dtl WHERE id_pj = ? AND id_barang = ?', [id_pj, id_barang], 
          function(t, result){
            if(result.rows.item(0).c < 1){
              db.transaction(function(transaction) {
                var executeQuery = "INSERT INTO pj_dtl (id_pj, id_barang, qty_jual, harga_jual, discprs, discrp, dtl_total, harga_jual_cetak, user, dtpesan) VALUES (?,?,?,?,?,?,?,?,?,?)";
                transaction.executeSql(executeQuery, [id_pj, id_barang, qty_jual, harga_jual, discprs, discrp, dtl_total, harga_jual_cetak, user, dtpesan], 
                  function(tx, result) {
                    hapusKeranjang(id_tmp);
                  },
                  function(error){
                    alert('Error occurred'); 
                  })
              });
            } else{
              db.transaction(function(transaction) {
                var executeQuery = "UPDATE pj_dtl SET qty_jual = qty_jual + ?, dtl_total = dtl_total + ? WHERE id_pj = ? AND id_barang = ?";
                transaction.executeSql(executeQuery, [qty_jual, dtl_total, id_pj, id_barang], 
                  function(tx, result) {
                    hapusKeranjang(id_tmp);
                  }, 
                  function(error){
                    alert('Error occured');
                  })
              });
            }
          }, function(error){})
      })
    }(a[i].idpj, a[i].id_barang, a[i].qty, a[i].harga, "0", "0", a[i].total, a[i].harga, "1", tgltime, a[i].id_tmp)
  }
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
  var paid = $('#bayar').val().replace(/\D/g, '');
  var kembali = parseInt(paid) - parseInt(totInt);
  var dt = new Date();

  var header = '{br}{center}{h}LightPOS{/h}{br}Sales Receipt{br}--------------------------------{br}';
  var subheader = '{left}No.Trans : '+txNmr+'{br}Tanggal  : '+dt.getDate()+' '+shortMonths[dt.getMonth()]+' '+dt.getFullYear()+', '+dt.getHours()+':'+dt.getMinutes()+'{br}--------------------------------{br}';
  var thanks = '{br}{center}Terima Kasih Atas {br}Kunjungan Anda {br}{br}{br}'
  var sub = 'Sub-total';
  var byr = 'Tunai';
  var crd = 'CC';
  var kbl = 'Kembali';

  for(var i = 0; i < 23-tot.length; i++){
    sub += ' ';
  } sub += tot + '{br}';

  for(var i = 0; i < 30-tot.length; i++){
    crd += ' ';
  } crd += tot + '{br}';

  for(var i = 0; i < 27-parseInt(paid).toLocaleString().length; i++){
    byr += ' ';
  } byr += parseInt(paid).toLocaleString('id-ID') + '{br}';

  for(var i = 0; i < 25-parseInt(kembali).toLocaleString().length; i++){
    kbl += ' ';
  } kbl += parseInt(kembali).toLocaleString('id-ID');

  if(mtd == '1'){
    window.DatecsPrinter.printText(header + subheader + q + sub + byr + kbl +'{br}{br}' + thanks, 'ISO-8859-1', 
      function(){
        alert('success!');
        ordernya(kembali, totInt, paid);
      }, function() {
        alert(JSON.stringify(error));
      });
  }else if (mtd == '2'){
    window.DatecsPrinter.printText(header + subheader + q + sub + crd +'{br}{br}' + thanks, 'ISO-8859-1', 
      function(){
        alert('success!');
        ordernya(kembali, totInt, paid);
      }, function() {
        alert(JSON.stringify(error));
      });
  }
}

function test(){
  db.transaction(function(tx){
    tx.executeSql('SELECT b.no_penjualan, c.nama_barang, a.qty_jual FROM pj_dtl a JOIN pj b ON a.id_pj = b.id_pj JOIN m_barang c ON a.id_barang = c.id_barang', [], 
      function(t, result){
        var tes = 'Penjualan : \n';
        for(var i = 0; i < result.rows.length; i++){
          tes += result.rows.item(i).no_penjualan+' : '+result.rows.item(i).nama_barang+' '+result.rows.item(i).qty_jual+' item(s);\n';
        }

        console.log(tes);
        alert(tes);
      }, 
      function(error){
        console.log(error);
      })
  })
}

function tambahItem(el){
  var temp = {};
  var kategori;

  switch(el.id){
    case 'tambahFood':
    kategori = '1';
    break;

    case 'tambahBvrg':
    kategori = '2';
    break;

    case 'tambahCombo':
    kategori = '3';
    break
  }

  $.each($(el).serializeArray(), function(){
    temp[this.name] = this.value.toUpperCase();
  })

  db.transaction(function(tx){
    tx.executeSql('SELECT id_barang FROM m_barang ORDER BY id_barang DESC LIMIT 1', [], 
      function(q, rs){
        var lastId = parseInt(rs.rows.item(0).id_barang) + 1;
        var kode = kodeBarang(lastId);

        db.transaction(function(t){
          t.executeSql('INSERT INTO m_barang VALUES (?, ?, ?, ?, ?)', [lastId, kode, temp.nama_barang, temp.harga_jual, kategori], 
            function(qt, res){
              alert('success');
            },
            function(error){
              alert(error);
            })
        })
      })
  })
}

function allItems(){
  db.transaction(function(tx) {
    tx.executeSql('SELECT * FROM m_barang ORDER BY kategori, nama_barang ASC', [], function(tx, rs) {
      var len, i;
      if(rs.rows.length > 20) {
        len = 20
      } else {
        len = rs.rows.length;
      }

      var all_rows = [];
      var datanya = '';
      for (i = 0; i < len; i++){

        datanya += '<div onclick="simpanAsCombo('+rs.rows.item(i).id_barang+','+1+','+rs.rows.item(i).harga_jual+',\''+rs.rows.item(i).nama_barang+'\')" class="col-33" style="height: 100px;\"><p style="margin: unset; position: relative; top: 50%; transform: translateY(-50%);">'+rs.rows.item(i).nama_barang+'</p></div>';
        // datanya += '<div onclick="simpan('+rs.rows.item(i).id_barang+','+1+','+rs.rows.item(i).harga_jual+',\''+rs.rows.item(i).nama_barang+'\')" class="col-33" style="height: 100px;\"><br><br><br>'+rs.rows.item(i).nama_barang+'<br><strong>Rp. '+parseInt(rs.rows.item(i).harga_jual).toLocaleString('id-ID')+'</strong></div>';
      }

      datanya += '<div class="col-33" style="height: 100px; visibility: hidden;\"><p style="margin: unset; position: relative; top: 50%; transform: translateY(-50%);">NIL</p></div>';

      $('#item_list').html(datanya);
    }, function(tx, error) {
      alert('SELECT error: ' + error.message);
    });
  });
}

function searchAllItems(q){
  db.transaction(function(tx){
    tx.executeSql('SELECT * FROM m_barang WHERE nama_barang LIKE "%'+q+'%" ORDER BY kategori, nama_barang ASC', [], 
      function(tx, rs){
        var len = rs.rows.length, i;
        var all_rows = [];
        var datanya = '';
        for (i = 0; i < len; i++){

          datanya += '<div onclick="simpanAsCombo('+rs.rows.item(i).id_barang+','+1+','+rs.rows.item(i).harga_jual+',\''+rs.rows.item(i).nama_barang+'\')" class="col-33" style="height: 100px;\"><p style="margin: unset; position: relative; top: 50%; transform: translateY(-50%);">'+rs.rows.item(i).nama_barang+'</p></div>';
          // datanya += '<div onclick="simpan('+rs.rows.item(i).id_barang+','+1+','+rs.rows.item(i).harga_jual+',\''+rs.rows.item(i).nama_barang+'\')" class="col-33" style="height: 100px;text-align:left;\"><br><br><br>'+rs.rows.item(i).nama_barang+'<br><strong>Rp. '+parseInt(rs.rows.item(i).harga_jual).toLocaleString('id-ID')+'</strong></div>';
        }

        datanya += '<div class="col-33" style="height: 100px; visibility: hidden;\"><p style="margin: unset; position: relative; top: 50%; transform: translateY(-50%);">NIL</p></div>';

        $('#item_list').html(datanya);
      }, function(tx, error){
        alert('SELECT error: ' + error.message);
      })
  })
}

function simpanAsCombo(a,b,c,d){
  // app.toast.create({text: a+', '+b+', '+c+', '+d, closeTimeout: 2000, closeButton: true, destroyOnClose: true}).open();
  db.transaction(function(transaction) {
    var c1=0;
    var qty=0;
    transaction.executeSql('SELECT count(*) as c, qty, harga FROM pj_dtl_tmp where id_barang=?', [a], function(tx, rs) {
      if(rs.rows.item(0).c<1){
        var executeQuery = "INSERT INTO pj_dtl_tmp (id_barang, qty,total,nama_barang,harga) VALUES (?,?,?,?,?)";
        transaction.executeSql(executeQuery, [a,b,c,d,c]
          , function(tx, result) {
            comboItems(a,b,c,d);
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
            comboItems(a,b,c,d);
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

function comboItems(a,b,c,d){
  var data = '<ul>'
  var jumlah = 0;
  db.transaction(function(tx) {
    tx.executeSql('SELECT * FROM pj_dtl_tmp', [], function(tx, rs) {
      var len = rs.rows.length;
      var all_rows = [];
      for (i = 0; i < len; i++){
        data += '<li class="item-content ">\
        <div class="item-inner">\
        <div class="item-title">'+rs.rows.item(i).nama_barang+'\
        <div class="item-footer">'+rs.rows.item(i).qty+' x '+rs.rows.item(i).harga+'</div>\
        </div>\
        <div class="item-after"><a href="#" onclick="pilihHapus('+rs.rows.item(i).id_tmp+','+rs.rows.item(i).qty+', \'2\')"><i class="icon material-icons md-only">remove_shopping_cart</i></a></div>\
        </div>\
        </li>'
        // data+="<li class=\"swipeout deleted-callback\" data-id=\""+rs.rows.item(i).id_tmp+"\"><div class=\"item-content swipeout-content\"><div class=\"item-inner\"><div class=\"item-title\"><div class=\"item-header\">"+rs.rows.item(i).nama_barang+"</div>"+rs.rows.item(i).total.toLocaleString()+"</div><div>"+rs.rows.item(i).qty+"</div></div></div><div class=\"swipeout-actions-right\"><a href=\"#\" onclick=\"hapusKeranjang('"+rs.rows.item(i).id_tmp+"')\" class=\"swipeout-delete\">Delete</a></div></li>";
        jumlah += parseInt(rs.rows.item(i).qty * rs.rows.item(i).harga) * 1.1;
      }

      data += '</ul>';
      $('#combo_item').html(data);
      // $('#subtotal').html(jumlah.toLocaleString('id-ID'));
      // var ppn=jumlah*(10/100);
      // var gt=jumlah+ppn;
      // $('#ppn').html(ppn.toLocaleString());
      // $('#grandtot').html(gt.toLocaleString());
    }, function(tx, error) {
      alert('SELECT error: ' + error.message);
    });
  });
}

function comma(el){
  if(el.value == '') el.value = 0;
  el.value = parseInt((el.value).replace(/\D/g, '')).toLocaleString('id-ID');
}

function emptyDB(){
  db.transaction(function(t){
    t.executeSql("DELETE FROM pj_dtl_tmp", [],
      function(){
        keranjang('a', 'b', 'c', 'd');
        comboItems('a', 'b', 'c', 'd');
      })
  })
}