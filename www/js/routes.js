var routes = [
{
  path: '/',
  url: './index.html',
  name: 'home',
  on: {
    pageAfterIn: function(){
      // tampilFood();
      // tampilBvrg();
      // tampilCombo();

      // emptyDB();

      // onLogin();
    }
  }
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
      // allItems();
    },
    pageAfterOut: function(){
      tampilFood();
      tampilBvrg();
      emptyDB();
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
{
  path: '/penjualan/',
  componentUrl: './pages/penjualan.html',
  on: {
    pageInit: function(){
      listPenjualan();
    }
  }
},
{
  path: '/register/',
  componentUrl: './pages/register.html'
}
];
