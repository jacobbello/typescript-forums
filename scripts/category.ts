$(() => {
    $('#newcategory').on('submit', function(e) {
        e.preventDefault();
        $.post('/category/create', $(this).serialize(), (response) => {
            if (response['success']) location.reload();
            else {
                $('#categoryerror').text(response['error']).fadeIn();
            }
        });
    });
});