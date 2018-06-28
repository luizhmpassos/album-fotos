var user;
var client_id = '74962652042-kb64ctk5r1aretpsasgm96j514k3s2t0.apps.googleusercontent.com'
var access_token;
var albums;
var fotos;
function entrar(nome) {
    //alert('entrou');
    var login = $('#login').val();
    var senha = $('#senha').val();

    //alert('login: ' + login + '/ senha: ' + senha);
    //$('#usuarioDeslogado').addClass('hide');
    $('#usuarioLogado').removeClass('hide');
    $('#conteudo_deslogado').addClass('hide');
    $('#conteudo_logado').removeClass('hide');
    $('#usuarioLogado').find("p").text("Olá " + nome + "!");
    //window.location = "/login/google";
}

function sair() {
    //alert('entrou');


    //alert('login: ' + login + '/ senha: ' + senha);
    //$('#usuarioDeslogado').removeClass('hide');
    $('#usuarioLogado').addClass('hide');
    $('#conteudo_logado').addClass('hide');
    $('#conteudo_deslogado').removeClass('hide');
    $('#usuarioLogado').find("p").text("Olá !");
    //window.location = "/login/google";
}
function signOutk() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
    sair();
}

function onSignIn(googleUser) {
    user = googleUser;
    var profile = googleUser.getBasicProfile();
    entrar(profile.getName());
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail());// This is null if the 'email' scope is not present.
    console.log('ID_Token: ' + googleUser.getAuthResponse().id_token);
    console.log('Access_token: ' + googleUser.getAuthResponse().access_token);
    access_token = googleUser.getAuthResponse().access_token;
    getGooglePhotsItens();
}



function getGooglePhotsItens() {
    $.ajax({
        url: 'https://photoslibrary.googleapis.com/v1/albums',
        headers: {
            Authorization: 'Bearer ' + access_token
        },
        dataType: "json",
        success: function (data) {
            albums=data.albums;
            var strSaida = '';

            for (i = 0; i < albums.length; i++) {
                strSaida += '<li role="navigation"><a onclick="getAlbunItens('
                    + "'"
                    + albums[i].id
                    + "'"
                    + ')">' + albums[i].title
                    + '</a></li>';
            }
            strSaida += '<li role="navigation"><a href="#"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></a></li>'
            $('#albuns').html('<h3> Albuns </h3> <ul class="nav nav-pills nav-stacked">' +
                strSaida + '</ul></div>');
        },error: function(e){
            if(e.status==403){
                addScope();
            }
        }
    });
}

function getAlbunItens(album_id) {
    $.ajax({
        url: 'https://photoslibrary.googleapis.com/v1/mediaItems:search',
        headers: {
            Authorization: 'Bearer ' + access_token,
        },
        data: {
            pageSize: 100,
            albumId: album_id
        },
        dataType: "json",
        type: "POST",
        success: function (data) {
            var strSaida = '';
            fotos =data.mediaItems;

            for (i = 0; i < fotos.length; i++) {
                strSaida += '<div class="col-xs-6 col-sm-6 col-md-3"> <a href="#" class="thumbnail">'
                    +'<img src="'+ fotos[i].baseUrl +'" alt="..."></a></div>';
            }
            $('#listaFotos').html(strSaida );
        },error: function(e){
            if(e.status==403){
                addScope();
            }
        }
    });
}
function addScope(){
    var options = new gapi.auth2.SigninOptionsBuilder(
      {'scope': 'https://www.googleapis.com/auth/photoslibrary'});
  
  user.grant(options).then(
  function(success){
    console.log(JSON.stringify({message: "success", value: success}));
    location.reload();
  },
  function(fail){
      alert(fail.error);
  });
  }