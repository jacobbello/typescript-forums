//import { lookupUser } from "./user";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let texts = ["Don't have an account? Click here to register.", "Already have an account? Click here to login"];
let index = 0;
$(() => {
    $('.register').hide();
    $('#login-toggle').on('click', e => {
        index = 1 - index;
        $('#login-toggle').text(texts[index]);
        if (index) {
            $('.login').hide();
            $('.register').show();
        }
        else {
            $('.login').show();
            $('.register').hide();
        }
    });
    $('#login').on('submit', (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        $.post('/auth/login', $('#login').serialize(), (response) => {
            if (response.success)
                location.reload();
            else {
                $('#error').text(response.error).fadeIn();
            }
        });
    }));
    $('#login-submit').on('click', () => $('#login').trigger('submit'));
    $('#register').on('submit', (e) => {
        e.preventDefault();
        $.post('/auth/register', $('#register').serialize(), (response) => {
            if (response.success)
                location.reload();
            else
                $('#error').text(response.error).fadeIn();
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
//# sourceMappingURL=main.js.map