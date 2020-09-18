function dashboardFavorit(){
    var b = document.getElementById('tgl_awal');
    var c = document.getElementById('tgl_akhir');
    // var jenis;
    var data = {
      'act' : 'dashFav',
    }
  
    var fav = Highcharts.chart('container1',{
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        title: {
            text: 'Penjualan Favorit'
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
        url: site+'/API/laporan/'+cpyProf.ID_CLIENT+'/'+cpyProf.ID,
        method: 'POST',
        data: JSON.stringify(data),
        success: function(result){
            var parsed = JSON.parse(result);
            if(parsed.ST_CODE == '1'){
                var iter = parsed.DATA;
                for(var i = 0; i < iter.length; i++){
                    fav.series[0].addPoint({
                        name: iter[i].nama_barang,
                        y: parseInt(iter[i].jml),
                        id: iter[i].id_barang
                    }, false);
                }
            } else {
                fav.series[0].addPoint({
                    name: 'kosong',
                    y: 1,
                    id: '1'
                }, false);
            }

            fav.redraw();
        }
    })
}
  
function dashboardHarian(tahun, bulan){
    var dt = new Date(tahun, bulan+1, 0);
    var dtNow = new Date();
    var currX = (bulan == dtNow.getMonth() && tahun == dtNow.getFullYear() ? dtNow.getDate() / dt.getDate() : 0);
    var data = {
        act : "dashHarian",
        bulan : dt.getMonth()+1
    }
  
    var harian = Highcharts.chart('container2', {
        chart: {
            type: 'line',
            scrollablePlotArea: {
                minWidth: 1280,
                scrollPositionX: currX,
            }
        },
        title: {
            text: 'Chart Penjualan Harian Bulan Ini',
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
            // tickInterval: 24 * 3600 * 1000
        },
        series: [{
            pointStart: Date.UTC(dt.getFullYear(), dt.getMonth(), 1),
            pointInterval: 24 * 3600 * 1000,
            type: 'line',
            name: "Penjualan dalam rupiah",
        }]
    })
  
    app.request({
        url: site+'/API/laporan/'+cpyProf.ID_CLIENT+'/'+cpyProf.ID,
        method: "POST",
        data: JSON.stringify(data),
        success: function(result){
            var parsed = JSON.parse(result);
            if(parsed.ST_CODE == '1'){
                var c = 1;
                var dtArr = [];
                var iter = parsed.DATA;
        
                for(var d = 1; d <= dt.getDate(); d++){
                    dtArr.push({x: d, y: 0});
                }
        
                for(var i = 0; i < iter.length; i++){
                    dtArr[iter[i].tanggal-1].x = iter[i].tanggal;
                    dtArr[iter[i].tanggal-1].y = parseInt(iter[i].harian);
                }
        
                for(var i = 0; i < dtArr.length; i++){
                    harian.series[0].addPoint({
                        y: dtArr[i].y
                    }, false);
                }
            }
            
            harian.redraw();
        }
    })
}