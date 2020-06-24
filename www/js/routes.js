var routes = [
  // Index page
  {
    path: '/',
    url: './index.html',
    name: 'login',
    on: {
      pageAfterIn: function(){
        $('#login_form').on('submit', function(event){
          event.preventDefault();
          document.activeElement.blur()
          $('#login_button').trigger('click');
        });
      }
    }
  },
  {
    path: '/home/',
    url: './pages/home.html',
    name: 'home',
    on: {
      pageAfterIn: function (){
        // listMeja();
        listKategoriMeja();
        user = window.localStorage.getItem("pegawai");
        $('#logged_user').html(user);
        // listReservasi();
      },
      pageAfterOut: function(){
        clearTimeout(refresh_meja);
      }
    }
  },
  // About page
  {
    path: '/about/',
    url: './pages/about.html',
    name: 'about',
  },
  {
    name: 'menu',
    path: '/menu/:idMeja/:idPJ/',
    template: `
    <div class="page" data-name="menu">
      <div class="navbar" >
        <div class="navbar-inner sliding">
          <div class="left">
            <a href="#" class="link " onclick="clearCart({{$route.params.idMeja}});">
              <i class="icon icon-back"></i>
              <span class="ios-only">Back</span>
            </a>
          </div>
          <div class="title">Menus</div>
          <div class="right">
              <a class="link icon-only searchbar-enable" data-searchbar=".searchbar"><i class="icon material-icons md-only">search</i></a>
              <a class="link icon-only" href="/keranjang/{{$route.params.idMeja}}/{{$route.params.idPJ}}/"><i class="icon material-icons md-only">shopping_cart</i></a>
            </div>
            <form class="searchbar searchbar-expandable">
              <div class="searchbar-inner">
                <div class="searchbar-input-wrap">
                  <input type="search" placeholder="Search" onkeyup="cariItem(event, this.value, {{$route.params.idMeja}})"/>
                  <i class="searchbar-icon"></i>
                  <span class="input-clear-button"></span>
                </div>
                <span class="searchbar-disable-button">Cancel</span>
              </div>
            </form>
        </div>
      </div>
      <div class="page-content" style="padding-top: 27px; padding-bottom: 35px; overflow-y: hidden">
        <div class="list no-hairlines no-hairlines-between">
          <ul>
            <li class="item-content item-input">
              <div class="item-inner">
                <div class="item-title item-label"></div>
                <div class="item-input-wrap input-dropdown-wrap">
                  <select name="kategori" id="kategori" onchange="tampil({{$route.params.idMeja}}, this.value);">

                  </select>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="block">
          <div class="row" id="menuku" style=" overflow-y:scroll; max-height: calc( 90vh - 50px ); justify-content: space-between;">
          </div>
        </div>
      </div>
    </div>`,
    on: {
        pageAfterIn: function test (e, page) {
          // do something after page gets into the view
          clearTimeout(refresh_meja);
          searchBar = app.searchbar.create({
            el: '.searchbar',
            on: {
              disable: function(){
                tampil(page.route.params.idMeja, $('#kategori').val());
              }
            }
          });
        },
        pageInit: function (e, page) {
          // do something when page initialized
          listKategori(page.route.params.idMeja);
          if(page.route.params.idPJ == 0) inputPax();
        },
      }
  },
  {
    name: 'keranjang',
    path: '/keranjang/:idMeja/:idPJ/',
    template: `
    <div class="page" data-name="keranjang">
      <div class="navbar" >
        <div class="navbar-inner sliding">
          <div class="left">
            <a href="#" class="link back">
              <i class="icon icon-back"></i>
              <span class="ios-only">Back</span>
            </a>
          </div>
          <div class="title">Cart</div>
        </div>
      </div>
      <div class="page-content">
        <input type="hidden" id="subTotal">
        <input type="hidden" id="grandTotal">
        <div class="list no-hairlines no-hairlines-between" style="margin-top: 0;">
          <ul id="keranjang">
          </ul>
        </div>
      </div>
      <div class="toolbar toolbar-bottom-md no-shadow" style="height: 70px;">
        <div class="toolbar-inner">
          <!-- <button class="button" onclick="inputNama({{$route.params.idMeja}}, {{$route.params.idPJ}}, 'pesan')">Save Orders</button> -->
          <!-- <button class="button" onclick="inputPax({{$route.params.idMeja}}, {{$route.params.idPJ}}, 'pesan')">Save Orders</button> -->
          <button class="button" onclick="cekPIN({{$route.params.idMeja}}, {{$route.params.idPJ}}, 'pesan')">Save Orders</button>
        </div>
      </div>
    </div>`,
    on: {
        pageAfterIn: function test (e, page) {
          // do something after page gets into the view
          clearTimeout(refresh_meja);
        },
        pageInit: function (e, page) {
          // do something when page initialized          
          lihatKeranjang(page.route.params.idMeja, page.route.params.idPJ);
        },
      }
  },
  {
    name: 'pesanan',
    path: '/pesanan/:idMeja/:idPJ/',
    template: `
    <div class="page" data-name="pesanan">
      <div class="navbar">
        <div class="navbar-inner sliding">
          <div class="left">
            <a href="#" class="link back">
              <i class="icon icon-back"></i>
              <span class="ios-only">Back</span>
            </a>
          </div>
          <div class="title" id="title_meja"></div>
          <div class="right">
            <!-- <a class="link icon-only" onclick="toSplit();" style="margin: 0 10px 0 0;"><i class="icon material-icons md-only">call_split</i></a> -->
            <a class="link icon-only" onclick="cetakUlang({{$route.params.idPJ}}, '');" style="margin: 0 10px 0 0;"><i class="icon material-icons md-only">print</i></a>
            <a class="link icon-only" href="/menu/{{$route.params.idMeja}}/{{$route.params.idPJ}}/" style="margin: 0 10px 0 0;"><i class="icon material-icons md-only">add_shopping_cart</i></a>
          </div>
        </div>
      </div>
      <div class="page-content">
        <div class="list no-hairlines-between no-hairlines" style=" overflow-y:scroll;height: calc( 90vh - 50px );margin:1px;">
          <ul id="orders">
          </ul>
        </div>
      </div>
      <div class="toolbar toolbar-bottom-md no-shadow" style="height: 70px;">
        <div class="toolbar-inner">
          <button id="split_bill" class="button hidden" onclick="cekPIN({{$route.params.idMeja}}, {{$route.params.idPJ}}, 'split')">Split Into New Bill</button>
          <button id="cetak_bill" class="button" onclick="cetakBillWaiter({{$route.params.idMeja}})">Print Bill</button>
        </div>
      </div>
    </div>`,
    // <button id="split_bill" class="button hidden" onclick="splitBill({{$route.params.idPJ}}, {{$route.params.idMeja}})">Split Into New Bill</button>
    // componentUrl: './pages/pesanan.html',
    on: {
        pageAfterIn: function test (e, page) {
          // do something after page gets into the view
          $('#title_meja').html('Orders for table ' +curTable);
          clearTimeout(refresh_meja);
          lihatPesanan(page.route.params.idMeja, page.route.params.idPJ);
        },
        pageInit: function (e, page) {
          // do something when page initialized          
        },
      }
  },
  {
    name: 'merge',
    path: '/merge/:idMeja/:idPJ/',
    template: `
    <div class="page" data-name="merge">
      <div class="navbar">
        <div class="navbar-inner sliding">
          <div class="left">
            <a href="#" class="link back">
              <i class="icon icon-back"></i>
              <span class="ios-only">Back</span>
            </a>
          </div>
          <div class="title"></div>
        </div>
      </div>
      <div class="page-content">
        <div class="list no-hairlines-between no-hairlines" style=" overflow-y:scroll;height: calc( 90vh - 50px );margin:1px;">
          <ul id="mergeable">
          </ul>
        </div>
      </div>
    </div>`,
    // componentUrl: './pages/pesanan.html',
    on: {
        pageAfterIn: function test (e, page) {
          // do something after page gets into the view
          clearTimeout(refresh_meja);
          lihatMergeable(page.route.params.idMeja, page.route.params.idPJ);
        },
        pageInit: function (e, page) {
          // do something when page initialized
        },
      }
  },
  {
    name: 'report',
    path: '/report/:type/:id/',
    template: `
    <div class="page" data-name="report">
      <div class="navbar">
        <div class="navbar-inner sliding">
          <div class="left">
            <a href="#" class="link back">
              <i class="icon icon-back"></i>
              <span class="ios-only">Back</span>
            </a>
          </div>
          <div class="title"></div>
        </div>
      </div>
      <div class="page-content">
        <div id="dashreport" class="block">
        </div>
      </div>
    </div>`,
    // componentUrl: './pages/pesanan.html',
    on: {
        pageAfterIn: function test (e, page) {
          // do something after page gets into the view
          clearTimeout(refresh_meja);
          tampilReport(page.route.params.type, page.route.params.id);
        },
        pageInit: function (e, page) {
          // do something when page initialized
        },
      }
  },
  {
    path: '/add_reservasi/',
    componentUrl: './pages/reservasi.html',
    on: {
      pageInit: function(){
        // emptyDB();
        // allItems();
        listReservasi();
      },
      pageAfterIn: function(){
        // listBarang();
        // console.log('afterin');
      },
      pageAfterOut: function(){
        // tampilMenu();
        // tampilFood();
        // tampilBvrg();
        // emptyDB();
      }
    }
  },
  {
    path: '/print/',
    componentUrl: './pages/print.html',
    on: {
      pageInit: function(){
        // emptyDB();
        // allItems();
        listTx();
        var d = new Date();
        $('#print_header').html("<strong>Available Transaction ("+d.getFullYear()+"/"+("0" + (d.getMonth()+1)).slice(-2)+"/"+("0" + d.getDate()).slice(-2)+")</strong>");
      },
      pageAfterIn: function(){
        // listBarang();
        // console.log('afterin');
      },
      pageAfterOut: function(){
        // tampilMenu();
        // tampilFood();
        // tampilBvrg();
        // emptyDB();
      }
    }
  },

  // Default route (404 page). MUST BE THE LAST
  {
    path: '(.*)',
    url: './pages/404.html',
  },
  
];
