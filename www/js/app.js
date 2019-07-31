// Dom7
//var $$ = Dom7;
var $ = Dom7;

// Theme
var theme = 'auto';
if (document.location.search.indexOf('theme=') >= 0) {
  theme = document.location.search.split('theme=')[1].split('&')[0];
}

// Init App
var app = new Framework7({
  id: 'io.framework7.testapp',
  root: '#app',
  init: false,
  theme: theme,
  on: {
    init: function(){
      // listMeja();
      checkOrientation();
    }
  },
  routes: routes,
});

// JS SCRIPT SEMENTARA DISINI DULU YAKKK...
// NYOBA TEMPLATING

var db;
var nomormeja = 0;
var st = 0;
var idtemp = 0;
var split = 0;
var splitItem = [];
var toBeMerged = [];
var mergeItem = [];
var addr = "http://dev.cloudmnm.com/resto/";
var currMeja = 0;
var refresh_meja = '';
var session
// var mainView = app.views.main;
// var chart = Highcharts.chart('container1', {});

Highcharts.setOptions({
  lang: {
    months: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"],
    shortMonths: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"],
    weekdays: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]
  }
})

screen.orientation.addEventListener('change', checkOrientation);
document.addEventListener('deviceready', function() {
     /*window.sqlitePlugin.echoTest(function() {
       alert('ECHO test OK');
     });*/
     // screen.orientation.lock('landscape');

     db = window.sqlitePlugin.openDatabase({
       name: 'LightPOS.db',
       location: 'default',
     });

     db.transaction(function(transaction) {
       var executeQuery = "DELETE FROM pj_dtl_tmp";
       transaction.executeSql(executeQuery, [],
       //On Success
       function(tx, result) {
         //alert('Delete successfully');
       },
       //On Error
       function(error){
         //alert('Something went Wrong');
       });
     });

     db.transaction(function(tx) {
       tx.executeSql('CREATE TABLE IF NOT EXISTS m_barang (id_barang INT PRIMARY KEY NOT NULL, kode_barang VARCHAR(20)  NOT NULL,nama_barang VARCHAR(200) NOT NULL, harga_jual DOUBLE)');
       tx.executeSql('CREATE TABLE IF NOT EXISTS pj (id_pj INTEGER PRIMARY KEY AUTOINCREMENT, no_penjualan VARCHAR(30), no_faktur VARCHAR(30), tgl_penjualan DATE,   jenis_jual int, jenis_bayar int, id_customer int, id_user  int, stamp_date datetime, disc_prs double, disc_rp double, sc_prs double, sc_rp double, ppn double, total_jual double, grantot_jual double, bayar_tunai double, bayar_card double, nomor_kartu varchar, ref_kartu varchar, kembali_tunai double, void_jual varchar, no_meja int, ip varchar,   id_gudang int, pl_retail text, meja int, st int)');
       tx.executeSql('CREATE TABLE IF NOT EXISTS pj_dtl (id_dtl_jual int, id_pj int, id_barang int, qty_jual double, harga_jual double, discprs double, discrp double, dtl_total double, harga_jual_cetak double, user int, dtpesan datetime, ready int default 0)');
       tx.executeSql('CREATE TABLE IF NOT EXISTS pj_dtl_tmp (id_tmp INTEGER PRIMARY KEY AUTOINCREMENT,id_barang INT NOT NULL UNIQUE, qty INT  NOT NULL,total DOUBLE, harga DOUBLE,nama_barang VARCHAR(20) NOT NULL)');
       
       tx.executeSql('INSERT INTO m_barang VALUES (?,?,?,?)', ['1', 'B00001','AYAM GORENG KALASAN','15000']);
       tx.executeSql('INSERT INTO m_barang VALUES (?,?,?,?)', ['2', 'B00002','AYAM OPOR','20000']);
       tx.executeSql('INSERT INTO m_barang VALUES (?,?,?,?)', ['3', 'B00003','AYAM RENDANG','20000']);
       tx.executeSql('INSERT INTO m_barang VALUES (?,?,?,?)', ['4', 'B00004','AYAM SAUCE LADA HITAM','20000']);
       tx.executeSql('INSERT INTO m_barang VALUES (?,?,?,?)', ['5', 'B00005','IKAN BAKAR SAMBAL MATA','20000']);
       tx.executeSql('INSERT INTO m_barang VALUES (?,?,?,?)', ['6', 'B00006','IKAN WOKU BELANGA','20000']);
       tx.executeSql('INSERT INTO m_barang VALUES (?,?,?,?)', ['7', 'B00007','SAPI SEMUR','20000']);
       tx.executeSql('INSERT INTO m_barang VALUES (?,?,?,?)', ['8', 'B00008','SATE LILIT','20000']);
       tx.executeSql('INSERT INTO m_barang VALUES (?,?,?,?)', ['9', 'B00009','SOTO AYAM','20000']);
       tx.executeSql('INSERT INTO m_barang VALUES (?,?,?,?)', ['10', 'B00010','7UP','20000']);
       tx.executeSql('INSERT INTO m_barang VALUES (?,?,?,?)', ['11', 'B00011','A1 SAUCE','20000']);
       tx.executeSql('INSERT INTO m_barang VALUES (?,?,?,?)', ['12', 'B00012','ABC SAOS TOMAT 5LTR','20000']);
       tx.executeSql('INSERT INTO m_barang VALUES (?,?,?,?)', ['13', 'B00013','ABON AYAM','20000']);
       tx.executeSql('INSERT INTO m_barang VALUES (?,?,?,?)', ['14', 'B00014','ABON IKAN','20000']);
       tx.executeSql('INSERT INTO m_barang VALUES (?,?,?,?)', ['15', 'B00015','ABON SAPI','20000']);
       tx.executeSql('INSERT INTO m_barang VALUES (?,?,?,?)', ['16', 'B00016','ADAS MANIS','20000']);
       tx.executeSql('INSERT INTO m_barang VALUES (?,?,?,?)', ['17', 'B00017','ADAS PEDAS','20000']);
       tx.executeSql('INSERT INTO m_barang VALUES (?,?,?,?)', ['18', 'B00018','ADONAN BAKSO','20000']);

     }, function(error) {
       //alert('Transaction ERROR: ' + error.message);
     }, function() {
       //alert('Populated database OK');
     });

     //tampil();
     //test();
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

    //alert(window.localStorage.getItem("tgl"));
     //window.localStorage.setItem("loggedIn", tgl);
     app.init();
     document.addEventListener('backbutton', onBackPressed, false);

     $(document).on('page:afterin', '.page[data-name="reorder"]', function(e){
      if($('.selected').length == 0){
        alert('Silahkan pilih meja terlebih dahulu.');
        app.views.main.router.back();
      }
    })

     $(document).on('page:afterin', '.page[data-name="payment"]', function(e){
      if($('.selected').length == 0){
        alert('Silahkan pilih meja terlebih dahulu.');
        app.views.main.router.back();
      }
    })
   });

