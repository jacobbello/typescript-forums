"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonerror_1 = require("../error/jsonerror");
const auth_1 = require("../auth/auth");
function handleLogin(req, res) {
    let username = req.param('username');
    let password = req.param('password');
    if (username && password) {
        auth_1.login(username, password).then((user) => {
            req.session.login = user.id;
            res.send(jsonerror_1.success());
        }).catch((reason) => {
            res.send(jsonerror_1.error(reason));
        });
    }
    else
        res.send(jsonerror_1.error('Must specify a username and password'));
}
exports.handleLogin = handleLogin;
function handleRegister(req, res) {
    let username = req.param('username');
    let password = req.param('password');
    let email = req.param('email');
    if (username && password && email) {
        auth_1.register(username, password, email).then((user) => {
            req.session.login = user.id;
            res.send(jsonerror_1.success());
        }).catch((reason) => {
            res.send(jsonerror_1.error(reason));
        });
    }
    else
        res.send(jsonerror_1.error('Must specify username, email, and password'));
}
exports.handleRegister = handleRegister;
function handleLogout(req, res) {
    if (req.session.login)
        delete req.session.login;
    res.send(jsonerror_1.success());
}
exports.handleLogout = handleLogout;
//# sourceMappingURL=authenticationRoutes.js.map