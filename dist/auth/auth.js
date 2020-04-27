"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../database/database");
const bcrypt_1 = require("bcrypt");
let db;
function login(username, password) {
    db = database_1.getDatabase();
    return new Promise((resolve, reject) => {
        db.getUserByName(username).then((u) => {
            bcrypt_1.compare(password, u.password).then((result) => {
                if (result)
                    resolve(u);
                else
                    reject('Invalid login');
            }).catch(reject);
        }).catch(reject);
    });
}
exports.login = login;
function register(username, password, email) {
    db = database_1.getDatabase();
    return new Promise((resolve, reject) => {
        db.getUserByName(username).then((u) => {
            reject('User already exists');
        }).catch((reason) => {
            if (reason == 'User does not exist') {
                bcrypt_1.hash(password, 10).then((hash) => {
                    db.getNextId('user').then((id) => {
                        let user = {
                            username: username,
                            password: hash,
                            email: email,
                            id: id
                        };
                        db.insertUser(user).then(() => {
                            resolve(user);
                        }).catch(reject);
                    }).catch(reject);
                }).catch(reject);
            }
            else
                reject(reason);
        });
    });
}
exports.register = register;
//# sourceMappingURL=auth.js.map