function newLogin(){
  var loginform = app.form.convertToData('#login_form');

  app.request({
    url: addr+"API/login/",
    method: "POST",
    data: JSON.stringify(loginform),
    success: function(json){
      var result = JSON.parse(json);
      if(json){
        window.localStorage.setItem("gudang", result[0].ID_GUDANG);
        window.localStorage.setItem("cabang", result[0].id_cabang);
        window.localStorage.setItem("pegawai", result[0].nama_pegawai);
        window.localStorage.setItem("id_peg", result[0].id_pegawai);

        app.views.main.router.navigate('/home/');
      } else {
        app.toast.create({text: 'Wrong Username / Password', closeButton: true, destroyOnClose: true}).open();
      }
    }
  })

  // console.log(loginform);
}

function simpan(meja, id, qty, harga, nama){
  var idp = window.localStorage.getItem("id_peg");
  var temp = {
    id_barang : id,
    harga : harga,
    qty : qty,
    user_id : idp,
    act : "add"
  }

  app.request({
    url: addr+"API/cart/"+meja+"/",
    method: "POST",
    data: JSON.stringify(temp),
    success: function(){
      app.toast.create({
        text: 'Added to cart', 
        closeButton: true, 
        destroyOnClose: true, 
        closeTimeout: 2000
      }).open();
    }
  })
}

function ubahKategori(a){
  console.log(a);
}

function tampil(meja){
  app.request({
    url: addr+"API/barang/",
    method: "GET",
    success: function(json){
      var result = JSON.parse(json);
      var datanya = '';

      for (i = 0; i < result.length; i++){
        datanya+="<div onclick=\"simpan('"+meja+"','"+result[i].id_barang+"','1','"+result[i].harga+"','"+result[i].nama_barang+"')\" class=\"col-45\" style=\"padding-top:22.5%;text-align:left;margin:5px;position:relative;\">"+result[i].nama_barang+"<div><h3><strong> Rp. "+parseInt((result[i].harga ? result[i].harga : 0)).toLocaleString()+"</strong></h3></div></div>";
      }
      $('#menuku').html(datanya);

    }
  })
}

function lihatKeranjang(meja){
  var data = "";
  var jumlah = 0;
  app.request({
    url: addr+"API/cart/"+meja+"/",
    method: "GET",
    success: function(json){
      var result = JSON.parse(json);
      for(var i = 0; i < result.length; i++){
        jumlah += parseInt(result[i].harga_tmp) * parseInt(result[i].qty_tmp);
        data += ` <li class="item-content ">
                    <div class="item-inner">
                      <div class="item-title" >`+result[i].qty_tmp+` x `+result[i].nama_barang+`
                        <div class="item-footer" id="catt`+result[i].id_barang+`"></div>
                      </div>
                      <div class="item-after">
                        <a href="#" onclick="addCatatan()" style="margin: 0px 5px;"><i class="icon material-icons md-only">edit</i></a>
                        <a href="#" onclick="hapusItem()" style="margin: 0px 5px;"><i class="icon material-icons md-only">remove_shopping_cart</i></a>
                      </div>
                    </div>
                  </li>`;
      }

      /*<div class="item-footer" id="catt`+result[i].id_barang+`">`+result[i].qty_tmp+` x `+result[i].harga_tmp+`</div>*/

      $('#subTotal').val(jumlah);
      $('#keranjang').html(data);
    }
  })
}

function addCatatan(){
  alert("addCatatan");
}

function hapusItem(){
  alert("hapusItem");
}

function simpanPesanan(nMeja, id){
  var sub = parseInt($('#subTotal').val());
  var grand = parseInt($('#grandTotal').val());
  var gudang = window.localStorage.getItem("gudang");
  var idp = window.localStorage.getItem("id_peg");
  var temp = {
    action : "pesan",
    meja : nMeja,
    idPJ : id,
    subtotal : sub,
    grantotal : grand,
    idpeg : idp
  }

  app.request({
    url: addr+"API/penjualan/"+gudang+"/",
    method: "POST",
    data: JSON.stringify(temp),
    success: function(json){
      console.log(json);
    }
  })
}

/*function lihatKeranjang(a,b,c,d){
 var data="";
 var jumlah=0;
 db.transaction(function(tx) {
     tx.executeSql('SELECT * FROM pj_dtl_tmp', [], function(tx, rs) {
       var len = rs.rows.length, i;
       var all_rows = [];
       var datanya="";
       for (i = 0; i < len; i++){
        data+="<li class=\"swipeout deleted-callback\" data-id=\""+rs.rows.item(i).id_tmp+"\"><div class=\"item-content swipeout-content\"><div class=\"item-inner\"><div class=\"item-title\"><div class=\"item-header\">"+rs.rows.item(i).nama_barang+"</div>"+rs.rows.item(i).total.toLocaleString()+"</div><div>"+rs.rows.item(i).qty+"</div></div></div><div class=\"swipeout-actions-right\"><a href=\"#\" onclick=\"hapuslihatKeranjang('"+rs.rows.item(i).id_tmp+"')\" class=\"swipeout-delete\">Delete</a></div></li>";
        jumlah+=parseInt(rs.rows.item(i).total);
      }
      $('#keranjang').html(data);
      $('#subtotal').html(jumlah.toLocaleString());
      var ppn=jumlah*(10/100);
      var gt=jumlah+ppn;
      $('#ppn').html(ppn.toLocaleString());
      $('#grandtotal').html(gt.toLocaleString());
    }, function(tx, error) {
     alert('SELECT error: ' + error.message);
   });
 });
}*/

