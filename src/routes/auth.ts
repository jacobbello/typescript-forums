import {Router} from 'express';
import {InvalidLoginError, UserExistsError, login, register} from '../auth/auth';
import { sendSuccess, sendError } from '../error/error';
import { User } from '../database/database';

const authRouter = Router();

authRouter.post('/auth/login', (req, res) => {
  if (req.body && req.body.username && req.body.password) {
    login(req.body.username, req.body.password).then((user: User) => {
      req.session.login = user.id;
      sendSuccess(res);
    }).catch((reason: any) => {
      if (reason instanceof InvalidLoginError) {
        sendError(res, reason.message);
      } else {
        sendError(res, "Unknown error logging in");
        console.error(reason);
      }
    });
  } else sendError(res, 'Must specify a username and password');
});


authRouter.post('/auth/register', (req, res) => {
  if (req.body && req.body.username && req.body.password && req.body.email) {
    register(req.body.username, req.body.password, req.body.email).then((user: User) => {
      req.session.login = user.id;
      sendSuccess(res);
    }).catch((reason: any) => {
      if (reason instanceof UserExistsError) sendError(res, reason.message);
      else {
        sendError(res, "Unknown error creating account");
        console.error(reason);
      }
    });
  } else sendError(res, 'You must enter a username, email, and password');
});

authRouter.post('/auth/logout', (req, res) => {
  if (req.session.login) delete req.session.login;
  sendSuccess(res);
});

export default authRouter;