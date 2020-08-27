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
  id: 'com.medianusamandiri.resto',
  root: '#app',
  init: false,
  theme: theme,
  on: {
    init: function(){
      // listMeja();
      checkOrientation();
      checkDisplay();
    }
  },
  routes: routes,
});

// JS SCRIPT SEMENTARA DISINI DULU YAKKK...
// NYOBA TEMPLATING

var addr = "http://dev.cloudmnm.com/resto/";
// var addr = "http://192.168.3.16/resto/";
// var addr = "http://192.168.238.10/resto/";
// var addr = "http://192.168.238.10/resto_trial/";

var db;
var nomormeja = 0;
var st = 0;
var idtemp = 0;
var split = 0;
var splitItem = [];
var toBeMerged = [];
var mergeItem = [];
var currMeja = 0;
var currentWaitress = '';
var refresh_meja = '';
var paxorder = 0;
var namaorder = '';
var user = '';
var curTable = '';
var fromRsv = 0;
/*var pinBox = app.dialog.create({
    title: 'Employee PIN',
    closeByBackdropClick: false,
    content: `<div class="list no-hairlines no-hairlines-between">
                <ul>
                  <li class="item-content item-input">
                    <div class="item-inner">
                    <div class="item-input-wrap">
                      <input type="number" name="pin" id="pin" style="text-align: center;" />
                    </div>
                    </div>
                  </li>
                </ul>
              </div>`,
    buttons: [
    {
      text: 'Simpan',
      onClick: function(dialog, e){
        var v = $('#pin').val();
        var gudang = window.localStorage.getItem('gudang');
        var temp = {
          id_waitress : v,
        }

        if(v){
          app.request({
            url: addr+"API/login/"+gudang+"/",
            method: "POST",
            data: JSON.stringify(temp),
            success: function(json){
              alert(json);
              dialog.close();
            }
          })
        }
      }
    }]
  });*/
// var mainView = app.views.main;
// var chart = Highcharts.chart('container1', {});

Highcharts.setOptions({
  lang: {
    months: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"],
    shortMonths: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"],
    weekdays: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]
  }
})

