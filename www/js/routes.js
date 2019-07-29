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
        listmeja();
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
    path: '/menu/:idMeja/',
    template: `<div class="page" data-name="menu">
                <div class="navbar" >
                  <div class="navbar-inner sliding">
                    <div class="left">
                      <a href="#" onclick="testEmpty()" class="link back">
                        <i class="icon icon-back"></i>
                        <span class="ios-only">Back</span>
                      </a>
                    </div>
                    <div class="title">Menus</div>
                    <div class="right">
                      <a class="link icon-only searchbar-enable" data-searchbar=".searchbar" onclick="keranjang({{$route.params.idMeja}})"><i class="icon material-icons md-only">shopping_cart</i></a>
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
    name: 'pesanan',
    path: '/pesanan/:idMeja/:idPJ/',
    componentUrl: './pages/pesanan.html',
    on: {
        pageAfterIn: function test (e, page) {
          // console.log(page.route.params.idMeja, page.route.params.idPJ);
          // do something after page gets into the view
        },
        pageInit: function (e, page) {
          lihatPesanan(page.route.params.idMeja, page.route.params.idPJ);
          // do something when page initialized          
          // tampil(1);
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
