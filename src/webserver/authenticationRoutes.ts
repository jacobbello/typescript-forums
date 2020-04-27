import {Request, Response} from 'express';
import {error, success} from '../error/jsonerror';
import {login, register} from '../auth/auth';
import { User } from '../database/database';

export function handleLogin(req: Request, res: Response) {
  let username = req.param('username');
  let password = req.param('password');
  if (username && password) {
    login(username, password).then((user: User) => {
      req.session.login = user.id;
      res.send(success());
    }).catch((reason: any) => {
      res.send(error(reason));
    })
  } else res.send(error('Must specify a username and password'));
}

export function handleRegister(req: Request, res: Response) {
  let username = req.param('username');
  let password = req.param('password');
  let email = req.param('email');
  if (username && password && email) {
    register(username, password, email).then((user: User) => {
      req.session.login = user.id;
      res.send(success());
    }).catch((reason: any) => {
      res.send(error(reason));
    });
  } else res.send(error('Must specify username, email, and password'));
}

export function handleLogout(req: Request, res: Response) {
  if (req.session.login) delete req.session.login;
  res.send(success());
}