// screen.orientation.addEventListener('change', checkOrientation);
document.addEventListener('deviceready', function() {
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
  document.addEventListener('backbutton', onBackPressed, false);

  $('#login_form').on('submit', function(event){
    event.preventDefault();
    document.activeElement.blur()
    $('#login_button').trigger('click');
  })

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

function onBackPressed(e){
  e.preventDefault();
  // var mv = app.views.main;
  // if(mv.router.currentPageEl.f7Page.name == 'home'){
  //   app.dialog.confirm('Close app?', 'Confirmation', function(){navigator.app.exitApp();}, function(){return;})
  // }else{
  //   testEmpty();
  //   mv.router.back();
  //   return;
  // }
}

function checkDisplay(){
  var w = $(window).width();
  var h = $(window).height();

  if(w >= 800 || h >= 800){
  } else{
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

function newLogin(){
  var loginform = app.form.convertToData('#login_form');

  app.request({
    url: addr+"API/login/",
    method: "POST",
    data: JSON.stringify(loginform),
    success: function(json){
      if(json){
        var result = JSON.parse(json);

        window.localStorage.setItem("gudang", result[0].ID_GUDANG);
        window.localStorage.setItem("pegawai", result[0].USERNAME);
        window.localStorage.setItem("id_peg", result[0].ID);

        // console.log(json);

        app.views.main.router.navigate('/home/');
      } else {
        app.toast.create({text: 'PIN Not Found', closeButton: true, destroyOnClose: true, closeTimeout: 5 * 1000}).open();
      }
    }
  })

  // console.log(loginform);
}

function listKategoriMeja(){
  clearTimeout(refresh_meja);
  app.request({
    url: addr+"API/katmeja/",
    method: "GET",
    success: function(json){
      if(json){
        var result = JSON.parse(json);
        var datanya = '';
        var len = (result.length < 24 ? result.length : 24);

        for (i = 0; i < len; i++){
          // datanya+="<div onclick=\"simpan('"+meja+"','"+result[i].id_barang+"','1','"+result[i].harga+"','"+result[i].nama_barang+"')\" class=\"col-45\" style=\"padding-top:22.5%;text-align:left;margin:5px;position:relative;\">"+result[i].nama_barang.replace(/ \([\w \W]+\)/g, '')+"<div><h3><strong> Rp. "+parseInt((result[i].harga ? result[i].harga : 0)).toLocaleString()+"</strong></h3></div></div>";
          // datanya+="<button onclick=\"simpan('"+meja+"','"+result[i].id_barang+"','1','"+result[i].harga+"','"+result[i].nama_barang+"')\" class=\"col-45 no-ripple\" style=\"margin: 5px; height: calc((90vw / 3) - 5px); width: calc((90vw / 3) - 5px); vertical-align: middle; background: #2196f3; color: white; border-radius: 15px;\"><p style=\"font-size: 1.7em\">"+result[i].nama_barang.replace(/ \([\w \W]+\)/g, '')+"</p></button>";
          // datanya+="<button onclick=\"addQty('"+meja+"','"+result[i].id_barang+"','1','"+result[i].harga+"','"+result[i].nama_barang+"')\" class=\"col-45 no-ripple\" style=\"margin: 5px; height: calc((90vw / 3) - 5px); width: calc((90vw / 3) - 5px); vertical-align: middle; background: #2196f3; color: white; border-radius: 15px;\"><p style=\"font-size: 1.7em\">"+result[i].nama_barang.replace(/ \([\w \W]+\)/g, '')+"</p></button>";
          // datanya+="<button onclick=\"addQty('"+meja+"','"+result[i].id_barang+"','1','"+result[i].harga+"','"+result[i].nama_barang+"')\" class=\"no-ripple\" style=\"margin: 10px 0; height: calc((90vw / 3) - 5px); width: calc(90vw / 3); vertical-align: middle; background: #2196f3; color: white; border-radius: 15px;\"><p style=\""+(window.innerWidth > 480 ? "font-size: 1.5rem;" : "")+"\">"+result[i].nama_barang.replace(/ \([\w \W]+\)/g, '')+"</p></button>";
          datanya+="<button onclick=\"listMeja('"+result[i].id_m_kategory+"')\" class=\"no-ripple\" style=\"margin: 10px 0; height: calc((90vw / 3) - 5px); width: calc(90vw / 3); vertical-align: middle; background: #2196f3; color: white; border-radius: 15px;\"><p style=\""+(window.innerWidth > 480 ? "font-size: 1.5rem;" : "")+"\">"+result[i].nama_m_kategory.replace(/ \([\w \W]+\)/g, '')+"</p></button>";
        }

        datanya+="<button class=\"no-ripple\" style=\"visibility: hidden; margin: 10px 0; height: calc((90vw / 3) - 5px); width: calc(90vw / 3); vertical-align: middle; background: #2196f3; color: white; border-radius: 15px;\"><p style=\""+(window.innerWidth > 480 ? "font-size: 1.5rem;" : "")+"\">NIL</p></button>";
        $('#mejaaktif').html(datanya);
      }
    }
  })
}

function listMeja(kat = 0){
  var content = '';
  var st_meja = '';
  var img = '';
  nomormeja = 0;

  // meja lokal start
  // content += '<div class="col-33" style="height: calc((90vw / 3) - 5px); margin: 20px 5px" onclick="listKategoriMeja();"><div><img src="img/back_arro_100.png" alt="img-meja-back" style="display: table; margin: 0 auto;"><p class="table-name">Back</p></div></div>';
  // for(var i = 0; i < daftarmejalokal.length; i++){
  //   // console.log(daftarmejalokal[i].NAMA);
  //   if(daftarmejalokal[i].ST == '0' || daftarmejalokal[i].ST == '1'){
  //     st_meja = "(In use)";
  //     img = (window.innerWidth < 480) ? 'img/'+daftarmejalokal[i].KODE+'.png' : 'img/'+daftarmejalokal[i].KODE+'-150.png';
  //   } else {
  //     st_meja = "(Available)";
  //     img = (window.innerWidth < 480) ? 'img/'+daftarmejalokal[i].KODE+'-Hijau.png' : 'img/'+daftarmejalokal[i].KODE+'-Biru-150.png';
  //   }
  //   // content += '<div id="meja'+daftarmejalokal[i].KODE+'" class="col-50 tablet-25 floated" style="height: 150px; width: 150px; margin: 5px" onclick="checkMeja(this)">Table '+daftarmejalokal[i].NAMA+'<br />'+st_meja+'</div>'; <img src="img/01 Hijau.png" alt="img-meja-01" style="transform: translateY(20px);">
  //   // content += '<div id="meja'+daftarmejalokal[i].KODE+'" class="col-50 tablet-25 floated" style="height: 150px; width: 150px; margin: 5px" onclick="lihatmeja('+daftarmejalokal[i].KODE+','+(daftarmejalokal[i].ST == '1' ? daftarmejalokal[i].id_pj : 0)+')">Table '+daftarmejalokal[i].NAMA+'<br />'+st_meja+'</div>';
  //   // content += '<div id="meja'+daftarmejalokal[i].KODE+'" class="col-50 tablet-50 floated" style="height: calc((90vw / 3) - 5px); width: calc((90vw / 3) - 5px); margin: 5px" onclick="lihatmeja('+daftarmejalokal[i].KODE+','+(daftarmejalokal[i].ST == '1' ? daftarmejalokal[i].id_pj : 0)+')"><img src="'+img+'" alt="img-meja-'+daftarmejalokal[i].KODE+'" style="transform: translateY(15px) scale(1.2);"><p style="transform: translateY(5px);">Table '+daftarmejalokal[i].NAMA+'</p></div>';
  //   if(daftarmejalokal[i].ID_KATEGORY == kat) content += '<div id="meja'+daftarmejalokal[i].KODE+'" class="col-33" style="height: calc((90vw / 3) - 5px); margin: 20px 5px" onclick="lihatmeja('+daftarmejalokal[i].KODE+','+(daftarmejalokal[i].ST == '1' ? daftarmejalokal[i].id_pj : 0)+')"><div><img src="'+img+'" alt="img-meja-'+daftarmejalokal[i].KODE+'" style="display: table; margin: 0 auto;"><p class="table-name">'+(daftarmejalokal[i].NAMA.match(/^\d/) ? "Table #"+daftarmejalokal[i].NAMA : daftarmejalokal[i].NAMA)+'</p></div></div>';
  // }

  // $('#mejaaktif').html(content);
  // meja lokal end

  // app.request({
  //   url: addr+"API/meja/" +kat+ "/",
  //   method: "GET",
  //   success: function(json){
  //     var result = JSON.parse(json);
  //     console.log(result);
  //     content += '<div class="col-33" style="height: calc((90vw / 3) - 5px); margin: 20px 5px" onclick="listKategoriMeja();"><div><img src="img/back_arro_100.png" alt="img-meja-back" style="display: table; margin: 0 auto;"><p class="table-name">Back</p></div></div>';
  //     for(var i = 0; i < result.length; i++){
  //       // console.log(result[i].NAMA);
  //       if(result[i].ST == '0' || result[i].ST == '1'){
  //         st_meja = "(In use)";
  //         img = (window.innerWidth < 480) ? 'img/'+result[i].KODE+'.png' : 'img/'+result[i].KODE+'-150.png';
  //       } else {
  //         st_meja = "(Available)";
  //         img = (window.innerWidth < 480) ? 'img/'+result[i].KODE+'-Hijau.png' : 'img/'+result[i].KODE+'-Biru-150.png';
  //       }
  //       // content += '<div id="meja'+result[i].KODE+'" class="col-50 tablet-25 floated" style="height: 150px; width: 150px; margin: 5px" onclick="checkMeja(this)">Table '+result[i].NAMA+'<br />'+st_meja+'</div>'; <img src="img/01 Hijau.png" alt="img-meja-01" style="transform: translateY(20px);">
  //       // content += '<div id="meja'+result[i].KODE+'" class="col-50 tablet-25 floated" style="height: 150px; width: 150px; margin: 5px" onclick="lihatmeja('+result[i].KODE+','+(result[i].ST == '1' ? result[i].id_pj : 0)+')">Table '+result[i].NAMA+'<br />'+st_meja+'</div>';
  //       // content += '<div id="meja'+result[i].KODE+'" class="col-50 tablet-50 floated" style="height: calc((90vw / 3) - 5px); width: calc((90vw / 3) - 5px); margin: 5px" onclick="lihatmeja('+result[i].KODE+','+(result[i].ST == '1' ? result[i].id_pj : 0)+')"><img src="'+img+'" alt="img-meja-'+result[i].KODE+'" style="transform: translateY(15px) scale(1.2);"><p style="transform: translateY(5px);">Table '+result[i].NAMA+'</p></div>';

  //       if(result[i].hold > 0){
  //         content += '<div id="meja'+result[i].KODE+'" class="col-33" style="height: calc((90vw / 3) - 5px); margin: 20px 5px" onclick="onHold();"><div><img src="'+img+'" alt="img-meja-'+result[i].KODE+'" style="display: table; margin: 0 auto;"><p class="table-name">'+(result[i].NAMA.match(/^\d/) ? "Table #"+result[i].NAMA : result[i].NAMA)+'</p></div></div>';
  //       } else {
  //         content += '<div id="meja'+result[i].KODE+'" class="col-33" style="height: calc((90vw / 3) - 5px); margin: 20px 5px" onclick="lihatmeja('+result[i].KODE+','+(result[i].ST == '1' ? result[i].id_pj : 0)+')"><div><img src="'+img+'" alt="img-meja-'+result[i].KODE+'" style="display: table; margin: 0 auto;"><p class="table-name">'+(result[i].NAMA.match(/^\d/) ? "Table #"+result[i].NAMA : result[i].NAMA)+'</p></div></div>';
  //       }
  //     }

  //     $('#mejaaktif').html(content);

  //     refresh_meja = setTimeout(function(){
  //       listMeja(kat);
  //     }, 10 * 1000);
  //   }
  // })

  app.request({
    url: addr+"API/meja/" +kat+ "/",
    method: "GET",
    success: function(json){
      var result = JSON.parse(json);
      var font = '';
      // console.log(result);
      // content += '<div class="col-33" style="height: calc((90vw / 3) - 5px); margin: 20px 5px" onclick="listKategoriMeja();">\
      //               <div>\
      //               <button onclick="listKategoriMeja() class="no-ripple" style="margin: 10px 0; height: calc((90vw / 3) - 5px); width: calc(90vw / 3); vertical-align: middle; background: #2196f3; color: white; border-radius: 15px;"><p style="'+(window.innerWidth > 480 ? "font-size: 1.5rem;" : "")+'">"BACK"</p></button>\
      //                 <p class="table-name">Back</p>\
      //               </div>\
      //             </div>';

      // console.table(result);
      content += '<div onclick="listKategoriMeja()" class="" style="margin: 10px 1px; height: calc((90vw / 3) - 5px); width: calc(90vw / 3); vertical-align: middle; background: #2196f3; color: white; border-radius: 50%;"><p style="margin: auto; text-align: center; vertical-align: middle; line-height: calc((90vw / 3) - 5px); '+(window.innerWidth > 480 ? "font-size: 8rem;" : "font-size: 6rem;")+'">&larr;</p></div>';

                  
      for(var i = 0; i < result.length; i++){
        // console.log(result[i].NAMA);
        // if(result[i].ST == '0' || result[i].ST == '1'){
        //   st_meja = "(In use)";
        //   img = (window.innerWidth < 480) ? 'img/'+result[i].KODE+'.png' : 'img/'+result[i].KODE+'-150.png';
        // } else {
        //   st_meja = "(Available)";
        //   img = (window.innerWidth < 480) ? 'img/'+result[i].KODE+'-Hijau.png' : 'img/'+result[i].KODE+'-Biru-150.png';
        // }
        // content += '<div id="meja'+result[i].KODE+'" class="col-50 tablet-25 floated" style="height: 150px; width: 150px; margin: 5px" onclick="checkMeja(this)">Table '+result[i].NAMA+'<br />'+st_meja+'</div>'; <img src="img/01 Hijau.png" alt="img-meja-01" style="transform: translateY(20px);">
        // content += '<div id="meja'+result[i].KODE+'" class="col-50 tablet-25 floated" style="height: 150px; width: 150px; margin: 5px" onclick="lihatmeja('+result[i].KODE+','+(result[i].ST == '1' ? result[i].id_pj : 0)+')">Table '+result[i].NAMA+'<br />'+st_meja+'</div>';
        // content += '<div id="meja'+result[i].KODE+'" class="col-50 tablet-50 floated" style="height: calc((90vw / 3) - 5px); width: calc((90vw / 3) - 5px); margin: 5px" onclick="lihatmeja('+result[i].KODE+','+(result[i].ST == '1' ? result[i].id_pj : 0)+')"><img src="'+img+'" alt="img-meja-'+result[i].KODE+'" style="transform: translateY(15px) scale(1.2);"><p style="transform: translateY(5px);">Table '+result[i].NAMA+'</p></div>';

        // if(window.innerWidth > 480){
        // }

        if(result[i].NAMA.length > 5){
          font = "font-size: 1.2rem;";
        } else {
          font = "font-size: 2.4rem;";
        }

        if(result[i].stbook == '1'){ // Meja telah direserve

          if(result[i].ST == '1') { // Meja masih ada outstanding bill
            content += '<div onclick="onReserved(\''+result[i].jambook+'\', \''+result[i].namabook+'\')" class="" style="margin: 10px 1px; height: calc((90vw / 3) - 5px); width: calc(90vw / 3); vertical-align: middle; background: #8B0000; color: white; border-radius: 50%;"><p class="" style="margin: auto; text-align: center; vertical-align: middle; line-height: calc((90vw / 3) - 5px); font-size: 1.2rem;">Reserved</p></div>';
          } else {
            content += '<div onclick="onReserved(\''+result[i].jambook+'\', \''+result[i].namabook+'\')" class="" style="margin: 10px 1px; height: calc((90vw / 3) - 5px); width: calc(90vw / 3); vertical-align: middle; background: #ffebcd; color: black; border-radius: 50%;"><p class="" style="margin: auto; text-align: center; vertical-align: middle; line-height: calc((90vw / 3) - 5px); '+font+'">'+result[i].NAMA+'</p></div>';
          }

        } else if(result[i].ST == '1'){ // Meja telah diisi
          content += '<div onclick="lihatmeja(\''+result[i].KODE+'\', '+result[i].id_pj+', \'' +result[i].NAMA+ '\', ' +result[i].idreservasi+ ', ' +result[i].curitem+ ', \'' +result[i].nama_cust+ '\')" class="" style="margin: 10px 1px; height: calc((90vw / 3) - 5px); width: calc(90vw / 3); vertical-align: middle; background: #8B0000; color: white; border-radius: 50%;"><p class="" style="margin: auto; text-align: center; vertical-align: middle; line-height: calc((90vw / 3) - 5px); '+font+'">'+result[i].NAMA+'</p></div>';
        } else if(result[i].ST == '3'){ // Meja butuh dibersihkan
          content += '<div onclick="onPrepare()" class="" style="margin: 10px 1px; height: calc((90vw / 3) - 5px); width: calc(90vw / 3); vertical-align: middle; background: #b8860b; color: white; border-radius: 50%;"><p class="" style="margin: auto; text-align: center; vertical-align: middle; line-height: calc((90vw / 3) - 5px); '+font+'">'+result[i].NAMA+'</p></div>';
        } else if(result[i].hold > 0){ // Meja sedang melakukan order
          // content += '<div onclick="onHold(\'' +result[i].user_hold+ '\', \''+result[i].KODE+'\', '+result[i].id_pj+', \'' +result[i].NAMA+ '\', ' +result[i].idreservasi+ ', ' +result[i].curitem+ ', \'' +result[i].nama_cust+ '\')" class="" style="margin: 10px 1px; height: calc((90vw / 3) - 5px); width: calc(90vw / 3); vertical-align: middle; background: #b8860b; color: white; border-radius: 50%;"><p class="" style="margin: auto; text-align: center; vertical-align: middle; line-height: calc((90vw / 3) - 5px); '+font+'">'+result[i].NAMA+'</p></div>';
          content += '<div onclick="onHold(\'' +result[i].user_hold+ '\', \''+result[i].KODE+'\', '+result[i].id_pj+', \'' +result[i].NAMA+ '\', ' +result[i].idreservasi+ ', ' +result[i].curitem+ ', \'\')" class="" style="margin: 10px 1px; height: calc((90vw / 3) - 5px); width: calc(90vw / 3); vertical-align: middle; background: #b8860b; color: white; border-radius: 50%;"><p class="" style="margin: auto; text-align: center; vertical-align: middle; line-height: calc((90vw / 3) - 5px); '+font+'">'+result[i].NAMA+'</p></div>';
        } else { // Meja open
          if(result[i].aktif == '0'){
            content += '<div onclick="lihatmeja(\''+result[i].KODE+'\', 0, \'' +result[i].NAMA+ '\', ' +result[i].idreservasi+ ', 0, \'\')" class="" style="margin: 10px 1px; height: calc((90vw / 3) - 5px); width: calc(90vw / 3); vertical-align: middle; background: #008000; color: white; border-radius: 50%;"><p class="" style="margin: auto; text-align: center; vertical-align: middle; line-height: calc((90vw / 3) - 5px); '+font+'">'+result[i].NAMA+'</p></div>';
          } else {
            content += '<div onclick="lihatmeja(\''+result[i].KODE+'\', 0, \'' +result[i].NAMA+ '\', ' +result[i].idreservasi+ ', 0, \'\')" class="" style="margin: 10px 1px; height: calc((90vw / 3) - 5px); width: calc(90vw / 3); vertical-align: middle; background: #b8860b; color: white; border-radius: 50%;"><p class="" style="margin: auto; text-align: center; vertical-align: middle; line-height: calc((90vw / 3) - 5px); '+font+'">'+result[i].NAMA+'</p></div>';
          }
        }

        // if(result[i].hold > 0){
        //   // content += '<div id="meja'+result[i].KODE+'" class="col-33" style="height: calc((90vw / 3) - 5px); margin: 20px 5px" onclick="onHold();"><div><img src="'+img+'" alt="img-meja-'+result[i].KODE+'" style="display: table; margin: 0 auto;"><p class="table-name">'+(result[i].NAMA.match(/^\d/) ? "Table #"+result[i].NAMA : result[i].NAMA)+'</p></div></div>';
        //   // content += '<button onclick="listKategoriMeja() class="no-ripple" style="margin: 10px 0; height: calc((90vw / 3) - 5px); width: calc(90vw / 3); vertical-align: middle; background: #ffcc00; color: white; border-radius: 50%;"><p class="table-name" style="'+(window.innerWidth > 480 ? "font-size: 1.5rem;" : "")+'">'+(result[i].NAMA.match(/^\d/) ? "Table #"+result[i].NAMA : result[i].NAMA)+'</p></button>';
        //   // content += '<button onclick="onHold()" class="" style="margin: 10px 0; height: calc((90vw / 3) - 5px); width: calc(90vw / 3); vertical-align: middle; background: #ffcc00; color: white; border-radius: 50%;"><p class="" style="margin: auto; text-align: center; vertical-align: middle; line-height: calc((90vw / 3) - 5px); '+(window.innerWidth > 480 ? "font-size: 2.4rem;" : "font-size: 1.2rem;")+'">'+result[i].NAMA+'</p></button>';
        //   content += '<div onclick="onHold()" class="" style="margin: 10px 1px; height: calc((90vw / 3) - 5px); width: calc(90vw / 3); vertical-align: middle; background: #ffcc00; color: white; border-radius: 50%;"><p class="" style="margin: auto; text-align: center; vertical-align: middle; line-height: calc((90vw / 3) - 5px); '+font+'">'+result[i].NAMA+'</p></div>';
        // } else if(result[i].ST == '3'){
        //   // content += '<div id="meja'+result[i].KODE+'" class="col-33" style="height: calc((90vw / 3) - 5px); margin: 20px 5px" onclick="onHold();"><div><img src="'+img+'" alt="img-meja-'+result[i].KODE+'" style="display: table; margin: 0 auto;"><p class="table-name">'+(result[i].NAMA.match(/^\d/) ? "Table #"+result[i].NAMA : result[i].NAMA)+'</p></div></div>';
        //   // content += '<button onclick="listKategoriMeja() class="no-ripple" style="margin: 10px 0; height: calc((90vw / 3) - 5px); width: calc(90vw / 3); vertical-align: middle; background: #ffcc00; color: white; border-radius: 50%;"><p class="table-name" style="'+(window.innerWidth > 480 ? "font-size: 1.5rem;" : "")+'">'+(result[i].NAMA.match(/^\d/) ? "Table #"+result[i].NAMA : result[i].NAMA)+'</p></button>';
        //   // content += '<button onclick="onHold()" class="" style="margin: 10px 0; height: calc((90vw / 3) - 5px); width: calc(90vw / 3); vertical-align: middle; background: #ffcc00; color: white; border-radius: 50%;"><p class="" style="margin: auto; text-align: center; vertical-align: middle; line-height: calc((90vw / 3) - 5px); '+(window.innerWidth > 480 ? "font-size: 2.4rem;" : "font-size: 1.2rem;")+'">'+result[i].NAMA+'</p></button>';
        //   content += '<div onclick="onPrepare()" class="" style="margin: 10px 1px; height: calc((90vw / 3) - 5px); width: calc(90vw / 3); vertical-align: middle; background: #b8860b; color: white; border-radius: 50%;"><p class="" style="margin: auto; text-align: center; vertical-align: middle; line-height: calc((90vw / 3) - 5px); '+font+'">'+result[i].NAMA+'</p></div>';
        // } else if(result[i].ST == '0' || result[i].ST == '1') {
        //   // content += '<div id="meja'+result[i].KODE+'" class="col-33" style="height: calc((90vw / 3) - 5px); margin: 20px 5px" onclick="lihatmeja('+result[i].KODE+','+(result[i].ST == '1' ? result[i].id_pj : 0)+')"><div><img src="'+img+'" alt="img-meja-'+result[i].KODE+'" style="display: table; margin: 0 auto;"><p class="table-name">'+(result[i].NAMA.match(/^\d/) ? "Table #"+result[i].NAMA : result[i].NAMA)+'</p></div></div>';
        //   // content += '<button onclick="lihatmeja('+result[i].KODE+', 0)" class="no-ripple" style="margin: 10px 0; height: calc((90vw / 3) - 5px); width: calc(90vw / 3); vertical-align: middle; background: #f44336; color: white; border-radius: 50%;"><p class="table-name" style="'+(window.innerWidth > 480 ? "font-size: 1.5rem;" : "")+'">'+(result[i].NAMA.match(/^\d/) ? "Table #"+result[i].NAMA : result[i].NAMA)+'</p></button>';
        //   // content += '<button onclick="lihatmeja(\''+result[i].KODE+'\', '+result[i].id_pj+')" class="" style="margin: 10px 0; height: calc((90vw / 3) - 5px); width: calc(90vw / 3); vertical-align: middle; background: #f44336; color: white; border-radius: 50%;"><p class="" style="margin: auto; text-align: center; vertical-align: middle; line-height: calc((90vw / 3) - 5px); '+(window.innerWidth > 480 ? "font-size: 2.4rem;" : "font-size: 1.2rem;")+'">'+result[i].NAMA+'</p></button>';
        //   content += '<div onclick="lihatmeja(\''+result[i].KODE+'\', '+result[i].id_pj+')" class="" style="margin: 10px 1px; height: calc((90vw / 3) - 5px); width: calc(90vw / 3); vertical-align: middle; background: #f44336; color: white; border-radius: 50%;"><p class="" style="margin: auto; text-align: center; vertical-align: middle; line-height: calc((90vw / 3) - 5px); '+font+'">'+result[i].NAMA+'</p></div>';
        // } /* else if(reservasi) {
        //   content += '<div onclick="onReserved()" class="" style="margin: 10px 1px; height: calc((90vw / 3) - 5px); width: calc(90vw / 3); vertical-align: middle; background: #ffebcd; color: saddlebrown; border-radius: 50%;"><p class="" style="margin: auto; text-align: center; vertical-align: middle; line-height: calc((90vw / 3) - 5px); '+font+'">'+result[i].NAMA+'</p></div>';
        // } */ else {
        //   // content += '<button onclick="lihatmeja('+result[i].KODE+','+result[i].id_pj+')" class="no-ripple" style="margin: 10px 0; height: calc((90vw / 3) - 5px); width: calc(90vw / 3); vertical-align: middle; background: #4caf50; color: white; border-radius: 50%;"><p class="table-name" style="'+(window.innerWidth > 480 ? "font-size: 1.5rem;" : "")+'">'+(result[i].NAMA.match(/^\d/) ? "Table #"+result[i].NAMA : result[i].NAMA)+'</p></button>';
        //   // content += '<button onclick="lihatmeja(\''+result[i].KODE+'\', 0)" class="" style="margin: 10px 0; height: calc((90vw / 3) - 5px); width: calc(90vw / 3); vertical-align: middle; background: #4caf50; color: white; border-radius: 50%;"><p class="" style="margin: auto; text-align: center; vertical-align: middle; line-height: calc((90vw / 3) - 5px); '+(window.innerWidth > 480 ? "font-size: 2.4rem;" : "font-size: 1.2rem;")+'">'+result[i].NAMA+'</p></button>';
        //   content += '<div onclick="lihatmeja(\''+result[i].KODE+'\', 0)" class="" style="margin: 10px 1px; height: calc((90vw / 3) - 5px); width: calc(90vw / 3); vertical-align: middle; background: #4caf50; color: white; border-radius: 50%;"><p class="" style="margin: auto; text-align: center; vertical-align: middle; line-height: calc((90vw / 3) - 5px); '+font+'">'+result[i].NAMA+'</p></div>';
        // }
      }

      $('#mejaaktif').html(content);

      refresh_meja = setTimeout(function(){
        listMeja(kat);
      }, 3 * 1000);
    }
  })
}

function lihatmeja(meja, pj, nmeja, reservasi, curitem, namabook){
  var idpeg = window.localStorage.getItem("id_peg");

  curTable = nmeja;
  fromRsv = reservasi;
  namaorder = namabook;
  // app.views.main.router.navigate({
  //   name: 'menu',
  //   params: {idMeja : meja, idPJ : pj}
  // });
  
  // if(pj > 0){

  // logging di meja_tmp
  app.request({
    url: addr+ "/API/waitress/" +meja+ "/get/",
    method: "POST",
    data: JSON.stringify({id_meja: meja, id_user: idpeg}),
    success: function(res){
      var result = JSON.parse(res);

      if(result.status == 1){
        app.request({
          url: addr+ "API/waitress/" +meja+ "/add/",
          method: "POST",
          data: JSON.stringify({id_meja: meja, id_user: idpeg}),
          success: function(result){
            console.log('setWaitress', result);
          }
        })

        if(curitem > 0 && pj != '0'){ // jika sudah pernah pesan dan bukan customer baru
          app.views.main.router.navigate({
            name: 'pesanan',
            params: {idMeja : meja, idPJ : pj}
          });
        }  else if(reservasi > 0) { // jika customer dari reservasi
          app.views.main.router.navigate({
            name: 'menu',
            params: {idMeja : meja, idPJ : pj}
          });
        } else {
          app.views.main.router.navigate({
            name: 'menu',
            params: {idMeja : meja, idPJ : 0}
          });
        }

      } else {
        // app.request({
        //   url: addr+ "API/waitress/" +meja+ "/delete/",
        //   method: "POST",
        //   data: JSON.stringify({id_user: idpeg, id_meja: meja}),
        //   success: function(result){
        //     console.log("back del", result);
        //   }
        // })

        app.toast.create({
          text: 'Order for this table is being taken by ' +result.waitress+ '.', 
          closeButton: true, 
          destroyOnClose: true, 
          closeTimeout: 2000
        }).open();
        // app.views.main.router.navigate('/');
      }
    }
  })
}

function listReservasi(){
  var tabel = '';
  app.request({
    url: addr+"API/reservasi/",
    method: "GET",
    success: function(json){
      var result = JSON.parse(json);
      tabel = '<table>\
                <thead>\
                  <tr>\
                    <th class="label-cell"><b>Customer Name</b></th>\
                    <th><b>Telp</b></th>\
                    <th><b>Table Name</b></th>\
                    <th><b>Pax Amount</b></th>\
                    <th><b>Booking Date</b></th>\
                    <th><b>Booking Time</b></th>\
                    <th></th>\
                  </tr>\
                </thead>\
                <tbody>';

      for(var i = 0; i < result.length; i++){
        tabel += '<tr>\
                  <td class="label-cell"><b>'+result[i].namabook+'</b></td>\
                  <td><b>'+result[i].telpbook+'</b></td>\
                  <td><b>'+result[i].meja+'</b></th>\
                  <td><b>'+result[i].pax+'</b></td>\
                  <td><b>'+result[i].tglbook+'</b></td>\
                  <td><b>'+result[i].jambook+'</b></td>\
                  <td ><a onclick="checkIn('+result[i].idbook+')">Proses</a></td>\
                </tr>';
      }

      tabel += "</table>";
      $('#reservations').html(tabel);
    }
  })
}

function cariReservasi(namabook, tglbook){
  if(namabook && tglbook){

    var tabel = '';
    var temp = {
      namabook : namabook, 
      tglbook : tglbook,
      tipe : "cari"
    };
  
    app.request({
      url: addr+"API/reservasi/",
      method: "POST",
      data: JSON.stringify(temp),
      success: function(json){
        var result = JSON.parse(json);
        tabel = '<table>\
                  <thead>\
                    <tr>\
                      <th class="label-cell"><b>Customer Name</b></th>\
                      <th><b>Telp</b></th>\
                      <th><b>Table Name</b></th>\
                      <th><b>Pax Amount</b></th>\
                      <th><b>Booking Date</b></th>\
                      <th><b>Booking Time</b></th>\
                      <th></th>\
                    </tr>\
                  </thead>\
                  <tbody>';
  
        for(var i = 0; i < result.length; i++){
          tabel += '<tr>\
                    <td class="label-cell"><b>'+result[i].namabook+'</b></td>\
                    <td><b>'+result[i].telpbook+'</b></td>\
                    <td><b>'+result[i].meja+'</b></th>\
                    <td><b>'+result[i].pax+'</b></td>\
                    <td><b>'+result[i].tglbook+'</b></td>\
                    <td><b>'+result[i].jambook+'</b></td>\
                    <td ><a onclick="checkIn('+result[i].idbook+')">Proses</a></td>\
                  </tr>';
        }
  
        tabel += "</table>";
        $('#reservations').html(tabel);
      }
    })
  } else {
    alert('Empty fields');
  }
}

function checkIn(idbook){
  var temp = {
    idbook : idbook,
    tipe : "simpan"
  };

  app.request({
    url: addr+"API/reservasi/",
    method: "POST",
    data: JSON.stringify(temp),
    success: function(json){
      console.log(json);
      listReservasi();
    }
  })
}

function rowKategori(meja){
  var datanya = "";
  app.toolbar.hide('#toolbar_menu');
  app.request({
    url: addr+ "API/kategori/",
    method: "GET",
    success: function(json){
      var result = JSON.parse(json);
      for (i = 0; i < result.length; i++){
        datanya += '<button onclick="tampil('+meja+','+result[i].id_sub+')" class="no-ripple" style="margin: 10px 0; height: calc((90vw / 3) - 5px); width: calc(90vw / 3); vertical-align: middle; background: #2196f3; color: white; border-radius: 15px;"><p style="' +(window.innerWidth > 480 ? "font-size: 1.5rem;" : "")+ '">' +result[i].nama_kat+ '</p></button>';
      }

      datanya += '<button class="no-ripple" style="visibility: hidden; margin: 10px 0; height: calc((90vw / 3) - 5px); width: calc(90vw / 3); vertical-align: middle; background: #2196f3; color: white; border-radius: 15px;"><p style="'+(window.innerWidth > 480 ? "font-size: 1.5rem;" : "")+'">NIL</p></button>';
      $('#menuku').html(datanya);
    }
  })
}

function listKategori(meja){
  var data = "";
  app.request({
    url: addr+"API/kategori/",
    method: "GET",
    success: function(json){
      var result = JSON.parse(json);
      data += `<option value="0" selected>SELECT CATEGORIES HERE</option>`;;
      for(var i = 0; i < result.length; i++){
        // data += `<option value="`+result[i].id_sub+`" `+(result[i].id_sub == 1 ? 'selected' : '')+`>`+result[i].nama_kat+`</option>`;
        data += `<option value="`+result[i].id_sub+`">`+result[i].nama_kat+`</option>`;
      }

      $('#kategori').html(data);
      tampil(meja, $('#kategori').val());
    }
  })
}

function tampil(meja, kat){
  var id_gudang = window.localStorage.getItem('gudang');
  var tb_cat = 
    `<div style="text-align: center;" onclick="rowKategori(' `+meja+` ')">
      <i class="icon material-icons md-only">apps</i>
      <span class="tabbar-label">Categories</span>
    </div>`;
  
  $('#toolbar_cat').html(tb_cat);
  app.toolbar.show("#toolbar_menu");
  app.request({
    url: addr+"API/barang/"+id_gudang+"/"+kat+"/",
    method: "GET",
    success: function(json){
      if(json){
        var result = JSON.parse(json);
        var datanya = '';
        var len = (result.length < 23 ? result.length : 23);
        datanya += '<button onclick="rowKategori(' +meja+ ')" class="no-ripple" style="margin: 10px 0; height: calc((90vw / 3) - 5px); width: calc(90vw / 3); vertical-align: middle; background: #2196f3; color: white; border-radius: 15px;"><p style="' +(window.innerWidth > 480 ? "font-size: 4em;" : "font-size: 3em;")+ '">&larr;</p></button>';

        for (i = 0; i < result.length; i++){
          datanya+="<button onclick=\"addQty('"+meja+"','"+result[i].id_barang+"','1','"+result[i].harga+"','"+result[i].nama_barang.replace(/(')/g, '\\$1')+"')\" class=\"no-ripple\" style=\"margin: 10px 0; height: calc((90vw / 3) - 5px); width: calc(90vw / 3); vertical-align: middle; background: #2196f3; color: white; border-radius: 15px;\"><p style=\""+(window.innerWidth > 480 ? "font-size: 1.5rem;" : "")+"\">"+result[i].nama_barang.replace(/ \([\w \W]+\)/g, '')+"</p></button>";
        }

        datanya+="<button class=\"no-ripple\" style=\"visibility: hidden; margin: 10px 0; height: calc((90vw / 3) - 5px); width: calc(90vw / 3); vertical-align: middle; background: #2196f3; color: white; border-radius: 15px;\"><p style=\""+(window.innerWidth > 480 ? "font-size: 1.5rem;" : "")+"\">NIL</p></button>";
        $('#menuku').html(datanya);
      }
    }
  })
}

// function tampil(meja, kat){
//   var id_gudang = window.localStorage.getItem('gudang');
//   // var id_cabang = window.localStorage.getItem('cabang');
//   var tb_cat = 
//     `<div style="text-align: center;" onclick="rowKategori(' `+meja+` ')">
//       <i class="icon material-icons md-only">apps</i>
//       <span class="tabbar-label">Categories</span>
//     </div>`;
  
//   $('#toolbar_cat').html(tb_cat);
//   app.toolbar.show("#toolbar_menu");
//   app.request({
//     // url: addr+"API/barang/"+id_cabang+"/"+id_gudang+"/"+kat+"/",
//     url: addr+"API/barang/"+id_gudang+"/"+kat+"/",
//     method: "GET",
//     success: function(json){
//       if(json){
//         var result = JSON.parse(json);
//         var datanya = '';
//         var len = (result.length < 23 ? result.length : 23);
//         datanya += '<button onclick="rowKategori(' +meja+ ')" class="no-ripple" style="margin: 10px 0; height: calc((90vw / 3) - 5px); width: calc(90vw / 3); vertical-align: middle; background: #2196f3; color: white; border-radius: 15px;"><p style="' +(window.innerWidth > 480 ? "font-size: 4em;" : "font-size: 3em;")+ '">&larr;</p></button>';

//         // for (i = 0; i < len; i++){
//         for (i = 0; i < result.length; i++){
//           // datanya+="<div onclick=\"simpan('"+meja+"','"+result[i].id_barang+"','1','"+result[i].harga+"','"+result[i].nama_barang+"')\" class=\"col-45\" style=\"padding-top:22.5%;text-align:left;margin:5px;position:relative;\">"+result[i].nama_barang.replace(/ \([\w \W]+\)/g, '')+"<div><h3><strong> Rp. "+parseInt((result[i].harga ? result[i].harga : 0)).toLocaleString()+"</strong></h3></div></div>";
//           // datanya+="<button onclick=\"simpan('"+meja+"','"+result[i].id_barang+"','1','"+result[i].harga+"','"+result[i].nama_barang+"')\" class=\"col-45 no-ripple\" style=\"margin: 5px; height: calc((90vw / 3) - 5px); width: calc((90vw / 3) - 5px); vertical-align: middle; background: #2196f3; color: white; border-radius: 15px;\"><p style=\"font-size: 1.7em\">"+result[i].nama_barang.replace(/ \([\w \W]+\)/g, '')+"</p></button>";
//           // datanya+="<button onclick=\"addQty('"+meja+"','"+result[i].id_barang+"','1','"+result[i].harga+"','"+result[i].nama_barang+"')\" class=\"col-45 no-ripple\" style=\"margin: 5px; height: calc((90vw / 3) - 5px); width: calc((90vw / 3) - 5px); vertical-align: middle; background: #2196f3; color: white; border-radius: 15px;\"><p style=\"font-size: 1.7em\">"+result[i].nama_barang.replace(/ \([\w \W]+\)/g, '')+"</p></button>";
//           datanya+="<button onclick=\"addQty('"+meja+"','"+result[i].id_barang+"','1','"+result[i].harga+"','"+result[i].nama_barang.replace(/(')/g, '\\$1')+"')\" class=\"no-ripple\" style=\"margin: 10px 0; height: calc((90vw / 3) - 5px); width: calc(90vw / 3); vertical-align: middle; background: #2196f3; color: white; border-radius: 15px;\"><p style=\""+(window.innerWidth > 480 ? "font-size: 1.5rem;" : "")+"\">"+result[i].nama_barang.replace(/ \([\w \W]+\)/g, '')+"</p></button>";
//         }

//         datanya+="<button class=\"no-ripple\" style=\"visibility: hidden; margin: 10px 0; height: calc((90vw / 3) - 5px); width: calc(90vw / 3); vertical-align: middle; background: #2196f3; color: white; border-radius: 15px;\"><p style=\""+(window.innerWidth > 480 ? "font-size: 1.5rem;" : "")+"\">NIL</p></button>";
//         $('#menuku').html(datanya);
//       }
//     }
//   })
// }

function cariItem(e, q, meja){
  // var cabang = window.localStorage.getItem('cabang');
  var gudang = window.localStorage.getItem('gudang');
  var temp = {
    query : q
  }

  if ( (window.event ? event.keyCode : e.which) == 13) {
    app.request({
      // url: addr+"API/barang/"+cabang+"/"+gudang+"/",
      url: addr+"API/barang/"+gudang+"/",
      method: "POST",
      data: JSON.stringify(temp),
      success: function(json){
        var result = JSON.parse(json);
        var datanya = '';
        var len = (result.length < 24 ? result.length : 24);

        for (i = 0; i < len; i++){
          // datanya+="<div onclick=\"simpan('"+meja+"','"+result[i].id_barang+"','1','"+result[i].harga+"','"+result[i].nama_barang+"')\" class=\"col-45\" style=\"padding-top:22.5%;text-align:left;margin:5px;position:relative;\">"+result[i].nama_barang.replace(/ \([\w \W]+\)/g, '')+"<div><h3><strong> Rp. "+parseInt((result[i].harga ? result[i].harga : 0)).toLocaleString()+"</strong></h3></div></div>";
          datanya+="<button onclick=\"addQty('"+meja+"','"+result[i].id_barang+"','1','"+result[i].harga+"','"+result[i].nama_barang.replace(/(')/g, "\\$1")+"')\" class=\"no-ripple\" style=\"margin: 10px 0; height: calc((90vw / 3) - 5px); width: calc(90vw / 3); vertical-align: middle; background: #2196f3; color: white; border-radius: 15px;\"><p style=\""+(window.innerWidth > 480 ? "font-size: 1.5rem;" : "")+"\">"+result[i].nama_barang.replace(/ \([\w \W]+\)/g, '')+"</p></button>";
        }
        datanya+="<button class=\"no-ripple\" style=\"visibility: hidden; margin: 10px 0; height: calc((90vw / 3) - 5px); width: calc(90vw / 3); vertical-align: middle; background: #2196f3; color: white; border-radius: 15px;\"><p style=\""+(window.innerWidth > 480 ? "font-size: 1.5rem;" : "")+"\">NIL</p></button>";
        $('#menuku').html(datanya);
      }
    }) 
  }
}

function editQty(meja, id, amt, harga, nama, idpj){
  app.dialog.create({
    title: 'New amt for '+nama+':',
    closeByBackdropClick: true,
    content: `<div class="list no-hairlines no-hairlines-between box-appear">
                <ul style="height: 100%;">
                  <li class="item-content item-input" style="height: inherit;">
                    <div class="item-inner" style="height: inherit;">
                      <div class="item-input-wrap" style="height: inherit;">
                        <input class="input-box" type="number" onClick="this.select();" name="editAmt" id="editAmt" value="`+amt+`" style="text-align: center; height: inherit;" />
                      </div>
                    </div>
                  </li>
                </ul>
              </div>`,
    buttons: [
    {
      text: 'Confirm',
      onClick: function(dialog, e){
        var amt_to_add = $('#editAmt').val();
        if(amt_to_add > 0){
          edit(meja, id, amt_to_add, harga, '', idpj);
        }
      }
    }]
  }).open();
}

function addQty(meja, id, amt, harga, nama, idpj){
  var idpeg = window.localStorage.getItem("id_peg");
  // app.request({
  //   url: addr+ 'API/waitress/' +meja+ '/get/',
  //   method: "POST",
  //   data: JSON.stringify({id_user: idpeg, id_meja: meja}),
  //   success: function(res){
  //     var result = JSON.parse(res);
  //     if(result.status == 1){

        // 26 Aug 2020
        app.dialog.create({
          title: 'Amt of '+nama.replace(/\'/g, '\'')+' to add:',
          closeByBackdropClick: true,
          content: `<div class="list no-hairlines no-hairlines-between box-appear">
                      <ul style="height: 100%;">
                        <li class="item-content item-input" style="height: inherit;">
                          <div class="item-inner" style="height: inherit;">
                            <div class="item-input-wrap" style="height: inherit;">
                              <input class="input-box" type="number" onClick="this.select();" name="addAmt" id="addAmt" value="`+amt+`" style="text-align: center; height: inherit;" />
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>`,
          buttons: [
          {
            text: 'Confirm',
            onClick: function(dialog, e){
              var amt_to_add = $('#addAmt').val();
              simpan(meja, id, amt_to_add, harga, '', idpj)
            }
          }]
        }).open();
        // 26 Aug 2020

  //     } else {
  //       app.request({
  //         url: addr+ "API/waitress/" +meja+ "/delete/",
  //         method: "POST",
  //         data: JSON.stringify({id_user: idpeg, id_meja: meja}),
  //         success: function(result){
  //           console.log("back del", result);
  //         }
  //       })
  //       app.views.main.router.navigate('/');
  //     }
  //   }
  // })

}

function edit(meja, id, qty, harga, nama, idpj){
  var idp = window.localStorage.getItem("id_peg");
  var temp = {
    id_barang : id,
    harga : harga,
    qty : qty,
    user_id : idp,
    act : "update"
  }

  app.request({
    url: addr+"API/cart/"+meja+"/",
    method: "POST",
    data: JSON.stringify(temp),
    success: function(){
      lihatKeranjang(meja, idpj);
      app.toast.create({
        text: 'Amount updated', 
        closeButton: true, 
        destroyOnClose: true, 
        closeTimeout: 1000
      }).open();
    }
  })
}

function simpan(meja, id, qty, harga, nama, idpj){
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
      lihatKeranjang(meja, idpj);
      app.toast.create({
        text: 'Added to cart', 
        closeButton: true, 
        destroyOnClose: true, 
        closeTimeout: 1000
      }).open();
    }
  })


  /* app.request({
    url: addr+ "API/cek/" +meja+ "/" +idp+ "/",
    method: "GET",
    success: function(result){
      var json = JSON.parse(json)
      // if(result[0].cek == '0'){
        
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
            lihatKeranjang(meja, idpj);
            app.toast.create({
              text: 'Added to cart', 
              closeButton: true, 
              destroyOnClose: true, 
              closeTimeout: 1000
            }).open();
          }
        })
      // } else {
      //   app.toast.create({
      //     text: 'Other Waitress has already inputted orders, returning to table selection', 
      //     closeButton: true, 
      //     destroyOnClose: true, 
      //     closeTimeout: 3000
      //   }).open();
      //   app.views.main.router.navigate('/home/');
      // }
    }
  }) */

}

function lihatKeranjang(meja, idpj){
  var data = "";
  var jumlah = 0;
  app.request({
    url: addr+"API/cart/"+meja+"/",
    method: "GET",
    success: function(json){
      var result = JSON.parse(json);

      console.log(idpj);

      if(idpj == 0){
        data +='<li class="list-group-title" style="font-size: 1.0em; height: 65px; padding-top: 10px;">Table '+curTable+' | '+namaorder+' / '+paxorder+' Pax<a class="link icon-only" onclick="editPax('+meja+', '+idpj+', 0);" style="margin: 0 10px; transform: translateY(8px);"><i class="icon material-icons md-only" style="font-size: 1.5em;">edit</i></a></li>';
      } else if(fromRsv > 0) {
        data +='<li class="list-group-title" style="font-size: 1.0em; height: 65px; padding-top: 10px;">Table '+curTable+' | '+namaorder+' / '+paxorder+' Pax<a class="link icon-only" onclick="editPax('+meja+', '+idpj+', 1);" style="margin: 0 10px; transform: translateY(8px);"><i class="icon material-icons md-only" style="font-size: 1.5em;">edit</i></a></li>';
      } else {
        data +='<li class="list-group-title" style="font-size: 1.0em; height: 65px; padding-top: 10px;">Table '+curTable+' | '+namaorder+' / '+paxorder+' Pax</li>';
      }


      for(var i = 0; i < result.length; i++){
        jumlah += parseInt(result[i].harga_tmp) * parseInt(result[i].qty_tmp);
        data += ` <li class="item-content ">
                    <div class="item-inner">
                      <div class="item-title" >`+result[i].qty_tmp+` x `+result[i].nama_barang+`
                        <div class="item-footer">`+(result[i].catatan ? result[i].catatan : '')+`</div>
                      </div>
                      <div class="item-after">
                        <!-- <a href="#" onclick="addQty(`+meja+`, `+result[i].id_barang+`, 1, `+result[i].harga_tmp+`, '`+result[i].nama_barang+`')" style="margin: 0px 5px;"><i class="icon f7-icons">add</i></a> -->
                        <a href="#" onclick="editQty(`+meja+`, `+result[i].id_barang+`, 1, `+result[i].harga_tmp+`, '`+result[i].nama_barang.replace(/(')/g, '\\$1')+`', '`+idpj+`')" style="margin: 0px 5px;"><i class="icon f7-icons">add</i></a>
                        <a href="#" onclick="addCatatan(`+result[i].id_tmp+`,`+meja+`, '`+idpj+`')" style="margin: 0px 5px;"><i class="icon material-icons md-only">edit</i></a>
                        <a href="#" onclick="hapusItem(`+result[i].id_tmp+`,`+meja+`, '`+idpj+`')" style="margin: 0px 5px;"><i class="icon material-icons md-only">remove_shopping_cart</i></a>
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

function addCatatan(idtmp, meja, idpj){
  app.dialog.prompt('Notes:', 'Title', 
    function(catt){
      var temp = {
        act : "catatan",
        id_tmp : idtmp,
        catatan : catt
      }

      app.request({
        url: addr+"API/cart/"+meja+"/",
        method: "POST",
        data: JSON.stringify(temp),
        success: function(json){
          if(json){
            app.toast.create({
              text: 'Notes successfully added', 
              closeButton: true, 
              destroyOnClose: true, 
              closeTimeout: 2000
            }).open();
          } else {
            app.toast.create({
              text: 'Failed to add note', 
              closeButton: true, 
              destroyOnClose: true, 
              closeTimeout: 2000
            }).open();
          }

          lihatKeranjang(meja, idpj);
        }
      })

      console.log(temp);
    },
    function(){
      // app.toast.create({text: 'Batal', closeTimeout: 2000}).open()
    });
}

function hapusItem(idtmp, meja, idpj){
  var temp = {
    act : "delete",
    id_tmp : idtmp,
  }

  app.request({
    url: addr+"API/cart/"+meja+"/",
    method: "POST",
    data: JSON.stringify(temp),
    success: function(json){
      if(json){
        app.toast.create({
          text: 'Item cancelled', 
          closeButton: true, 
          destroyOnClose: true, 
          closeTimeout: 2000
        }).open();
      } else {
        app.toast.create({
          text: 'Failed to cancel item', 
          closeButton: true, 
          destroyOnClose: true, 
          closeTimeout: 2000
        }).open();
      }

      lihatKeranjang(meja, idpj);
    }
  })
}

function clearCart2(idmeja, idpj){
  app.request({
    url: addr+"API/cart/"+idmeja+"/",
    method: "POST",
    data: JSON.stringify({act: "clear"}),
    success: function(){
      alert('sukses hapus');
      lihatKeranjang(idmeja, idpj);
    }
  })
}

function clearCart(meja){ // tidak dipakai per 26 Juni 2020
  // console.log(meja, idpj);
  var idpeg = window.localStorage.getItem("id_peg");

  app.request({
    url: addr+ "API/waitress/" +meja+ "/delete/",
    method: "POST",
    data: JSON.stringify({id_user: idpeg, id_meja: meja}),
    success: function(result){
      console.log("back del", result);
    }
  })
  app.views.main.router.back();

  // app.request({
  //   url: addr+"API/cart/"+meja+"/",
  //   method: "GET",
  //   success: function(json){
  //     var result = JSON.parse(json);
  //     console.log(result, result.length);
  //     if(result.length > 0){
  //       app.dialog.confirm("Items on the cart will be lost. Proceed?", "Warning", function(){
  //         app.request({
  //           url: addr+"API/cart/"+meja+"/",
  //           method: "POST",
  //           data: JSON.stringify({act: "clear"}),
  //           success: function(){
  //             app.views.main.router.back();
  //           }
  //         })
  //       })
  //     } else {
  //       app.views.main.router.back();
  //     }
  //   }
  // })
}

function cekPIN(meja, id, tipe, atasnama, pax){
  var idpeg = window.localStorage.getItem("id_peg");
  atasnama = namaorder;
  pax = paxorder;
  if(tipe == 'pesan'){
    // alert('pesan');
    simpanPesanan(meja, id, idpeg, atasnama, pax);
  } else if(tipe == 'split'){
    splitBill(id, meja, idpeg);
    // alert('split');
  }


  /* app.dialog.create({
    title: 'Employee PIN',
    closeByBackdropClick: true,
    content: `<div class="list no-hairlines no-hairlines-between box-appear">
                <ul style="height: 100%;">
                  <li class="item-content item-input" style="height: inherit;">
                    <div class="item-inner" style="height: inherit;">
                      <div class="item-input-wrap" style="height: inherit;">
                        <input class="input-box" type="number" onClick="this.select();" name="pin" id="pin" style="text-align: center; height: inherit;" />
                      </div>
                    </div>
                  </li>
                </ul>
              </div>`,
    buttons: [
    {
      text: 'Confirm',
      onClick: function(dialog, e){
        var v = $('#pin').val();
        var gudang = window.localStorage.getItem('gudang');
        var temp = {
          id_waitress : v,
        }

        if(v){
          app.request({
            url: addr+"API/login/"+gudang+"/",
            method: "POST",
            data: JSON.stringify(temp),
            success: function(json){
              if(json){
                var result = JSON.parse(json);
                if(tipe == 'pesan'){
                  // alert('pesan');
                  simpanPesanan(meja, id, result[0].ID, atasnama, pax);
                } else if(tipe == 'split'){
                  splitBill(id, meja, result[0].ID);
                  // alert('split');
                }
                dialog.close();
              } else {
                app.toast.create({text: 'PIN not recognized', closeButton: true, destroyOnClose: true, closeTimeout: 3000}).open();
              }
            }
          })
        }
      }
    }]
  }).open(); */
}

// function inputNama(meja, id, tipe){
function inputNama(idmeja){
  app.dialog.create({
    title: 'Customer Name',
    closeByBackdropClick: false,
    content: `<div class="list no-hairlines no-hairlines-between box-appearm">
                <ul style="height: 100%;">
                  <li class="item-content item-input" style="height: inherit;">
                    <div class="item-inner" style="height: inherit;">
                      <div class="item-input-wrap" style="height: inherit;">
                        <input class="input-box" type="text" onClick="this.select();" name="atasnama" id="atasnama" style="text-align: center; height: inherit;" />
                      </div>
                    </div>
                  </li>
                </ul>
              </div>`,
    buttons: [
    {
      text: 'Cancel',
      onClick: function(dialog, e){
        app.request({
          url: addr+ "API/waitress/" +idmeja+ "/delete/",
          method: "POST",
          data: JSON.stringify({id_user: idpeg, id_meja: idmeja}),
          success: function(result){
            console.log('delete', result);
          }
        })
        app.views.main.router.back();
      }
    },{
      text: 'Confirm',
      onClick: function(dialog, e){
        var atasnama = $('#atasnama').val();

        if(atasnama){
          namaorder = atasnama;
          // cekPIN(meja, id, tipe, atasnama);
        }
      }
    }]/* ,
    on: {
      closed: function(dialog, e){
        app.request({
          url: addr+ "API/waitress/" +idmeja+ "/delete/",
          method: "POST",
          data: JSON.stringify({id_peg: idpeg, id_meja: idmeja}),
          success: function(result){
            console.log('delete', result);
          }
        })
        var atasnama = $('#atasnama').val();

        if(atasnama == '' || atasnama == '0'){
          app.views.main.router.back()
          // listKategoriMeja();
          // alert('salah');
          // paxorder = pax;
          // cekPIN(meja, id, tipe, atasnama, pax);
          // inputNama()
        }
      }
    } */
  }).open()
}

// function inputPax(meja, id, tipe, atasnama){
function inputPax(idmeja){
  var idpeg = window.localStorage.getItem("id_peg");
  app.dialog.create({
    title: 'Pax Amt.',
    closeByBackdropClick: false,
    content: `<div class="list no-hairlines no-hairlines-between box-appear">
                <ul style="height: 100%;">
                  <li class="item-content item-input" style="height: inherit;">
                    <div class="item-inner" style="height: inherit;">
                      <div class="item-input-wrap" style="height: inherit;">
                        <input class="input-box" type="number" onClick="this.select();" name="pax" id="pax" style="text-align: center; height: inherit;" />
                      </div>
                    </div>
                  </li>
                </ul>
              </div>`,
    buttons: [
    {
      text: 'Cancel',
      onClick: function(dialog, e){
        app.request({
          url: addr+ "API/waitress/" +idmeja+ "/delete/",
          method: "POST",
          data: JSON.stringify({id_user: idpeg, id_meja: idmeja}),
          success: function(result){
            console.log('delete', result);
          }
        })
        app.views.main.router.back();
      }
    },{
      text: 'Confirm',
      onClick: function(dialog, e){
        var pax = $('#pax').val();

        if(pax){
          paxorder = pax;
          // cekPIN(meja, id, tipe, atasnama, pax);
          inputNama(idmeja)
        }
      }
    }]/* ,
    on: {
      closed: function(dialog, e){
        
        // var pax = $('#pax').val();
        // if(pax == '' || pax == '0'){
        // }
      }
    } */
  }).open()
}

function editPax(meja, idpj, rsv){
  app.dialog.create({
    title: 'Edit Pax Amt.',
    closeByBackdropClick: true,
    content: `<div class="list no-hairlines no-hairlines-between box-appear">
                <ul style="height: 100%;">
                  <li class="item-content item-input" style="height: inherit;">
                    <div class="item-inner" style="height: inherit;">
                      <div class="item-input-wrap" style="height: inherit;">
                        <input class="input-box" type="number" onClick="this.select();" name="pax" id="pax" style="text-align: center; height: inherit;" value="${paxorder}"/>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>`,
    buttons: [
    {
      text: 'Confirm',
      onClick: function(dialog, e){
        var pax = $('#pax').val();

        if(pax && !rsv){
          paxorder = pax;
          editNama(meja, idpj);
        } else {
          paxorder = pax;
          lihatKeranjang(meja, idpj);
        }
      }
    }]
  }).open()
}

function editNama(meja, idpj){
  app.dialog.create({
    title: 'Edit Cust. Name',
    closeByBackdropClick: true,
    content: `<div class="list no-hairlines no-hairlines-between box-appear">
                <ul style="height: 100%;">
                  <li class="item-content item-input" style="height: inherit;">
                    <div class="item-inner" style="height: inherit;">
                      <div class="item-input-wrap" style="height: inherit;">
                      <input class="input-box" type="text" onClick="this.select();" name="atasnama" id="atasnama" style="text-align: center; height: inherit;" value="${namaorder}"/>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>`,
    buttons: [
    {
      text: 'Confirm',
      onClick: function(dialog, e){
        var atasnama = $('#atasnama').val();

        if(atasnama){
          namaorder = atasnama;
          lihatKeranjang(meja, idpj);
        }
      }
    }]
  }).open()
}

function simpanPesanan(idmeja, id, waitress, atasnama, pax){
  var sub = parseInt($('#subTotal').val());
  var grand = parseInt($('#grandTotal').val());
  var gudang = window.localStorage.getItem("gudang");
  var idp = window.localStorage.getItem("id_peg");
  var temp = {
    action : "pesan",
    meja : idmeja,
    idpj : id,
    subtotal : sub,
    grantotal : sub,
    idpeg : idp,
    waitress : waitress,
    nama_cust : atasnama,
    pax : pax
  }

  console.log(temp);

  app.request({
    url: addr+"API/penjualan/"+gudang+"/",
    method: "POST",
    data: JSON.stringify(temp),
    success: function(json){
      if(json){
        app.request({
          url: addr+ "API/waitress/" +idmeja+ "/delete/",
          method: "POST",
          data: JSON.stringify({id_user: idp, id_meja: idmeja}),
          success: function(result){
            console.log("done pesan", result);
          }
        })

        app.dialog.confirm('Print Table Checker?', 'Confirmation', function(){
          // cetakBillWaiter(idmeja);
          cetakBillDapur(idmeja, id);
          app.views.main.router.navigate('/');
        }, function(){
          app.views.main.router.navigate('/');
        });

        // app.views.main.router.navigate('/home/');
      }
    },
    error: function(xhr, status){
      // alert("simpanPesanan cannot be processed");
      alert("Network Error, order cannot be processed!");
    }
  })
}

function lihatPesanan(meja, pj){
  var jumlah = 0;
  var data = "";
  var old = "";
  var rinci = "";
  app.request({
    url: addr+"API/bill/"+meja+"/",
    method: "GET",
    success: function(json){
      // console.log(json);
      var result = JSON.parse(json);
      var preSub = 0;
      var preSvc = 0;
      var prePB1 = 0;
      var preGrand = 0;
      var textSVC = '';

      if(result.length){
        console.log(result);
        namaorder = result[0].nama_cust ? result[0].nama_cust : '-';
        paxorder = result[0].pax ? result[0].pax : '0';
  
        for(i = 0; i < result.length; i++){
          // if(old != result[i].no_penjualan) data += '<li class="list-group-title" style="font-size: 1.2em; height: 65px; padding-top: 10px;">'+result[i].no_penjualan+'<a class="link icon-only" onclick="cetakBillPisah('+meja+','+result[i].id_pj+')" style="margin: 0 10px; transform: translateY(8px);"><i class="icon material-icons md-only" style="font-size: 1.5em;">print</i></a><span style="float: right;"><a class="link icon-only" onclick="app.views.main.router.navigate({name: \'merge\',params: {idMeja : '+meja+', idPJ : '+result[i].id_pj+'}});" style="margin: 0 10px; transform: translateY(8px);"><i class="icon material-icons md-only" style="font-size: 1.5em;">call_merge</i></a></span></li>'
          if(result[i].nama_barang != null){
            if(old != result[i].no_penjualan) data += '<li class="list-group-title" style="font-size: 1.2em; height: 65px; padding-top: 10px;">'+result[i].no_penjualan+'<a class="link icon-only" onclick="cetakBillPisah('+meja+','+result[i].id_pj+')" style="margin: 0 10px; transform: translateY(8px);"><i class="icon material-icons md-only" style="font-size: 1.5em;">print</i></a></li>';
            jumlah += parseInt(result[i].harga_jual * result[i].qty_jual);
            preSub += parseInt(result[i].harga_jual * result[i].qty_jual);

            data += ` <li class="item-content ">
                        <div class="item-inner">
                          <div class="item-title" >`+result[i].nama_barang+`
                            <div class="item-footer">`+result[i].qty_jual+` x `+parseInt(result[i].harga_jual).toLocaleString()+`</div>
                          </div>
                          <div class="item-after">`+parseInt(result[i].qty_jual * result[i].harga_jual).toLocaleString()+`
                            <input type="checkbox" id="c-`+result[i].id_dtl_jual+`" class="to-split hidden" style="margin: 0 10px;" onchange="splitQty(this, `+result[i].id_dtl_jual+`, `+result[i].qty_jual+`)"/>
                            <input type="hidden" id="item-`+result[i].id_dtl_jual+`" value="`+result[i].qty_jual+`"/>
                            <!-- <a class="link icon-only" onClick="delItem(`+meja+`, `+pj+`, `+result[i].id_dtl_jual+`)" style="margin-left: 10px; transform: translateY(-3px);"><i class="icon f7-icons md-only">trash</i></a> -->
                          </div>
                        </div>
                      </li>`;
            old = result[i].no_penjualan;
          }
        }

        preSvc = Math.round(parseFloat(result[0].svc) * preSub / 100);
        prePB1 = Math.round(0.1 * (preSvc + preSub));
        preGrand = preSub + preSvc + prePB1;

        if(result[0].svc > 0){
          textSVC =
            `<li class="item-content ">
              <div class="item-inner">
                <div class="item-title">SVC ` +result[0].svc+ `%</div>
                <div class="item-after">`+preSvc.toLocaleString()+`</div>
              </div>
            </li>`
        }

        rinci = 
          `<li class="item-content ">
            <div class="item-inner">
              <div class="item-title">Subtotal</div>
              <div class="item-after">`+preSub.toLocaleString()+`</div>
            </div>
          </li>`
          +textSVC+
          `<li class="item-content ">
            <div class="item-inner">
              <div class="item-title">PB1 10%</div>
              <div class="item-after">`+prePB1.toLocaleString()+`</div>
            </div>
          </li>
          <li class="item-content ">
            <div class="item-inner">
              <div class="item-title">Grand Total</div>
              <div class="item-after">`+preGrand.toLocaleString()+`</div>
            </div>
          </li>`;
      }

      $('#orders').html(data);
      $('#preview').html(rinci);
    }
  })
}

function delItem(meja, pj, id){
  var gudang = window.localStorage.getItem('gudang');
  var temp = {
    action : "hapus",
    id_dtl_jual : id
  }

  app.request({
    url: addr+"API/penjualan/"+gudang+"/",
    method: "POST",
    data: JSON.stringify(temp),
    success: function(json){
      lihatPesanan(meja, pj);
    }
  })
}

function cetakBillWaiter(meja){
  var jumlah = 0;
  app.request({
    url: addr+"API/bill/"+meja+"/",
    method: "GET",
    success: function(json){
      var result = JSON.parse(json);
      var bill = '';
      var list = '';
      var header = '{br}{center}{h}MediaPOS{/h}{br}Billing Info{br}--------------------------------{br}';
      var tgl = result[0].tgl_penjualan.replace(/\W/g,'/');
      var len = result.length;
      // var subheader = '{left}No. Trans : '+result[0].no_penjualan+'{br}Tanggal   : '+tgl+'{br}Operator  : '+cpyProf.client+'{br}--------------------------------{br}';
      // var subheader = '{left}TX. NO. : '+result[0].no_penjualan+'{br}DATE    : '+tgl+'{br}TABLE   : '+meja+'{br}WAITER  : '+result[0].nama_waitress+'{br}--------------------------------{br}';
      var subheader = '{left}TX. NO. : '+result[0].no_penjualan+'{br}DATE    : '+tgl+'{br}TABLE   : '+result[0].nmeja+'{br}WAITER  : '+result[0].nama_waitress+'{br}CUST    : '+result[0].nama_cust+'{br}--------------------------------{br}';
      var subtotal = 'Subtotal';
      var ppn = 'PB1 10%';
      var footer = '';
      var charge = 'SVC ' +result[0].svc+ '%';
      var grand = 'Total';
      var svc_pr = parseFloat(result[0].svc);
      var svc = 0;

      // console.log('kategori: ' +result[0].kat);

      for(i = 0; i < result.length; i++){
        var ws = '';
        var price_satuan = parseInt(result[i].harga_jual).toLocaleString();
        var price_bulk = (parseInt(result[i].harga_jual) * parseInt(result[i].qty_jual)).toLocaleString();
    
        var qtystr = ('   '+result[i].qty_jual).slice(-3);
        var pricelen = 32 - (6 + result[i].harga_jual.length + price_bulk.length);
        console.log(pricelen);
        // for(var j = 0; j < 27 - price_satuan.length - price_bulk.length; j++){
        for(var j = 0; j < pricelen; j++){
          ws += ' ';
        }
    
        list += '{left}'+result[i].nama_barang+'{br}'+qtystr+' x '+parseInt(result[i].harga_jual) +ws+ (parseInt(result[i].harga_jual) * parseInt(result[i].qty_jual)).toLocaleString()+'{br}';
        jumlah += parseInt(result[i].harga_jual) * parseInt(result[i].qty_jual);
        // console.log(jumlah);
      }

      for(var i = 0; i < 24 - jumlah.toLocaleString().length; i++){
        subtotal += ' ';
      } subtotal += jumlah.toLocaleString() + '{br}';

      // if(result[0].kat != '5'){
        svc = Math.round(jumlah * svc_pr / 100);
        // console.log(charge.length + svc.toLocaleString().length);
        var spacelen = 32 - (charge.length + svc.toLocaleString().length);
        console.log(spacelen);
        for(var i = 0; i < spacelen; i++){
          charge += ' ';
        } charge += svc.toLocaleString() + '{br}';
      // }

      var pb1 = Math.round((jumlah + svc) * 0.1);
      for(var i = 0; i < 25 - pb1.toLocaleString().length; i++){
        ppn += ' ';
      } ppn += pb1.toLocaleString() + '{br}';

      var gtot = jumlah + pb1 + svc;
      for(var i = 0; i < 27 - gtot.toLocaleString().length; i++){
        grand += ' ';
      } grand += gtot.toLocaleString() + '{br}';

      list += '--------------------------------{br}{left}';
      footer = '{br}{center}NOT PROOF OF PAYMENT';

      // if(result[0].kat != 5){
      //   bill = header + subheader + list + subtotal + charge + ppn + grand + footer;
      // } else {
      //   bill = header + subheader + list + subtotal + ppn + grand + footer;
      // }

      if(svc_pr > 0){
        bill = header + subheader + list + subtotal + charge + ppn + grand + footer;
      } else {
        bill = header + subheader + list + subtotal + ppn + grand + footer;
      }

      console.log(bill);
      connectToPrinter(bill);
    }
  })
}

function cetakBillPisah(meja, idpj){
  var jumlah = 0;
  app.request({
    url: addr+"API/split/"+idpj+"/",
    method: "GET",
    success: function(json){
      var result = JSON.parse(json);
      var bill = '';
      var list = '';
      var header = '{br}{center}{h}MediaPOS{/h}{br}Billing Info{br}--------------------------------{br}';
      var tgl = result[0].tgl_penjualan.replace(/\W/g,'/');
      // var subheader = '{left}No. Trans : '+result[0].no_penjualan+'{br}Tanggal   : '+tgl+'{br}Operator  : '+cpyProf.client+'{br}--------------------------------{br}';
      var subheader = '{left}TX. NO. : '+result[0].no_penjualan+'{br}DATE    : '+tgl+'{br}TABLE   : '+result[0].nmeja+'{br}WAITER  : '+result[0].nama_waitress+'{br}CUST    : '+result[0].nama_cust+'{br}--------------------------------{br}';
      var subtotal = 'Subtotal';
      var footer = '';

      for(i = 0; i < result.length; i++){
        var ws = '';
        var price_satuan = parseInt(result[i].harga_jual).toLocaleString();
        var price_bulk = (parseInt(result[i].harga_jual) * parseInt(result[i].qty_jual)).toLocaleString();
    
        for(var j = 0; j < 24 - price_satuan.length - price_bulk.length; j++){
          ws += ' ';
        }
    
        list += '{left}'+result[i].nama_barang+'{br}  '+result[i].qty_jual+' x '+parseInt(result[i].harga_jual)+ws+(parseInt(result[i].harga_jual) * parseInt(result[i].qty_jual)).toLocaleString()+'{br}';
        jumlah += parseInt(result[i].harga_jual) * parseInt(result[i].qty_jual);
        // console.log(jumlah);
      }

      for(var i = 0; i < 24 - jumlah.toLocaleString().length; i++){
        subtotal += ' ';
      } subtotal += jumlah.toLocaleString() + '{br}';

      list += '--------------------------------{br}{left}';
      footer == '{br}{center}NOT PROOF OF PAYMENT';
      bill = header + subheader + list + subtotal + footer;

      console.log(bill);
      connectToPrinter(bill);
    }
  })
}

function cetakBillDapur(meja, id){
  app.request({
    url: (id) ? addr+"API/dapur/"+id+"/" : addr+"API/penjualan/"+meja+"/",
    method: "GET",
    success: function(json){
      var result = JSON.parse(json);
      console.log(result);

      var bill = '';
      var list = '';
      var header = '{br}{center}{h}MediaPOS{/h}{br}Table Checker{br}--------------------------------{br}';
      var tgl = result[0].tgl_penjualan.replace(/\W/g,'/');
      var len = result.length;
      // var subheader = '{left}No. Trans : '+result[0].no_penjualan+'{br}Tanggal   : '+tgl+'{br}Operator  : '+cpyProf.client+'{br}--------------------------------{br}';
      // var subheader = '{left}TX. NO. : '+result[0].no_penjualan+'{br}DATE    : '+tgl+'{br}TABLE   : '+meja+'{br}WAITER  : '+result[0].nama_waitress+'{br}--------------------------------{br}';
      var subheader = '{left}TX. NO. : '+result[0].no_penjualan+'{br}DATE    : '+tgl+'{br}TABLE   : '+result[0].nmeja+'{br}WAITER  : '+result[0].nama_waitress+'{br}CUST    : '+result[0].nama_cust+'{br}--------------------------------{br}';

      for(var i = 0; i < result.length; i++){
        var ws = '';
        for(var j = 0; j < 29 - (result[i].nama_barang.length + result[i].qty_jual.length); j++){
          ws += ' ';
        }
    
        list += '{left}' + result[i].nama_barang + ws + 'x ' + result[i].qty_jual + (result[i].catatan ? '{br}   NOTE : ' +  result[i].catatan : '') + '{br}';
      }

      list += '--------------------------------{br}{left}';
      bill = header + subheader + list;

      console.log(bill);
      connectToPrinter(bill);
    }
  })
}

function connectToPrinter(q){
  window.DatecsPrinter.listBluetoothDevices(
    function (devices) {
      window.DatecsPrinter.connect(devices[0].address, 
        function() {
          window.DatecsPrinter.printText(q + "{br}{br}{br}", 'ISO-8859-1', 
            function(){
              alert('Bill Printed!');
            }, function(error) {
              alert("Datecs.printText error: " + JSON.stringify(error));
            });
        },
        function(error) {
          alert("Datecs.connect error: " + JSON.stringify(error));
        }
        );
    },
    function (error) {
      alert("Datecs.listBluetoothDevices error: " + JSON.stringify(error));
    });
}

function testPrint(){
  var q = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
  connectToPrinter(q);
}

function toSplit(){
  if($('.to-split').hasClass('hidden')){
    $('input[type=checkbox]').prop('checked', false);
    $('.to-split').addClass('showed');
    $('.to-split').removeClass('hidden');

    $('#split_bill').removeClass('hidden');
    $('#cetak_bill').addClass('hidden');
  } else {
    $('input[type=checkbox]').prop('checked', false);
    $('.to-split').addClass('hidden');
    $('.to-split').removeClass('showed');

    $('#split_bill').addClass('hidden');
    $('#cetak_bill').removeClass('hidden');
  }
}

function splitQty(e, id, amt){
  if(e.checked){
    app.dialog.create({
      title: 'Split Amt',
      closeByBackdropClick: false,
      content: `<div class="list no-hairlines no-hairlines-between box-appear">
                  <ul style="height: 100%;">
                    <li class="item-content item-input" style="height: inherit;">
                      <div class="item-inner" style="height: inherit;">
                        <div class="item-input-wrap" style="height: inherit;">
                          <input class="input-box" type="number" onClick="this.select();" name="qty" id="qty" value="`+amt+`" style="text-align: center; height: inherit;" />
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>`,
      buttons: [
      {
        text: 'Confirm',
        onClick: function(dialog, e){
          var qty = $('#qty').val();
          if(qty > amt){
            app.toast.create({text: 'Invalid split amount', closeButton: true, destroyOnClose: true, closeTimeout: 3000}).open();
            $('#c-'+id).prop('checked', false);
          }else if(qty){
            $('#item-'+id).val(qty);
            // alert(qty);
          }
        }
      }]
    }).open();
  }
}

function splitBill(idpj, meja, id_waitress){
  var gudang = window.localStorage.getItem("gudang");
  var idpeg = window.localStorage.getItem("id_peg");
  var c = $('input:checked');
  c.each(function(key, val){
    var temp = {
      id_pj_dtl : val.id.replace(/\D/g, ''),
      id_pj : idpj,
      idpeg : idpeg,
      waitress : id_waitress,
      action : 'split',
      qty : $('#item-'+val.id.replace(/\D/g, '')).val()
    }

    // console.log(temp);

    setTimeout(function(){
      app.request({
        url: addr+"API/penjualan/"+gudang+"/",
        method: "POST",
        data: JSON.stringify(temp),
        success: function(){
          // console.log("sukses " + val.id);
          toSplit();
          lihatPesanan(meja, idpj);
        }
      })
    }, 800);
  })
  // alert('ini split');
}

function lihatMergeable(meja, idpj){
  var data = "";
  var old = "";
  app.request({
    url: addr+"API/merge/"+idpj+"/",
    method: "GET",
    success: function(json){
      if(json){
        var result = JSON.parse(json);
        for(var i = 0; i < result.length; i++){
          if(old != result[i].no_penjualan) data += '<li class="list-group-title">Table #'+result[i].meja+' '+result[i].no_penjualan+'<span style="float: right;"><a class="link icon-only" onclick="mergeBill('+meja+','+idpj+','+result[i].id_pj+');" style="margin: 0 10px; transform: translateY(8px);"><i class="icon material-icons md-only">call_merge</i></a></span></li>'
          // jumlah += parseInt(result[i].harga_jual * result[i].qty_jual);
          data += ` <li class="item-content ">
                      <div class="item-inner">
                        <div class="item-title" >`+result[i].nama_barang+`
                          <div class="item-footer">`+result[i].qty_jual+` x `+result[i].harga_jual+`</div>
                        </div>
                        <div class="item-after">`+parseInt(result[i].qty_jual * result[i].harga_jual).toLocaleString()+`</div>
                      </div>
                    </li>`;
          old = result[i].no_penjualan;
        }

        $('#mergeable').html(data);
      }
    }

  })
}

function mergeBill(meja, idpj, oldpj){
  var gudang = window.localStorage.getItem('gudang');
  var temp = {
    pj_baru : idpj,
    pj_lama : oldpj,
    action : 'merge'
  }

  app.request({
    url: addr+"API/penjualan/"+gudang+"/",
    method: "POST",
    data: JSON.stringify(temp),
    success: function(json){
      if(json){
        lihatMergeable(meja, idpj);
      }
    }
  })
}

function dash(){
  var penj = Highcharts.chart('container1',{
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false
    },
    title: {
        text: 'Top 10 Sales'
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.y}</b>'
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: false
            },
            showInLegend: true
        }
    },
    series: [{
        type: 'pie',
        name: 'Amount'
    }]
  })

  app.request({
    url: addr+"API/dash1/",
    method: "GET",
    success: function(json){
      if(json){
        var result = JSON.parse(json);
        for(var i = 0; i < result.length; i++){
          penj.series[0].addPoint({
            name: result[i].nama_barang,
            y: parseInt(result[i].total),
            id: result[i].id_barang
          }, false);
        }
      } else {
        penj.series[0].addPoint({
          name: 'kosong',
          y: 1,
          id: '1'
        }, false);
      }

      penj.redraw();
    }
  })

  var waitress = Highcharts.chart('container2',{
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false
    },
    title: {
      text: 'Top 10 Waitress'
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.y}</b>'
    },
    plotOptions: {
      pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
              enabled: false
          },
          showInLegend: true
      }
    },
    series: [{
      type: 'pie',
      name: 'Jumlah'
    }]
  })

  app.request({
    url: addr+"API/dash2/",
    method: "GET",
    success: function(json){
      if(json){
        var result = JSON.parse(json);
        for(var i = 0; i < result.length; i++){
          waitress.series[0].addPoint({
            name: result[i].nama_waitress,
            y: parseInt(result[i].jumlah),
            id: result[i].id_waitress
          }, false);
        }
      } else {
        waitress.series[0].addPoint({
          name: 'kosong',
          y: 0,
          id: '1'
        }, false);
      }

      waitress.redraw();
    }
  })    
}

function tampilReport(type, id){
  // alert(type);
  var title1, title2, xAxis, yAxis, suffix;
  if(type == 'payment'){
    title1 = 'Transaction';
    title2 = 'Total Payment';
    yAxis = 'Qty (pcs)';
    suffix = 'millions';
  }

  var report = Highcharts.chart('dashreport',{
    chart: {
      type: 'bar'
    },
    title: {
        text: title1
    },
    xAxis: {
      // categories: [],
      title: {
        text: null
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: yAxis,
        align: 'high'
      },
      labels: {
        overflow: 'justify'
      }
    },
    tooltip: {
      valueSuffix: suffix
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: true
        }
      }
    },
    series: [{
        name: ''
    }]
  })

  app.request({
    url: addr+"API/report/"+type+"/",
    method: "GET",
    success: function(json){
      if(json){
        var result = JSON.parse(json);
        var catArr = [];
        for(var i = 0; i < result.length; i++){
          catArr.push(result[i].bayar);
          report.series[0].addPoint({
            name: result[i].bayar,
            y: parseInt(result[i].qty),
            id: result[i].id_bayar
          }, false);
        }
      } /*else {
        penj.series[0].addPoint({
          name: 'kosong',
          y: 1,
          id: '1'
        }, false);
      }*/

      report.xAxis[0].setCategories(catArr);
      report.redraw();
    }
  })
}

