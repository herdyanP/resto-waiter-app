function onNewLogin(){
    $('#login_button').addClass('disabled');
    var formData = app.form.convertToData('#login_cred');

    onLoginAttempt(formData);
}

function cekStored(){
    NativeStorage.getItem('akun', function(obj){
        var loginData = {
            user: obj.USERNAME,
            pass: obj.PASSWORD,
            stamp: obj.STAMP
        }

        onLoginAttempt(loginData);
    }, function(){
        NativeStorage.clear();
    });
}

function onLoginAttempt(loginData){
    app.request({
        url: site+'/API/login/',
        method: 'POST',
        data: JSON.stringify(loginData),
        timeout: 10 * 1000,
        success: function(result){
            var parsed = JSON.parse(result);
            if(parsed.ST_CODE == '1'){
                parsed.PASSWORD = loginData.pass;
                // logoByte64 = parsed[0].image;
                // initGambar(parsed[0].image);
                
                NativeStorage.setItem('akun', parsed, function(obj){
                    cpyProf = obj;
                    sessionCheck();

                    $('#panel_subTitle').html('<br><strong>MediaPOS '+(cpyProf.jenis == 1 ? "F&amp;B" : "Retail")+'</strong><br>POS Application<br>'+cpyProf.outlet);
                    app.views.main.router.navigate('/home/');
                });
            } else if(parsed.ST_CODE == '2'){
                app.toast.create({
                    text: "Anda telah login di perangkat lain! Mohon logout terlebih dahulu",
                    closeTimeout: 3000,
                    closeButton: true
                }).open();
            } else {
                app.toast.create({
                    text: "Cek lagi username / password anda",
                    closeTimeout: 3000,
                    closeButton: true
                }).open();
            }
        },
        error: function(){
            app.toast.create({
                text: "Koneksi ke Server Gagal",
                closeTimeout: 3000,
                closeButton: true
            }).open();
        },
        complete: function(){
            $('#login_button').removeClass('disabled');
        }
    })
}

function sessionCheck(){
    app.request({
        url: site+'/API/session/'+cpyProf.ID_CLIENT+'/'+cpyProf.ID,
        method: 'GET',
        success: function(result){
            var parsed = JSON.parse(result);
            if(parsed.ST_CODE == '1'){
                cpyProf.STAMP = parsed.STAMP;
                NativeStorage.setItem('akun', cpyProf);

                refreshSession = setTimeout(sessionCheck, 5 * 60 * 1000);
            } else {
                alert('Gagal cek session');
                onLogout();
            }
        }
    })
}

function onLogout(){
    clearTimeout(refreshSession);
    $('#panel_subTitle').html('<br><strong>MediaPOS</strong><br>POS Application');
    $('#title_home').html('MediaPOS');

    NativeStorage.clear(function(){
        app.request({
            url: site+'/API/logout/'+cpyProf.ID_CLIENT+'/'+cpyProf.ID,
            method: 'GET',
            success: function(result){
                var parsed = JSON.parse(result);
                if(parsed.ST_CODE == '1'){
                    app.views.main.router.navigate('/', {
                        clearPreviousHistory: true,
                        history: false
                    });
                } else {
                    console.log('Gagal logout');
                }
            }
        })
    }, function(){
        console.log('clear failed');
    });
}