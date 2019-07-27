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
    path: '/menu/',
    componentUrl: './pages/menu.html',
    on: {
        pageAfterIn: function test (e, page) {
          // do something after page gets into the view
        },
        pageInit: function (e, page) {
          // do something when page initialized          
          tampil(1);
        },
      }
  },
  {
    path: '/pesanan/',
    componentUrl: './pages/pesanan.html',
    on: {
        pageAfterIn: function test (e, page) {
          // do something after page gets into the view
        },
        pageInit: function (e, page) {
          // do something when page initialized          
          tampil(1);
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
