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
      pageInit: function(){
        emptyDB();
        allItems();
      },
      pageAfterOut: function(){
        tampilFood();
        tampilBvrg();
        emptyDB();
        // tampilCombo();
      }
    }
  },
  {
    path: '/profil/',
    componentUrl: './pages/profil.html'
  },
  {
    path: '/login/',
    componentUrl: './pages/login.html'
  },
  // About page
  {
    path: '/about/',
    url: './pages/about.html',
    name: 'about',
  },
];
