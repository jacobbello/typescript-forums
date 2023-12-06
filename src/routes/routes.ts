import { Application } from "express";
import path = require('path');
import express = require('express');
import authRouter, { getUser } from './auth';
import categoryRouter from "./category";
import threadRouter from "./thread";
import postRouter from "./post";
import { User, db } from "../database/database";
import profileRouter from "./profile";


export function setupRoutes(app: Application) {
  app.set('views', path.join(__dirname, '../../views'));
  app.set('view engine', 'pug');
  app.use(express.static(path.join(__dirname, '../../public')));

  // add user/session information to locals for template engine
  app.use(async (req, res, next) => {
    res.locals.login = req.session?.login;
    if (res.locals.login) res.locals.user = await db.getUserById(res.locals.login);
    next();
  });

  app.get('/', async (req, res) => {
    res.render('index', {});
  });

  app.use('/auth', authRouter);
  app.use('/category', categoryRouter);
  app.use('/thread', threadRouter);
  app.use('/post', postRouter);
  app.use('/profile', profileRouter);

  app.use((err: any, req, res, next) => {
    console.error(err);
    res.status(err.status || 500);
    res.render('error', {message: err.message, error: err});
  });
}
