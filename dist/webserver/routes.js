"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const express = require("express");
const ForumRoutes = __importStar(require("./forumRoutes"));
const authenticationRoutes_1 = require("./authenticationRoutes");
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
function setupRoutes(app) {
    app.set('views', path.join(__dirname, '../../views'));
    app.set('view engine', 'pug');
    app.use(express.static(path.join(__dirname, '../../public')));
    let csrfProtection = csrf({ cookie: true });
    app.use(cookieParser());
    let router = express.Router();
    router.get('/', csrfProtection, (req, res) => {
        res.render('index', { csrfToken: req.csrfToken() });
    });
    router.get('/category', ForumRoutes.handleCategory);
    router.get('/thread', ForumRoutes.handleThread);
    router.get('/categories', ForumRoutes.handleCategories);
    router.post('/create/category', csrfProtection, ForumRoutes.handleCreateCategory);
    router.post('/create/thread', csrfProtection, ForumRoutes.handleCreateThread);
    router.post('/create/post', csrfProtection, ForumRoutes.handleCreatePost);
    router.post('/delete/category', csrfProtection, ForumRoutes.handleDeleteCategory);
    router.post('/delete/thread', csrfProtection, ForumRoutes.handleDeleteThread);
    router.post('/delete/post', csrfProtection, ForumRoutes.handleDeletePost);
    router.post('/auth/login', csrfProtection, authenticationRoutes_1.handleLogin);
    router.post('/auth/logout', csrfProtection, authenticationRoutes_1.handleLogout);
    router.post('/auth/register', csrfProtection, authenticationRoutes_1.handleRegister);
    app.use('/', router);
    app.use((err, req, res, next) => {
        console.error(err);
        res.status(err.status || 500);
        res.render('error', { message: err.message, error: err, csrfToken: req.csrfToken() });
    });
}
exports.setupRoutes = setupRoutes;
//# sourceMappingURL=routes.js.map