function test(){
  var str="x";
  var result1, result2; 
  try{
    db.transaction(function(tx) {
     tx.executeSql('SELECT count(id_pj) as ok FROM pj', [], function(tx, rs) {
       var len = rs.rows.length, i;
       var all_rows = [];
       var datanya="";
       for (i = 0; i < len; i++){

       }
       result1=rs.rows.item(0).ok;
     }, function(tx, error) {
       alert('SELECT error: ' + error.message);
     });
   }, null, function() {
   }); } catch(e){
    }
    alert(result1);
  }

  function nomor(){
    var d = new Date();
    var inc=(parseInt(window.localStorage.getItem("inctrx")) + 1);
    var str = ""+inc;
    var gud = ""+1;
    var pad = "0000";
    var pad1 = "000";

    // susunan nomor adalah YYYYMMDD{IDOUTLET}{SEQDAY}


     //  db.transaction(function(tx) {
     //   tx.executeSql('SELECT count(id_pj) as ok FROM pj', [], function(tx, rs) {
     //     var len = rs.rows.length, i;
     //     var all_rows = [];
     //     var datanya="";
     //     for (i = 0; i < len; i++){
     //        all_rows=rs.rows.item(i);
     //     }
     //     alert(rs.rows.item(0).ok);
     //   }, function(tx, error) {
     //     alert('SELECT error: ' + error.message);
     //   });
     // });

     var ans = pad.substring(0, pad.length - str.length) + str;
     var ans1 = pad1.substring(0, pad1.length - gud.length) + gud;

     var nomornya=d.getFullYear()+""+(d.getMonth()+1)+""+d.getDate()+""+ans1+""+ans;
     window.localStorage.setItem("inctrx",inc);
     return nomornya;
   }

  function ordernya(){
    var c1=1;
    var qty=0;

    var nomorx=nomor();
    var d=new Date();
    var tgl=d.getFullYear()+"-"+(d.getMonth()+1)+"-"+("0" + d.getDate()).slice(-2);
    var tgltime=d.getFullYear()+"-"+(d.getMonth()+1)+"-"+("0" + d.getDate()).slice(-2)+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();

    if(st == 2){
      nomormeja = -1;
      c1 = 0;
    }else if(nomormeja==0){
      alert('Harap memilih meja dahulu!');
      return;
    }

    app.dialog.prompt('PIN:', 'Konfirmasi', 
    function(nomor){
      if(nomor != '1234'){
        app.toast.create({text: 'PIN not recognized', closeButton: true, destroyOnClose: true}).open();
        return;
      }else {
        // nomormeja = parseInt(nomor);
        // app.toast.create({text: 'Table '+nomormeja+' successfully added', closeTimeout: 2000, destroyOnClose: true}).open();

        db.transaction(function(tx){
        tx.executeSql("SELECT COUNT(*) c FROM pj WHERE id_pj = ?", [idtemp],
          function(t, result){
            if(result.rows.item(0).c < 1){
              db.transaction(function(transaction) {
               var executeQuery = "INSERT INTO pj (no_penjualan,no_faktur,tgl_penjualan,jenis_jual,id_user,stamp_date,no_meja,id_gudang,meja,st) VALUES (?,?,?,?,?,?,?,?,?,?)";
               transaction.executeSql(executeQuery, [nomorx,nomorx,tgl,st,'1',tgltime,nomormeja,'1','1',c1]
                , function(tx, result) {
                 orderdtl(result.insertId);
                 listMeja();

                 alert(nomor);
               },
               function(error){
                 alert('Error occurred'); 
               });
             });
            } else{
              orderdtl(idtemp);
            }
          })
      })
      }
    },
    function(){
      // app.toast.create({text: 'Batal', closeTimeout: 2000}).open()
    });

    
  }

  // function ordernya(){
  //   var c1=0;
  //   var qty=0;

  //   if(st == 1){
  //     alert('Takeaway');
  //   } else if(st == 2){
  //     alert('Extra order');
  //   } else if(nomormeja==0){
  //     alert('Nomor meja masih kosong!');
  //   } else{
  //     var nomorx=nomor();
  //     var d=new Date();
  //     var tgl=d.getFullYear()+"-"+(d.getMonth()+1)+"-"+("0" + d.getDate()).slice(-2);
  //     var tgltime=d.getFullYear()+"-"+(d.getMonth()+1)+"-"+("0" + d.getDate()).slice(-2)+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
  //     db.transaction(function(transaction) {
  //      var executeQuery = "INSERT INTO pj (no_penjualan,no_faktur,tgl_penjualan,jenis_jual,id_user,stamp_date,no_meja,id_gudang,meja,st) VALUES (?,?,?,?,?,?,?,?,?,?)";
  //      transaction.executeSql(executeQuery, [nomorx,nomorx,tgl,'1','1',tgltime,nomormeja,'1','1','1']
  //       , function(tx, result) {
  //      //alert('Inserted'+result.insertId);
  //      orderdtl(result.insertId);
  //      // app.toast.create({text: '1'}).open();
  //    },
  //    function(error){
  //      alert('Error occurred'); 
  //    });
  //    });

  //     listMeja();

  //   }
  // }

  function orderdtl(id){
    db.transaction(function(tx) {
     tx.executeSql('SELECT *,'+id+' as idpj FROM pj_dtl_tmp', [], function(tx, rs) {
       var len = rs.rows.length, i;
       var all_rows = [];
       var idnya="";
       var datanya="";
       for (i = 0; i < len; i++){
        idnya=rs.rows.item(i).id_tmp;
        all_rows.push(rs.rows.item(i));
      }
      again(all_rows);
    }, function(tx, error) {
     alert('SELECT error: ' + error.message);
   });
   });
  }

  function again(a){
    var mainView = app.views.main;
    var d=new Date();
    var tgltime=d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
    for (var i = 0; i < a.length; i++) {
     var insert = function(id_pj, id_barang, qty_jual, harga_jual, discprs, discrp, dtl_total, harga_jual_cetak, user, dtpesan, id_tmp){
      db.transaction(function(t){
        t.executeSql('SELECT COUNT(*) c FROM pj_dtl WHERE id_pj = ? AND id_barang = ?', [id_pj, id_barang], 
          function(t, result){
            if(result.rows.item(0).c < 1){
              db.transaction(function(transaction) {
               var executeQuery = "INSERT INTO pj_dtl (id_pj, id_barang, qty_jual, harga_jual, discprs, discrp, dtl_total, harga_jual_cetak, user, dtpesan) VALUES (?,?,?,?,?,?,?,?,?,?)";
               transaction.executeSql(executeQuery, [id_pj, id_barang, qty_jual, harga_jual, discprs, discrp, dtl_total, harga_jual_cetak, user, dtpesan]
                , function(tx, result) {
                 hapuslihatKeranjang(id_tmp);
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
                   hapuslihatKeranjang(id_tmp);
                 }, 
                 function(error){
                   alert('Error occured');
                 })
              });
            }
          }, 
          function(error){})
      })

    }(a[i].idpj, a[i].id_barang, a[i].qty, a[i].harga,"0","0",a[i].total,a[i].harga,"1",tgltime, a[i].id_tmp)
  }
  idtemp = 0;
  mainView.router.back();
}

// function again(a){
//   var mainView = app.views.main;
//   var d=new Date();
//   var tgltime=d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
//   for (var i = 0; i < a.length; i++) {
//    //alert(a[i].id_tmp+" ID Barang "+ a[i].id_barang+" Nama Barang "+ a[i].nama_barang);
//    //hapuslihatKeranjang(a[i].id_tmp);
//    var insert = function(id_pj, id_barang, qty_jual, harga_jual, discprs, discrp, dtl_total, harga_jual_cetak, user, dtpesan, id_tmp){
//     db.transaction(function(transaction) {
//      var executeQuery = "INSERT INTO pj_dtl (id_pj, id_barang, qty_jual, harga_jual, discprs, discrp, dtl_total, harga_jual_cetak, user, dtpesan) VALUES (?,?,?,?,?,?,?,?,?,?)";
//      transaction.executeSql(executeQuery, [id_pj, id_barang, qty_jual, harga_jual, discprs, discrp, dtl_total, harga_jual_cetak, user, dtpesan]
//       , function(tx, result) {
//          //alert('Inserted'+result.insertId);
//          hapuslihatKeranjang(id_tmp);
//        },
//        function(error){
//          alert('Error occurred'); 
//        })
//    });
//   }(a[i].idpj, a[i].id_barang, a[i].qty, a[i].harga,"0","0",a[i].total,a[i].harga,"1",tgltime, a[i].id_tmp)
// }
// mainView.router.back();
// //  mainView.router.navigate({
// //   name: 'home'
// // }, 
// // {
// //   history: false
// // });
// }

