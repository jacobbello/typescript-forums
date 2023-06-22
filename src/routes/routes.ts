import { Application } from "express";
import path = require('path');
import express = require('express');
import * as ForumRoutes from "./forumRoutes";
import authRouter from './auth';
import cookieParser = require('cookie-parser');
import csrf = require('csurf');
import categoryRouter from "./category";
import threadRouter from "./thread";
import postRouter from "./post";


export function setupRoutes(app: Application) {
  app.set('views', path.join(__dirname, '../../views'));
  app.set('view engine', 'pug');
  app.use(express.static(path.join(__dirname, '../../public')));
  let csrfProtection = csrf({cookie: true});
  app.use(cookieParser());

  app.get('/', csrfProtection, (req, res) => {
    res.render('index', {csrfToken: req.csrfToken()});
  });

  app.use('/auth', csrfProtection, authRouter);
  app.use('/category', csrfProtection, categoryRouter);
  app.use('/thread', threadRouter);
  app.use('/post', postRouter);

  app.use((err: any, req, res, next) => {
    console.error(err);
    res.status(err.status || 500);
    res.render('error', {message: err.message, error: err, csrfToken: req.csrfToken()});
  });
}
