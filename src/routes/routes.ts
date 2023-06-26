import { Application } from "express";
import path = require('path');
import express = require('express');
import authRouter from './auth';
import categoryRouter from "./category";
import threadRouter from "./thread";
import postRouter from "./post";


export function setupRoutes(app: Application) {
  app.set('views', path.join(__dirname, '../../views'));
  app.set('view engine', 'pug');
  app.use(express.static(path.join(__dirname, '../../public')));

  app.get('/', (req, res) => {
    res.render('index', {});
  });

  app.use('/auth', authRouter);
  app.use('/category', categoryRouter);
  app.use('/thread', threadRouter);
  app.use('/post', postRouter);

  app.use((err: any, req, res, next) => {
    console.error(err);
    res.status(err.status || 500);
    res.render('error', {message: err.message, error: err, csrfToken: req.csrfToken()});
  });
}