function onBackPressed(){
  var mv = app.views.main;
  if(mv.router.currentPageEl.f7Page.name == 'home'){
    app.dialog.confirm('Keluar aplikasi?', 'Konfirmasi', function(){navigator.app.exitApp();}, function(){return;})
  }else{
    testEmpty();
    mv.router.back();
    return;
  }
}

function checkOrientation(){
  var width = $(window).width();
  var height = $(window).height();

  if(width >= 800 || height >= 800){
    if(window.screen.orientation.type == 'portrait-primary' || window.screen.orientation.type == 'portrait-secondary'){
      $('#home_grid .grid-demo').removeClass('col-70').addClass('col-60');
      $('#home_grid .side-menu').removeClass('col-30').addClass('col-40');
    } else if(window.screen.orientation.type == 'landscape-primary' || window.screen.orientation.type == 'landscape-secondary'){
      $('#home_grid .grid-demo').removeClass('col-60').addClass('col-70');
      $('#home_grid .side-menu').removeClass('col-40').addClass('col-30');
    }
  } else{
    if(window.screen.orientation.type == 'portrait-primary' || window.screen.orientation.type == 'portrait-secondary'){
      $('#home_grid .grid-demo').removeClass('col-60').addClass('col-100');
      $('#home_grid .side-menu').removeClass('col-40').addClass('col-100');
    } else if(window.screen.orientation.type == 'landscape-primary' || window.screen.orientation.type == 'landscape-secondary'){
      $('#home_grid .grid-demo').removeClass('col-100').addClass('col-60');
      $('#home_grid .side-menu').removeClass('col-100').addClass('col-40');
    }
  }
}

/*function meja(){
  var arr = [];
  db.transaction(function(tx){
    tx.executeSql("SELECT no_meja FROM pj WHERE st=1", [], 
      function(tx, result){
        for(var i = 0; i < result.rows.length; i++){
          arr.push(parseInt(result.rows.item(i).no_meja));
        }
      }, function(error){
        alert('err');
      })
  })

  app.dialog.prompt('Nomor meja:', 'Konfirmasi', 
    function(nomor){
      if(arr.includes(parseInt(nomor))){
        app.toast.create({text: 'Selected table currently in use, please choose another', closeButton: true, destroyOnClose: true}).open();
        return;
      }else {
        nomormeja = parseInt(nomor);
        app.toast.create({text: 'Table '+nomormeja+' successfully added', closeTimeout: 2000, destroyOnClose: true}).open();
      }
    },
    function(){
      app.toast.create({text: 'Batal', closeTimeout: 2000}).open()
    });
}*/

function listMeja(){
  var content = '';
  var st_meja = '';
  nomormeja = 0;
  app.request({
    url: addr+"API/meja/",
    method: "GET",
    success: function(json){
      // console.lengthog(result);
      var result = JSON.parse(json);
      for(var i = 0; i < result.length; i++){
        // console.log(result[i].NAMA);
        if(result[i].ST == '0' || result[i].ST == '1'){
          st_meja = "(In use)";
        } else {
          st_meja = "(Available)";
        }
        // content += '<div id="meja'+result[i].KODE+'" class="col-50 tablet-25 floated" style="height: 150px; width: 150px; margin: 5px" onclick="checkMeja(this)">Table '+result[i].NAMA+'<br />'+st_meja+'</div>';
        content += '<div id="meja'+result[i].KODE+'" class="col-50 tablet-25 floated" style="height: 150px; width: 150px; margin: 5px" onclick="lihatmeja('+result[i].KODE+','+(result[i].ST == '1' ? result[i].id_pj : 0)+')">Table '+result[i].NAMA+'<br />'+st_meja+'</div>';
      }

      $('#mejaaktif').html(content);
      refresh_meja = setTimeout(listMeja, 5 * 1000);
    }
  })
}

function lihatmeja(meja, pj){
  if(pj > 0){
    app.views.main.router.navigate({
      name: 'pesanan',
      params: {idMeja : meja, idPJ : pj}
    });
    // alert('1');
  } else {
    app.views.main.router.navigate({
      name: 'menu',
      params: {idMeja : meja, idPJ : 0}
    });
    // alert('0');
  }
  
  // console.log(meja, pj);
}

function lihatPesanan(meja, pj){
  var jumlah = 0;
  var data = "";
  app.request({
    url: addr+"API/penjualan/"+meja+"/",
    method: "GET",
    success: function(json){
      var result = JSON.parse(json);
      for(i = 0; i < result.length; i++){
        jumlah += parseInt(result[i].harga_jual * result[i].qty_jual);
        data += ` <li class="item-content ">
                    <div class="item-inner">
                      <div class="item-title" >`+result[i].nama_barang+`
                        <div class="item-footer">`+result[i].qty_jual+` x `+result[i].harga_jual+`</div>
                      </div>
                      <div class="item-after">`+parseInt(result[i].qty_jual * result[i].harga_jual).toLocaleString()+`
                      </div>
                    </div>
                  </li>`;
    }

    $('#pesanan').html(data);

    }
  })
}

function cetakBill(id){
  var jumlah = 0;
  app.request({
    url: addr+"API/penjualan/"+id+"/",
    method: "GET",
    success: function(json){
      var result = JSON.parse(json);
      var bill = '';
      var list = '';
      var header = '{br}{center}{h}MediaPOS{/h}{br}Sales Receipt{br}--------------------------------{br}';
      var tgl = result[0].tgl_penjualan.replace(/\W/g,'/');
      // var subheader = '{left}No. Trans : '+result[0].no_penjualan+'{br}Tanggal   : '+tgl+'{br}Operator  : '+cpyProf.client+'{br}--------------------------------{br}';
      var subheader = '{left}No. Trans : '+result[0].no_penjualan+'{br}Tanggal   : '+tgl+'{br}--------------------------------{br}';
      var subtotal = 'Subtotal';

      for(i = 0; i < result.length; i++){
        var ws = '';
        var price_satuan = parseInt(result[i].harga_jual).toLocaleString();
        var price_bulk = (parseInt(result[i].harga_jual) * parseInt(result[i].qty_jual)).toLocaleString();
    
        for(var j = 0; j < 27 - price_satuan.length - price_bulk.length; j++){
          ws += ' ';
        }
    
        list += '{left}'+result[i].nama_barang+'{br}  '+result[i].qty_jual+' x '+parseInt(result[i].harga_jual)+ws+(parseInt(result[i].harga_jual) * parseInt(result[i].qty_jual)).toLocaleString()+'{br}';
        jumlah += parseInt(result[i].harga_jual) * parseInt(result[i].qty_jual);
        // console.log(jumlah);
      }

      for(var i = 0; i < 23-jumlah.toLocaleString().length; i++){
        subtotal += ' ';
      } subtotal += jumlah.toLocaleString() + '{br}';

      list += '--------------------------------{br}{left}';
      bill = header + subheader + list + subtotal;

      connectToPrinter(bill);

      // console.log(parseInt(jumlah).toLocaleString());
    }
  })
}