function hitungTotal(){
  diskon = totalbel * (discprs.Text / 100);
  svc = ((totalbel - diskon) * (9.8 / 100));
  subtotal = totalbel - diskon + svc;
  ppn = subtotal * (10 / 100);
  grandt = subtotal + ppn;
}

function cetakUlang(idpj, tipe){
  var temp = {
    id_pj : idpj,
    tipe : tipe
  };

  app.request({
    url: addr+"API/ulang/",
    method: "POST",
    data: JSON.stringify(temp),
    success: function(json){
      var result = JSON.parse(json);
      var bill = '';
      var list = '';
      var header = '{br}{center}{h}MediaPOS{/h}{br}Table Checker{br}--------------------------------{br}';
      var tgl = result[0].tgl_penjualan.replace(/\W/g,'/');
      var time = result[0].stamp_date.split(' ')[1];
      var len = result.length;
      // var dt = new Date();
      // var ts = dt.getHours()+ ':' +dt.getMinutes()+ ':' +dt.getSeconds();

      var d=new Date();
      var tgltime=d.getFullYear()+"/"+(d.getMonth()+1)+"/"+("0" + d.getDate()).slice(-2)+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
      // var subheader = '{left}No. Trans : '+result[0].no_penjualan+'{br}Tanggal   : '+tgl+'{br}Operator  : '+cpyProf.client+'{br}--------------------------------{br}';
      // var subheader = '{left}TX. NO. : '+result[0].no_penjualan+'{br}DATE    : '+tgl+'{br}TIME    : '+time+'{br}TABLE   : '+result[0].meja+'{br}WAITER  : '+result[0].nama_waitress+'{br}--------------------------------{br}';
      // var subheader = '{left}TX. NO. : '+result[0].no_penjualan+'{br}DATE    : '+tgl+'{br}TIME    : '+time+'{br}TABLE   : '+result[0].meja+'{br}WAITER  : '+result[0].nama_waitress+'{br}--------------------------------{br}';

      var subheader = '{left}DATE    : '+tgl+'{br}TIME    : '+time+'{br}TABLE   : '+result[0].nmeja+'{br}WAITER  : '+result[0].nama_waitress+'{br}--------------------------------{br}';

      for(var i = 0; i < result.length; i++){
        var ws = '';
        for(var j = 0; j < 29 - (result[i].nama_barang.length + result[i].qty_jual.length); j++){
          ws += ' ';
        }
    
        // list += '{left}' + result[i].nama_barang + ws + 'x ' + result[i].qty_jual + (result[i].catatan ? '{br}   NOTE : ' +  result[i].catatan : '') + '{br}';
        list += '{left}' + result[i].nama_barang + ws + 'x ' + result[i].qty_jual + '{br}';
      }

      list += '--------------------------------{br}{left}';
      // list += '{br}{center}THIS IS REPRINTED RECEIPT{br}'+tgltime;

      list += '{br}{center}THIS RECEIPT WAS REPRINTED{br}BY ' +user+ '{br}'+tgltime;
      bill = header + subheader + list;

      console.log(bill);
      connectToPrinter(bill);
    }
  })

  // app.request({
  //   url: addr+"API/ulang/",
  //   method: "POST",
  //   data: JSON.stringify(temp),
  //   success: function(json){
  //     var result = JSON.parse(json);
  //     var bill = '';
  //     var list = '';
  //     var header = '{br}{center}{h}MediaPOS{/h}{br}{br}--------------------------------{br}';
  //     var tgl = result[0].tgl_penjualan.replace(/\W/g,'/');
  //     // var subheader = '{left}No. Trans : '+result[0].no_penjualan+'{br}Tanggal   : '+tgl+'{br}Operator  : '+cpyProf.client+'{br}--------------------------------{br}';
  //     var subheader = '{left}TX. NO. : '+result[0].no_penjualan+'{br}DATE    : '+tgl+'{br}TABLE   : '+meja+'{br}WAITER  : '+result[0].nama_waitress+'{br}--------------------------------{br}';
  //     var subtotal = 'Subtotal';
  //     var footer = '';

  //     for(i = 0; i < result.length; i++){
  //       var ws = '';
  //       var price_satuan = parseInt(result[i].harga_jual).toLocaleString();
  //       var price_bulk = (parseInt(result[i].harga_jual) * parseInt(result[i].qty_jual)).toLocaleString();
    
  //       for(var j = 0; j < 24 - price_satuan.length - price_bulk.length; j++){
  //         ws += ' ';
  //       }
    
  //       list += '{left}'+result[i].nama_barang+'{br}  '+result[i].qty_jual+' x '+parseInt(result[i].harga_jual)+ws+(parseInt(result[i].harga_jual) * parseInt(result[i].qty_jual)).toLocaleString()+'{br}';
  //       jumlah += parseInt(result[i].harga_jual) * parseInt(result[i].qty_jual);
  //       // console.log(jumlah);
  //     }

  //     for(var i = 0; i < 24 - jumlah.toLocaleString().length; i++){
  //       subtotal += ' ';
  //     } subtotal += jumlah.toLocaleString() + '{br}';

  //     list += '--------------------------------{br}{left}';
  //     footer = '{br}{center}THIS IS REPRINTED RECEIPT';
  //     bill = header + subheader + list + subtotal + footer;

  //     console.log(bill);
  //     // connectToPrinter(bill);
  //   }
  // })
}

