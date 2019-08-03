var routes = [
  // Index page
  {
    path: '/',
    url: './index.html',
    name: 'login',
  },
  {
    path: '/home/',
    url: './pages/home.html',
    name: 'home',
    on: {
      pageAfterIn: function (){
        listMeja();
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
            <a href="#" class="link back">
              <i class="icon icon-back"></i>
              <span class="ios-only">Back</span>
            </a>
          </div>
          <div class="title">Menus</div>
          <div class="right">
            <a class="link icon-only" href="/keranjang/{{$route.params.idMeja}}/{{$route.params.idPJ}}/"><i class="icon material-icons md-only">shopping_cart</i></a>
          </div>
        </div>
      </div>
      <div class="page-content" style="padding-top: 27px; padding-bottom: 35px; overflow-y: hidden">
        <div class="list no-hairlines no-hairlines-between">
          <ul>
            <li class="item-content item-input">
              <div class="item-inner">
                <div class="item-title item-label"></div>
                <div class="item-input-wrap input-dropdown-wrap">
                  <select name="kategori" id="kategori" onchange="ubahKategori(this.value);">
                    <option value="1">Foods</option>
                    <option value="2">Beverages</option>
                    <option value="3">Others</option>
                  </select>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="block">
          <div class="grid-demo">
            <div class="row" id="menuku" style=" overflow-y:scroll;max-height: calc( 90vh - 50px );justify-content: normal;">
            </div>
          </div>
        </div>
      </div>
    </div>`,
    on: {
        pageAfterIn: function test (e, page) {
          // do something after page gets into the view
        },
        pageInit: function (e, page) {
          // do something when page initialized          
          tampil(page.route.params.idMeja);
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
          <!-- <button class="button" onclick="splitBill()">Split</button> -->
          <button class="button" onclick="simpanPesanan({{$route.params.idMeja}}, {{$route.params.idPJ}})">Save Orders</button>
          <!-- <button class="button" onclick="mergeBill()">Merge</button> -->
        </div>
      </div>
    </div>`,
    on: {
        pageAfterIn: function test (e, page) {
          // do something after page gets into the view
        },
        pageInit: function (e, page) {
          // do something when page initialized          
          lihatKeranjang(page.route.params.idMeja);
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
          <div class="title">Orders for table #{{$route.params.idMeja}}</div>
          <div class="right">
            <a class="link icon-only" onclick="toSplit();" style="margin: 0 10px 0 0;"><i class="icon material-icons md-only">call_split</i></a>
            <a class="link icon-only" href="/menu/{{$route.params.idMeja}}/{{$route.params.idPJ}}/" style="margin: 0 10px 0 0;"><i class="icon material-icons md-only">add_shopping_cart</i></a>
          </div>
        </div>
      </div>
      <div class="page-content">
        <div class="list no-hairlines-between no-hairlines" style=" overflow-y:scroll;height: calc( 60vh - 50px );margin:1px;">
          <ul id="orders">
          </ul>
        </div>
      </div>
      <div class="toolbar toolbar-bottom-md no-shadow" style="height: 70px;">
        <div class="toolbar-inner">
          <button id="split_bill" class="button hidden" onclick="splitBill({{$route.params.idPJ}}, {{$route.params.idMeja}})">Split Into New Bill</button>
          <button id="cetak_bill" class="button" onclick="cetakBillWaiter({{$route.params.idMeja}})">Print Bill</button>
          <!-- <button class="button" onclick="mergeBill()">Merge</button> -->
        </div>
      </div>
    </div>`,
    // componentUrl: './pages/pesanan.html',
    on: {
        pageAfterIn: function test (e, page) {
          // console.log('afterin');
          lihatPesanan(page.route.params.idMeja, page.route.params.idPJ);
          // console.log(page.route.params.idMeja, page.route.params.idPJ);
          // do something after page gets into the view
        },
        pageInit: function (e, page) {
          // console.log('init');
          // lihatPesanan(page.route.params.idMeja, page.route.params.idPJ);
          // do something when page initialized          
          // tampil(1);
        },
      }
  },
  {
    name: 'split',
    path: '/split/',
    template: `
    <div class="page" data-name="split">
      <div class="navbar" >
        <div class="navbar-inner sliding">
          <div class="left">
            <a href="#" class="link back">
              <i class="icon icon-back"></i>
              <span class="ios-only">Back</span>
            </a>
          </div>
        </div>
      </div>
      <div class="page-content" style="padding-top: 27px; padding-bottom: 35px; overflow-y: hidden;">
        <div class="block">
          <div class="row" id="home_grid">
            <div class="grid-demo">
              <div class="row" id="meja_split" style=" overflow:scroll;max-height: calc( 90vh - 50px );justify-content: normal"></div>
            </div>
          </div>
        </div>
      </div>
    </div>`,
    on: {
      pageAfterIn: function test (e, page) {
        // do something after page gets into the view
        listSplit();
      },
      pageInit: function (e, page) {
        // do something when page initialized
      },
    }
  },
  {
    path: '/pesanan-takeaway/',
    componentUrl: './pages/pesanan-takeaway.html',
    on: {
        pageAfterIn: function test (e, page) {
          // do something after page gets into the view
        },
        pageInit: function (e, page) {
          // do something when page initialized          
          tampil(2);
        },
      }
  },
  {
    path: '/pesanan-reorder/',
    componentUrl: './pages/pesanan-reorder.html',
    on: {
      pageAfterIn: function test (e, page) {
        // do something after page gets into the view
      },
      pageInit: function (e, page) {
        // do something when page initialized          
        tampil(3);
      },
    }
  },
  {
    path: '/payment/',
    componentUrl: './pages/payment.html',
    on: {
      pageAfterIn: function test (e, page) {
        // do something after page gets into the view
      },
      pageInit: function (e, page) {
        // do something when page initialized          
        // tampil(3);
      },
    }
  },

  // Default route (404 page). MUST BE THE LAST
  {
    path: '(.*)',
    url: './pages/404.html',
  },
];