function cetakPreBill(id){
  app.request({
    url: addr+"API/penjualan/"+id+"/",
    method: "GET",
    success: function(json){
      var result = JSON.parse(json);
      var bill = '';
      var list = '';
      var header = '{br}{center}{h}MediaPOS{/h}{br}Pre-Sales Receipt{br}--------------------------------{br}';
      var tgl = result[0].tgl_penjualan.replace(/\W/g,'/');
      // var subheader = '{left}No. Trans : '+result[0].no_penjualan+'{br}Tanggal   : '+tgl+'{br}Operator  : '+cpyProf.client+'{br}--------------------------------{br}';
      var subheader = '{left}No. Trans : '+result[0].no_penjualan+'{br}Tanggal   : '+tgl+'{br}--------------------------------{br}';

      for(var i = 0; i < result.length; i++){
        var ws = '';
        for(var j = 0; j < 29 - (result[i].nama_barang.length + result[i].qty_jual.length); j++){
          ws += ' ';
        }
    
        list += '{left}' + result[i].nama_barang + ws + 'x ' + result[i].qty_jual + (result[i].catatan ? '{br}   CATT : ' +  result[i].catatan : '') + '{br}';
        // console.log(jumlah);
      }

      list += '--------------------------------{br}{left}';
      bill = header + subheader + list;

      connectToPrinter(bill);

      // console.log(parseInt(jumlah).toLocaleString());
    }
  })
}

function testPrint(){
  var q = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
  connectToPrinter(q);
}

function connectToPrinter(q){
  window.DatecsPrinter.listBluetoothDevices(
    function (devices) {
      window.DatecsPrinter.connect(devices[0].address, 
        function() {
          window.DatecsPrinter.printText(q + "{br}{br}{br}", 'ISO-8859-1', 
            function(){
              alert('Bill Printed!');
            }, function() {
              alert("Datecs.printText error: " + JSON.stringify(error));
            });
        },
        function() {
          alert("Datecs.connect error: " + JSON.stringify(error));
        }
        );
    },
    function (error) {
      alert("Datecs.listBluetoothDevices error: " + JSON.stringify(error));
    });
}

function checkMeja(e){
  if($(e).hasClass('selected')){
    $(e).removeClass('selected');
    var index = toBeMerged.indexOf(e.id);
    toBeMerged.splice(index, 1);
  }else {
    $(e).addClass('selected');
    toBeMerged.push(e.id);
  }
}

function dash(){
  app.preloader.show();
  var dt = new Date();
  var penjualan = Highcharts.chart('container1', {
    chart: {
      height: '150%',
      type: 'bar',
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false
    },
    title: {
      text: 'Grafik Penjualan',
    },
    tooltip: {
      pointFormat: 'Penjualan: <b>{point.y}</b>'
    },
    plotOptions: {
      bar: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: { enabled: false },
        showInLegend: true,
      }
    },
    xAxis: {
      type: 'datetime',
      tickInterval: 24 * 3600 * 1000
    },
    series: [{
      name: "Penjualan dalam rupiah",
    }]
  })

  var favorit = Highcharts.chart('container2', {
    chart: {
      type: 'pie',
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false
    },
    title: {
      text: 'Chart Favorit',
    },
    tooltip: {
      pointFormat: 'Total: <b>{point.y} ({point.percentage:.1f}%)</b>'
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: { enabled: false },
        showInLegend: true 
      }
    },
    series: [{
      name: "Favorit"
    }]
  })

  for(var i = 1; i <= dt.getDate(); i++){
    var a = function(tgl){
      db.transaction(function(tx){
        tx.executeSql('SELECT sum(dtl_total) AS total, tgl_penjualan FROM pj_dtl a JOIN pj b ON a.id_pj = b.id_pj WHERE b.tgl_penjualan = ?', [tgl], 
          function(tx, result){
            if(result.rows.item(0).tgl_penjualan){
              var d = new Date(result.rows.item(0).tgl_penjualan);
              var temp = {
                x: Date.parse(d),
                y: parseInt(result.rows.item(0).total)
              }

              penjualan.series[0].addPoint(temp, false);
            } else {
              var d = new Date(tgl);
              var temp = {
                x: Date.parse(d),
                y: 0
              }

              penjualan.series[0].addPoint(temp, false);
            }
          }, 
          function(error){})
      })
    }(dt.getFullYear()+'-'+(dt.getMonth()+1)+'-'+("0" + i).slice(-2));
  }

  db.transaction(function(fv){
    fv.executeSql('SELECT nama_barang AS barang, SUM(a.qty_jual) AS terjual FROM pj_dtl a JOIN m_barang b ON a.id_barang = b.id_barang WHERE a.dtpesan LIKE "'+dt.getFullYear()+'-'+(dt.getMonth()+1)+'%" GROUP BY nama_barang ORDER BY terjual DESC', [],
      function(t, result){
        for(var i = 0; i < result.rows.length; i++){
          var temp = {
            y: result.rows.item(i).terjual,
            name: result.rows.item(i).barang
          }

          favorit.series[0].addPoint(temp, false);
        }
      },
      function(error){})
  })

  setTimeout(function(){
    app.preloader.hide();
    penjualan.redraw();
    favorit.redraw();
  }, 1 * 1000);
}

function dtlMeja(){
  $('#panelmeja').empty();
  if($('.selected').length > 0){
    $('.selected').each(function(i, j){
      var nomor = j.id.slice(4);
      db.transaction(function(tx){
        tx.executeSql('SELECT a.id_barang, b.no_meja, c.nama_barang, qty_jual, ready FROM pj_dtl a JOIN pj b ON a.id_pj = b.id_pj JOIN m_barang c ON a.id_barang = c.id_barang WHERE b.no_meja = ? AND b.st = 1', [nomor], 
          function(tx, result){
            var content = '<div class="list no-hairlines-between"><ul><li class="item-divider"><strong>Meja #' +result.rows.item(0).no_meja+'</strong></li>';
            for(var i = 0; i < result.rows.length; i++){
              var curr = parseInt(result.rows.item(i).qty_jual) - parseInt(result.rows.item(i).ready);
              if(curr > 0){
                content += '<li><a onclick="orderDone(this.id)" id="meja'+result.rows.item(0).no_meja+'_'+result.rows.item(i).id_barang+'" class="item-content"><div class="item-inner"><div class="item-title"><div class="item-header">'+result.rows.item(i).nama_barang+'</div></div>'+curr+'</div></a></li>';
              } else content += '<li><div class="item-content"><div class="item-inner"><div class="item-title"><div class="item-header"><s>'+result.rows.item(i).nama_barang+'</s></div></div>'+curr+'</div></div></li>';
            }
            content += '</ul></div>';

            $('#panelmeja').append(content);
          },
          function(error){})
      })
    });
  } else $('#panelmeja').append('<div class="block-title">Nothing Selected</div>');
}