function onReserved(jambook, namabook){
  app.toast.create({
    text: 'Table reserved for ' +jambook+ ' on behalf of Mr/Mrs ' +namabook+ ', please choose another table', 
    closeButton: true, 
    destroyOnClose: true, 
    closeTimeout: 5000
  }).open();
}

function onHold(waitress, meja, pj, nMeja, reservasi, curitem, nama_cust){
  // \''+result[i].KODE+'\', 0, \'' +result[i].NAMA+ '\', ' +result[i].idreservasi+ ', 0, \'\'
  var curw = window.localStorage.getItem("id_peg");
  if(waitress == curw){
    lihatmeja(meja, pj, nMeja, reservasi, curitem, nama_cust);
  } else {
    app.request({
      url: addr+ "API/waitress/" +waitress+ "/",
      method: "GET",
      success: function(result){
        var res = JSON.parse(result);
        
        app.toast.create({
          // text: 'Transaction ongoing, please wait', 
          text: 'Order for this table is being taken by ' +res[0].nama_pegawai+ '.', 
          closeButton: true, 
          destroyOnClose: true, 
          closeTimeout: 3000
        }).open();
      }
    })
  }
}

function onPrepare(){
  app.toast.create({
    text: 'Table need to be cleaned, preparing', 
    closeButton: true, 
    destroyOnClose: true, 
    closeTimeout: 3000
  }).open();
}

