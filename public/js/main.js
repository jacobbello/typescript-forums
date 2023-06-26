texts = ["Don't have an account? Click here to register.", "Already have an account? Click here to login"]
index = 0;

$(document).ready(function() {
  $('#register').hide();
  $('#register-submit').hide();
  $('#login-toggle').click(function() {
    index = 1-index;
    $('#login-toggle').text(texts[index]);
    if (index) {
      $('#login').hide();
      $('#login-submit').hide();
      $('#register').show();
      $('#register-submit').show();
    } else {
      $('#login').show();
      $('#login-submit').show();
      $('#register').hide();
      $('#register-submit').hide();
    }
  });
  $("#login").submit(function(e) {
    e.preventDefault(true);
    $.post('/auth/login', $(this).serialize(), function(response) {
      if (response['success']) {
        location.reload();
      } else {
        $('#error').text(response['error']).fadeIn();
      }
    });
  });
  $('#login-submit').click((e) => $('#login').submit());
  $('#register-submit').click((e) => $('#register').submit());

  $("#register").submit(function(e) {
    e.preventDefault(true);
    $.post('/auth/register', $(this).serialize(), function(response) {
      if (response['success']) {
        location.reload();
      } else {
        $('#error').text(response['error']).fadeIn();
      }
    });
  });
});
