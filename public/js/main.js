texts = ["Don't have an account? Click here to register.", "Already have an account? Click here to login"]
index = 0;

$(document).ready(function() {
  $('#register').hide();
  $('#login-toggle').click(function() {
    index = 1-index;
    $('#login-toggle').text(texts[index]);
    if (index) {
      $('#login').hide();
      $('#register').show();
    } else {
      $('#login').show();
      $('#register').hide();
    }
  });
  $("#login").submit(function(e) {
    e.preventDefault(true);
    $.post('/auth/login', $(this).serialize(), function(data) {
      response = JSON.serialize(data);
      if (response['success']) {
        location.reload();
      } else {
        $('#error').text(response['error']).fadeIn();
      }
    });
  });

  $("#register").submit(function(e) {
    e.preventDefault(true);
    $.post('/auth/register', $(this).serialize(), function(data) {
      if (response['success']) {
        location.reload();
      } else {
        $('#error').text(response['error']).fadeIn();
      }
    });
  });
});
