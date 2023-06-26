$(document).ready(() => {
    $('#newcategory').submit(function(e) {
        e.preventDefault(true);
        $.post('/category/create', $(this).serialize(), (response) => {
            if (response['success']) location.reload();
            else {
                $('#categoryerror').text(response['error']).fadeIn();
            }
        });
    });
});