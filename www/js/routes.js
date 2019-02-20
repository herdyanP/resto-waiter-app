var routes = [
  // Index page
  {
    path: '/',
    url: './index.html',
    name: 'home',
  },
  {
    path: '/pengaturan/',
    componentUrl: './pages/pengaturan.html'
  },
  {
    path: '/tambah/',
    componentUrl: './pages/tambah.html',
    on: {
      pageAfterOut: function(){
        tampilFood();
        tampilBvrg();
        // tampilCombo();
      }
    }
  },
  // About page
  {
    path: '/about/',
    url: './pages/about.html',
    name: 'about',
  },
];