function listTx(){
  var id = window.localStorage.getItem("id_peg");
  var isinya  = "";
  app.request({
    url: addr + "API/today/" +id+ "/",
    method: "GET",
    success: function(json){
      var result = JSON.parse(json);
      // $("#tx_list").html(result);
      for(var i = 0; i < result.length; i++){
        isinya += '<li class="item-content">\
                      <div class="item-inner">\
                          <div class="item-title">Table '+result[i].NAMA+', Cust: '+(result[i].nama_cust ? result[i].nama_cust : '')+'</div>\
                          <div class="item-after">\
                            <a href="#" style="margin: 2px;" onclick="cetakUlang('+result[i].id_pj+');"><i class="icon material-icons md-only">print</i></a>\
                          </div>\
                      </div>\
                  </li>';
      }

      $("#tx_list").html(isinya);
      // console.log(result);
    }
  })
}


/*
  TODO:
  - bill dapur
    - Subtitle table checker receipt (done)
    - nama user berdasar pin (done)
    - catt diganti note (done)

  - homescreen
    - profile tab bisa buat logout (postponed)
    - home tab nampilkan dashboard penjualan berdasar waiter (done)

  - proses
    - addition ke meja masuk ke no penjualan yg sama (done)
    - bill refers to meja, kecuali ketika split, in which bisa meja sama tapi nomor trans beda (done)
    - split bill menghasilkan penjualan baru dalam meja sama (done)
    - qty input buat item yg di split (almost done, tinggal ubah API)

  -interface
    - tampilan menu barang (done)
    - tampilan meja (done)

  - centered list meja (done)
  - nama meja dibawah list meja (done)
  - hapus pesanan (done)
  - link history
  - font size (partially done)
*/