function orderDone(a){
  var id = a.split('_');
  var meja = id[0].slice(4);
  var item = id[1];

  db.transaction(function(tx){
    tx.executeSql('UPDATE pj_dtl SET ready = ready + 1 WHERE id_barang = ? AND id_pj = (SELECT id_pj FROM pj WHERE no_meja = ? AND st = 1)', [item, meja],
      function(t, result){
        dtlMeja();
      }, 
      function(error){});
  });
}

function testEmpty(){
  idtemp = 0;
  nomormeja = 0;
  toBeMerged = [];
  splitItem = [];
  listMeja();
  db.transaction(function(t){
    t.executeSql("DELETE FROM pj_dtl_tmp")
  })
}

function reorder(){
  var meja = $('.selected').attr('id').slice(4);
  var arr = [];

  nomormeja = meja;

  db.transaction(function(tx){
    tx.executeSql('SELECT a.id_pj, b.id_barang, qty_jual, dtl_total, b.harga_jual, nama_barang FROM pj a JOIN pj_dtl b ON a.id_pj = b.id_pj JOIN m_barang c ON b.id_barang = c.id_barang WHERE no_meja = ? AND a.st = 1', [meja], 
      function(tx, result){
        for(var i = 0; i < result.rows.length; i++){
          arr.push(result.rows.item(i));
          idtemp = result.rows.item(i).id_pj;
        }
        // setTimeout(function(){
        //   reorderDone(arr)
        // }, 1 * 1000);
      }, function(error){})
  })
}

function reorderDone(a){
  for(var i = 0; i < a.length; i++){
    simpan(a[i].id_barang, a[i].qty_jual, a[i].dtl_total, a[i].nama_barang);
  }
}

function pay(c){
  // for(var i = 0;i < $('.selected').length; i++){
    // var content = '';
    var discprs = '-'; 
    var discrp = '-'; 
    var subtotal = 0;
    var grandtotal = 0;

  if(c == '0'){
    var m = toBeMerged[0].slice(4);
      // var m = $('.selected')[0].id.slice(4);
      for(var x=0; x<toBeMerged.length; x++){
        // var ambil = function(m){
          var payment = function(m){
            db.transaction(function(t){
              t.executeSql('SELECT a.id_pj, no_faktur, b.id_barang, nama_barang, qty_jual, dtl_total, b.harga_jual, b.discprs FROM pj a JOIN pj_dtl b ON a.id_pj=b.id_pj JOIN m_barang c ON b.id_barang=c.id_barang WHERE no_meja=? AND a.st=1 AND jenis_jual=1 ORDER BY qty_jual DESC', [m],
                function(t,result){
                  var receiptOrder = '<div class="block-title" style="overflow: unset;"><p><h2>Order #'+result.rows.item(0).no_faktur+'</h2></p></div>';
                  var content = '<div id="items" class="list no-hairlines no-hairlines-between" style=" overflow-y:scroll;max-height: calc( 90vh - 50px );margin:1px;"><ul>';
                  for(var i=0;i<result.rows.length;i++){
                    subtotal += parseInt(result.rows.item(i).dtl_total);
                    discprs = (result.rows.item(i).discprs) ? ('Disc '+result.rows.item(i).discprs) : '';
                    // discrp += (result.rows.item(i).discprs * result.rows.item(i).dtl_total);
                    content += '<li id="'+result.rows.item(i).id_barang+'" onclick="testClick(this)" amt="'+result.rows.item(i).qty_jual+'"><div class="item-content">\
                    <div class="item-inner item-cell">\
                      <div class="item-title">'+result.rows.item(i).nama_barang+'</div>\
                      <div class="item-row">\
                        <div class="item-cell">\
                          <div class="item-row">\
                            <div class="item-cell item-footer">'+parseInt(result.rows.item(i).harga_jual)+'</div>\
                            <div class="item-cell item-footer" style="text-align: right">x'+parseInt(result.rows.item(i).qty_jual)+'</div>\
                          </div>\
                        </div>\
                        <div class="item-cell item-footer" style="text-align: right">\
                          <div class="item-row">\
                            <div class="item-cell">'+discprs+'</div>\
                            <div class="item-cell">'+parseInt(result.rows.item(i).dtl_total)+'</div>\
                          </div>\
                        </div>\
                      </div>\
                    </div></div></li>';
                    // content+='<li><div class="item-content"><div class="item-inner"><div class="item-title"><div class="item-header">'+result.rows.item(i).nama_barang+'<div><strong>'+result.rows.item(i).harga_jual+'</strong></div></div></div>'+parseInt(result.rows.item(i).qty_jual)+'</div></div></li>'
                  }
                  content+='</ul></div>';
                  grandtotal =  subtotal + parseInt(subtotal * 0.1);
                  idtemp = result.rows.item(0).id_pj;
      
                  $('#receipts').append(receiptOrder);
                  $('#receipts').append(content);
                  // $('#items').html(content);
                  // $('#items_title').html('<p><h2>Order #'+result.rows.item(0).no_faktur+'</h2></p>');
      
                  // $('#subtot').html(subtotal.toLocaleString());
                  // $('#pajak').html((subtotal * 0.1).toLocaleString());
                  // $('#grantot').html(grandtotal.toLocaleString());
      
                  $('#total_jual').val(subtotal.toLocaleString());
                  $('#grantot_jual').val(grandtotal.toLocaleString());
                  $('#ppn').val((subtotal * 0.1).toLocaleString());
                  // $('#ppn').val(parseInt(subtotal*10/100).toLocaleString());
                  // $('#discprs').val(discprs);
                  // $('#discrp').val(discrp);
                  // $('#grandtotal').val(parseInt(subtotal*110/100).toLocaleString());
                  // $('#tagihan').val(parseInt(subtotal*110/100).toLocaleString());
                },
                function(e){
                  // console.log(e.message);
                })
            })
          }(toBeMerged[x].slice(4));
        }
      // }(meja)
  
      nomormeja = m;
    }else {
      // console.log('pay');
      idtemp = c;
        db.transaction(function(t){
          t.executeSql('SELECT no_faktur, b.id_barang, nama_barang, qty_jual, dtl_total, b.harga_jual, b.discprs FROM pj a JOIN pj_dtl b ON a.id_pj=b.id_pj JOIN m_barang c ON b.id_barang=c.id_barang WHERE a.id_pj = ? AND a.st=1 ORDER BY qty_jual DESC', [c],
            function(t,result){
              // console.log(result.rows.item);
              var receiptOrder = '<div class="block-title" style="overflow: unset;"><p><h2>Order #'+result.rows.item(0).no_faktur+'</h2></p></div>';
              var content = '<div id="items" class="list no-hairlines no-hairlines-between" style=" overflow-y:scroll;max-height: calc( 90vh - 50px );margin:1px;"><ul>';
              for(var i=0;i<result.rows.length;i++){
                subtotal += parseInt(result.rows.item(i).dtl_total);
                discprs = (result.rows.item(i).discprs) ? ('Disc '+result.rows.item(i).discprs) : '';
                // discrp += (result.rows.item(i).discprs * result.rows.item(i).dtl_total);
                content += '<li id="'+result.rows.item(i).id_barang+'" onclick="testClick(this)" amt="'+result.rows.item(i).qty_jual+'"><div class="item-content">\
                <div class="item-inner item-cell">\
                  <div class="item-title">'+result.rows.item(i).nama_barang+'</div>\
                  <div class="item-row">\
                    <div class="item-cell">\
                      <div class="item-row">\
                        <div class="item-cell item-footer">'+parseInt(result.rows.item(i).harga_jual)+'</div>\
                        <div class="item-cell item-footer" style="text-align: right">x'+parseInt(result.rows.item(i).qty_jual)+'</div>\
                      </div>\
                    </div>\
                    <div class="item-cell item-footer" style="text-align: right">\
                      <div class="item-row">\
                        <div class="item-cell">'+discprs+'</div>\
                        <div class="item-cell">'+parseInt(result.rows.item(i).dtl_total)+'</div>\
                      </div>\
                    </div>\
                  </div>\
                </div></div></li>';
                // content+='<li><div class="item-content"><div class="item-inner"><div class="item-title"><div class="item-header">'+result.rows.item(i).nama_barang+'<div><strong>'+result.rows.item(i).harga_jual+'</strong></div></div></div>'+parseInt(result.rows.item(i).qty_jual)+'</div></div></li>'
              }
              content+='</ul></div>';
              grandtotal =  subtotal + parseInt(subtotal * 0.1);
  
              $('#receipts').html(receiptOrder);
              $('#receipts').append(content);
  
              // $('#subtot').html(subtotal.toLocaleString());
              // $('#pajak').html((subtotal * 0.1).toLocaleString());
              // $('#grantot').html(grandtotal.toLocaleString());
  
              $('#total_jual').val(subtotal.toLocaleString());
              $('#grantot_jual').val(grandtotal.toLocaleString());
              $('#ppn').val((subtotal * 0.1).toLocaleString());
              // $('#ppn').val(parseInt(subtotal*10/100).toLocaleString());
              // $('#discprs').val(discprs);
              // $('#discrp').val(discrp);
              // $('#grandtotal').val(parseInt(subtotal*110/100).toLocaleString());
              // $('#tagihan').val(parseInt(subtotal*110/100).toLocaleString());
            },
            function(e){
              // console.log(e.message);
            })
        })
    }
}

