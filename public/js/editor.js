$(() => {
    console.log('Registering listener');
    $('#editor').on('submit', e => {
        console.log('Got submission, cancelling');
        e.preventDefault();
        $.post('/thread/create', $('#editor').serialize(), (response) => {
            if (response['success'])
                location.reload();
            else {
                $('#categoryerror').text(response['error']).fadeIn();
            }
        });
    });
});
//# sourceMappingURL=editor.js.map