// ========================= UNUSED CODE BELOW ===================================













/*<?php
          
$cb=$db->select("pj_penjualan_dtl a inner join m_barang b on a.id_barang = b.id_barang inner join pj_penjualan c on a.id_pj = c.id_pj",
"a.id_barang,b.nama_barang,ifnull(count(a.qty_jual),0) as total",
"void_jual is null group by a.id_barang limit 0,10");


$jum=count($cb);
if($jum>0){
    foreach($cb as $pros){
      echo"{name:'$pros[nama_barang]', y:$pros[total],id:'$pros[id_barang]'},"; 
    }
}else{
    echo "{name:'kosong',y:0,id:'1'},"; 
}
?>*/

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
      alert('Please choose available table first!');
      return;
    }

    app.dialog.prompt('PIN:', 'Confirmation', 
    function(nomor){
      if(nomor != '1234'){
        app.toast.create({text: 'PIN not recognized', closeButton: true, destroyOnClose: true, closeTimeout: 3000}).open();
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
                //  listMeja();
                // listKategoriMeja();

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

  app.dialog.prompt('Nomor meja:', '', 
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

function dtlMeja(){
  $('#panelmeja').empty();
  if($('.selected').length > 0){
    $('.selected').each(function(i, j){
      var nomor = j.id.slice(4);
      db.transaction(function(tx){
        tx.executeSql('SELECT a.id_barang, b.no_meja, c.nama_barang, qty_jual, ready FROM pj_dtl a JOIN pj b ON a.id_pj = b.id_pj JOIN m_barang c ON a.id_barang = c.id_barang WHERE b.no_meja = ? AND b.st = 1', [nomor], 
          function(tx, result){
            var content = '<div class="list no-hairlines-between"><ul><li class="item-divider"><strong>Table #' +result.rows.item(0).no_meja+'</strong></li>';
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
  // idtemp = 0;
  // nomormeja = 0;
  // toBeMerged = [];
  // splitItem = [];
  // listKategoriMeja();
  // listMeja();
  // db.transaction(function(t){
  //   t.executeSql("DELETE FROM pj_dtl_tmp")
  // })
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
                  // listMeja();
                  // listKategoriMeja();
                  app.views.main.router.back();

                  testEmpty();
                })
              })
            } else {
              db.transaction(function(t){
                t.executeSql('UPDATE pj SET st = 0 WHERE no_meja = ? AND st = 1', [meja],
                  function(){
                    // listMeja();
                    // listKategoriMeja();
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
            // listKategoriMeja();
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
    app.dialog.prompt('Split Amt:', 'Confirmation', function(jumlah){
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
    // }, '', ['Ok', 'Cancel'], t);
  }
}

/*function splitBill(){
  app.dialog.confirm('Split Bill?', '', function(){
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
}*/

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
//   app.dialog.confirm('Merge Bill?', '', function(){
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

/*function dash(){
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
}*/


/*window.sqlitePlugin.echoTest(function() {
       alert('ECHO test OK');
     });*/
     // screen.orientation.lock('landscape');

     /*db = window.sqlitePlugin.openDatabase({
       name: 'LightPOS.db',
       location: 'default',
     });*/

     /*db.transaction(function(transaction) {
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
     });*/

     /*db.transaction(function(tx) {
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
     });*/

     //tampil();
     //test();