function payDone(){
  var a = app.form.convertToData('#totals_form');
  var tunai = a.bayar_tunai.replace(/,/g, '');
  var grantot = a.grantot_jual.replace(/,/g, '');
  var kembali = a.kembali_tunai.replace(/,/g, '');
  var ppn = a.ppn.replace(/,/g, '');
  var total = a.total_jual.replace(/,/g, '');

  // console.log(tunai, grantot, kembali, ppn, total);

  if(split != 1){
    for(var i=0; i<toBeMerged.length; i++){
      var checkout = function(meja, i){
        console.log(i);
          if(i<1){
            db.transaction(function(t){
              t.executeSql('UPDATE pj SET jenis_bayar = ?, ppn = ?, total_jual = ?, grantot_jual = ?, bayar_tunai = ?, kembali_tunai = ?, st = 0 WHERE no_meja = ? AND st = 1', [a.jenis_bayar, ppn, total, grantot, tunai, kembali, meja],
                function(){
                  alert('success');
                  listMeja();
                  app.views.main.router.back();

                  testEmpty();
                })
              })
            } else {
              db.transaction(function(t){
                t.executeSql('UPDATE pj SET st = 0 WHERE no_meja = ? AND st = 1', [meja],
                  function(){
                    listMeja();
                  });
              })
            }
          }(toBeMerged[i].slice(4), i);
      }
    }else{
      db.transaction(function(t){
        t.executeSql('UPDATE pj SET jenis_bayar = ?, ppn = ?, total_jual = ?, grantot_jual = ?, bayar_tunai = ?, kembali_tunai = ?, st = 0 WHERE id_pj = ? AND st = 1', [a.jenis_bayar, ppn, total, grantot, tunai, kembali, idtemp],
          function(){
            alert('success');
            listMeja();
            split = 0;
            app.views.main.router.back();

            testEmpty();
          })
      })
    }
}

function comma(e){
  var n = parseInt(e.value.replace(/\D/g,''),10);
  e.value = n.toLocaleString();
}

function kembali(){
  var a = parseInt($('#bayar_tunai').val().replace(/,/g, ''));
  var b = parseFloat($('#discprs').val()) / 100 * parseInt($('#total_jual').val().replace(/,/g, ''));
  if(b > 0){
    $('#ppn').val((b * 0.1).toLocaleString());
  } else $('#ppn').val((parseInt($('#total_jual').val().replace(/,/g, '')) * 0.1).toLocaleString());

  var c = (parseInt($('#total_jual').val().replace(/,/g, '')) + parseInt($('#ppn').val().replace(/,/g, ''))) - b;

  $('#grantot_jual').val(c.toLocaleString());
  $('#discrp').val(b);

  // console.log(b);

  if(a-c < 0){
    $('#kembali_tunai').val(0);
  } else {
    $('#kembali_tunai').val((a-c).toLocaleString());
  }
  // $('#change').html((a - c).toLocaleString());
}

function sanitize(e){
  var c = parseInt(e.value.replace(/,/g, ''));
  $('#bayar_tunai').val(c);
  $('#change').html((c - parseInt($('#grantot_jual').val())).toLocaleString());
  // $('#kembali_tunai').val(c);
}

function bersih(e){
  e.value = "";
}

function disc(e){
  e.value = e.value + '%';
}

function methodSel(e){
  if(e.value == '1'){
    $('.tunai').each(function(i,j){j.style.display = 'block';});
    $('.kredit').each(function(i,j){j.style.display = 'none';});
  }else if(e.value == '2'){
    $('.kredit').each(function(i,j){j.style.display = 'block';});
    $('.tunai').each(function(i,j){j.style.display = 'none';});
  }
}

function testClick(e){
  var t = e.getAttribute('amt');
  // console.log(t);
  if($(e).hasClass('select-split')){
    var index = splitItem.findIndex(x => x.id_barang=='2');
    splitItem.splice(index, 1);
    $(e).removeClass('select-split');
  }else {
    app.dialog.prompt('Jumlah split:', 'Konfirmasi', function(jumlah){
      $(e).addClass('select-split');
      console.log(jumlah);
      if(parseInt(jumlah) > parseInt(t) || jumlah == '') {
        jumlah = t;
        // console.log('if');
      }

      var a =  {
        id_barang : e.id,
        jml : jumlah
      }
      splitItem.push(a);
      // console.log(a);
    }, function(){
      return;
    });

    // navigator.notification.prompt('Jumlah split:', function(jumlah){
    //   $(e).addClass('select-split');
    //   var a =  {
    //     'id barang' : e.id,
    //     'jumlah' : jumlah
    //   }
    //   console.log(a);
    // }, 'Konfirmasi', ['Ok', 'Cancel'], t);
  }
}

