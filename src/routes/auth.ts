import { Router } from 'express';
import { InvalidLoginError, UserExistsError, login, loginEmail, register } from '../auth/auth';
import { sendSuccess, sendError } from '../error/error';
import { User, UserNotFoundError } from '../database/database';

const authRouter = Router();

/**
 * Handles JSON login requests
 * POST to /auth/login with body params
 * email or username and password
 */
authRouter.post('/login', async (req, res) => {
  if (req.body && (req.body.username || req.body.email) && req.body.password) {
    try {
      let user = await (req.body.username ? login(req.body.username, req.body.password)
        : loginEmail(req.body.email, req.body.password));
      req.session.login = user.id;
      sendSuccess(res);
    } catch (e) {
      let invalid = e instanceof InvalidLoginError || e instanceof UserNotFoundError;
      sendError(res, invalid ? 'Invalid login' : 'Unknown error logging in');
      if (!invalid) console.error(invalid);
    }
  } else sendError(res, 'Must specify a username and password');
});

/**
 * Handles JSON register requests
 * POST to /auth/register with body params
 * username, password, email
 */
authRouter.post('/register', async (req, res) => {
  if (req.body && req.body.username && req.body.password && req.body.email) {
    try {
      let user = await register(req.body.username, req.body.password, req.body.email);
      req.session.login = user.id;
      sendSuccess(res);
    } catch (e) {
      if (e instanceof UserExistsError) sendError(res, 'User already exists');
      else {
        sendError(res, 'Unknown error creating account');
        console.error(e);
      }
    }
  }
});

/** Post to /auth/logout to sign out - JSON response */
authRouter.post('/logout', (req, res) => {
  if (req.session.login) delete req.session.login;
  sendSuccess(res);
});

export default authRouter;