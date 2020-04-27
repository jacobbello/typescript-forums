import express, { Application } from 'express';
import { setupRoutes } from './routes';
import session = require('express-session');


export class WebServer {
  app: Application;

  constructor(port: number, callback: (err) => void) {
      this.app = express();
      setupRoutes(this.app);
      this.app.use(session({
        secret: 'something idk',
        resave: false,
        saveUninitialized: true,
        cookie: {secure: this.app.get('env') === 'production'}
      }));
      this.app.listen(port, callback);
  }
}
