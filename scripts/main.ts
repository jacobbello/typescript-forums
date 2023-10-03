//import { lookupUser } from "./user";

let texts = ["Don't have an account? Click here to register.", "Already have an account? Click here to login"]
let index = 0;

$(() => {
    $('.register').hide();
    $('#login-toggle').on('click', e => {
        index = 1 - index;
        $('#login-toggle').text(texts[index]);
        if (index) {
            $('.login').hide();
            $('.register').show();
        } else {
            $('.login').show();
            $('.register').hide();
        }
    });

    $('#login').on('submit', async e => {
        e.preventDefault();
        $.post('auth/login', $('#login').serialize(), (response) => {
            if (response.success) location.reload();
            else {
                $('#error').text(response.error).fadeIn();
            }
        });
    });
    $('#login-submit').on('click', () => $('#login').trigger('submit'));
    $('#register').on('submit', (e) => {
        e.preventDefault();
        $.post('/auth/register', $('#register').serialize(), (response) => {
            if (response.success) location.reload();
            else $('#error').text(response.error).fadeIn();
        });
    });
    $('#register-submit').on('click', () => $('#register').trigger('submit'));
/*
    $('.loaded-username').each(function() {
        let id = $(this).attr('data-user-id');
        if (id) {
            try {
                lookupUser(parseInt(id)).then(u => {
                    $(this).text(u.username);
                });
            } catch(e) {
                console.error('Error loading user: ' + e);
            }
        }
    });*/
});