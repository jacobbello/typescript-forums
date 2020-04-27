import { Application } from "express";
import path = require('path');
import express = require('express');
import * as ForumRoutes from "./forumRoutes";
import {handleLogin, handleRegister, handleLogout} from './authenticationRoutes';
import cookieParser = require('cookie-parser');
import csrf = require('csurf');


export function setupRoutes(app: Application) {
  app.set('views', path.join(__dirname, '../../views'));
  app.set('view engine', 'pug');
  app.use(express.static(path.join(__dirname, '../../public')));
  let csrfProtection = csrf({cookie: true});
  app.use(cookieParser());

  let router = express.Router();
  router.get('/', csrfProtection, (req: express.Request, res: express.Response) => {
    res.render('index', {csrfToken: req.csrfToken()});
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

  router.post('/auth/login', csrfProtection, handleLogin);
  router.post('/auth/logout', csrfProtection, handleLogout);
  router.post('/auth/register', csrfProtection, handleRegister);

  app.use('/', router);

  app.use((err: any, req, res, next) => {
    console.error(err);
    res.status(err.status || 500);
    res.render('error', {message: err.message, error: err, csrfToken: req.csrfToken()});
  });
}