function splitBill(){
  app.dialog.confirm('Split Bill?', 'Konfirmasi', function(){
    split = 1;
    var arr = [];
    var nomorx=nomor();
    var d=new Date();
    var tgl=d.getFullYear()+"-"+(d.getMonth()+1)+"-"+("0" + d.getDate()).slice(-2);
    var tgltime=d.getFullYear()+"-"+(d.getMonth()+1)+"-"+("0" + d.getDate()).slice(-2)+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
    // var temp = nomormeja.replace(/\d/g, '');
    // var mejatemp;

    // if(temp == '') {
    //   temp = 'a';
    //   mejatemp = nomormeja + temp;
    // } else {
    //   mejatemp = nomormeja;
    // }

    // $('.select-split').each(function(i,j){
    //   arr.push(j.id);
    // });

    // db.transaction(function(t){
    //   t.executeSql('SELECT id_pj FROM pj WHERE no_meja = ? AND st = 1', [nomormeja], function(t,result){
    //     var oldId = result.rows.item(0).id_pj;
    //     db.transaction(function(tx){
    //       tx.executeSql('UPDATE pj SET no_meja = ? WHERE no_meja = ? AND st = 1', [mejatemp, nomormeja], function(){alert('update');}, function(){});
    //       tx.executeSql('INSERT INTO pj (no_penjualan,no_faktur,tgl_penjualan,jenis_jual,id_user,stamp_date,no_meja,id_gudang,meja,st) VALUES (?,?,?,?,?,?,?,?,?,?)', [nomorx, nomorx, tgl, '3', '1', tgltime, nomormeja.replace(/\D/g,'')+( String.fromCharCode(temp.charCodeAt(0)+1) ), '1', '1', '1'], 
    //         function(x, result){
    //           var newId = result.insertId;
    //           alert('insert');
    //           splitted(arr, oldId, newId, nomormeja.replace(/\D/g,'')+( String.fromCharCode(temp.charCodeAt(0)+1) ));

    //         }, function(){})
    //     })
    //   }, function(){
    //     return;
    //   });  
    // }, function(error){})

    db.transaction(function(t){
      t.executeSql('INSERT INTO pj (no_penjualan,no_faktur,tgl_penjualan,jenis_jual,id_user,stamp_date,no_meja,id_gudang,meja,st) VALUES (?,?,?,?,?,?,?,?,?,?)', [nomorx, nomorx, tgl, '3', '1', tgltime, nomormeja, '1', '1', '1'],
        function(t,result){
          var newId = result.insertId;
          for(var i = 0; i < splitItem.length; i++){
            var la = function(idBarang, jmlBarang){
              db.transaction(function(t){
                t.executeSql('SELECT (qty_jual - ?) as sisa FROM pj_dtl WHERE id_pj = ? AND id_barang = ?', [jmlBarang, idtemp, idBarang],
                  function(t,result){
                    testSplit(result.rows.item(0).sisa, jmlBarang, idBarang, newId, idtemp);
                  }, function(error){})
              })
            }(splitItem[i].id_barang, splitItem[i].jml);
          }
        }, function(error){})
    })
  })
}

function testSplit(a, jmlBarang, idBarang, newId, oldId){
  // console.log('testSplit');
  db.transaction(function(tr){
    if(a == '0'){
      // console.log('t1');
      tr.executeSql('UPDATE pj_dtl SET id_pj = ? WHERE id_pj = ? AND id_barang = ?', [newId, oldId, idBarang], function(){pay(newId);});
    } else {
      // console.log('t2');
      tr.executeSql('INSERT INTO pj_dtl SELECT id_dtl_jual, ?, id_barang, ?, harga_jual, discprs, discrp, harga_jual * ?, harga_jual_cetak, user, dtpesan, ready FROM pj_dtl WHERE id_barang = ? AND id_pj = ?', [newId, jmlBarang, jmlBarang, idBarang, oldId]);
      tr.executeSql('UPDATE pj_dtl SET qty_jual = qty_jual - ?, dtl_total = (qty_jual - ?) * harga_jual WHERE id_pj = ? AND id_barang = ?', [jmlBarang, jmlBarang, oldId, idBarang], function(){pay(newId);});
    }
    // console.log('tout');
    // tr.executeSql('UPDATE pj_dtl CASE WHEN ? == qty_jual THEN SET qty_jual = ?, dtl_total = ? * harga_jual ELSE SET id_pj = ?, qty_jual = qty_jual - ?, dtl_total = (qty_jual - ?) * harga_jual', [splitItem[i].jml, splitItem[i].jml, splitItem[i].jml, newId, splitItem[i].jml, splitItem[i].jml]);
    })
  // console.log('tout2');
}

// function mergeBill(){
//   app.dialog.confirm('Merge Bill?', 'Konfirmasi', function(){
//     var first = toBeMerged.shift().slice(4);
//     var arr = [];

//     db.transaction(function(f){
//       f.executeSql('INSERT INTO pj_dtl_tmp (id_barang, qty, total, harga, nama_barang) SELECT b.id_barang, b.qty_jual, b.dtl_total, b.harga_jual, c.nama_barang FROM pj a JOIN pj_dtl b ON a.id_pj = b.id_pj JOIN m_barang c ON b.id_barang = c.id_barang WHERE no_meja = ? and st = 1', [first]);
//       console.log('insert');
//     })

//     for(var i = 0; i < toBeMerged.length; i++){
//       var a = function(merged){
//         db.transaction(function(f){
//           f.executeSql('select c.id_barang, qty_jual, dtl_total, c.harga_jual, nama_barang from pj a join pj_dtl b on a.id_pj = b.id_pj join m_barang c on b.id_barang = c.id_barang where a.no_meja = ? and st = 1', [merged], 
//             function(r,rs){
//               for(var j = 0; j < rs.rows.length; j++){
//                 var isi = {
//                   id_barang : rs.rows.item(j).id_barang, 
//                   qty_jual : rs.rows.item(j).qty_jual, 
//                   dtl_total : rs.rows.item(j).dtl_total, 
//                   harga_jual : rs.rows.item(j).harga_jual,
//                   nama_barang : rs.rows.item(j).nama_barang
//                 };

//                 updateDtl(isi);
//               }
//             }, function(error){});
//           })
//         console.log(merged);
//       }(toBeMerged[i].slice(4));
//     }    
//   })
// }

// function updateDtl(a){
//   db.transaction(function(f){
//     f.executeSql('insert or replace into pj_dtl_tmp (id_barang, qty, total, harga, nama_barang) values ((select id_barang from pj_dtl_tmp where id_barang = ?), (select qty from pj_dtl_tmp where id_barang = ?)+?, (select total from pj_dtl_tmp where id_barang = ?)+?, ?, ?)', 
//       [a.id_barang, a.id_barang, a.qty_jual, a.id_barang, a.dtl_total, a.harga_jual, a.nama_barang])
//   })
// }