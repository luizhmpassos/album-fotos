function entrar() {
    alert('entrou');
    var login = $('#login').val();
    var senha = $('#senha').val();

    alert('login: ' + login + '/ senha: ' + senha);
    $('#usuarioDeslogado').addClass('hide');
    $('#usuarioLogado').removeClass('hide');
}