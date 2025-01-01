require('source-map-support').install();
import MySQLDatabase from './database/mysql';
import { setDatabase, Database } from './database/database';
import express from 'express';
import MemoryDatabase from './database/memory';
import { setupRoutes } from './routes/routes';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import config from 'config';
const port = config.get<number>('port');
var databaseType = config.get<string>('database.type').toLowerCase();

var db: Database;
if (databaseType == 'memory') {
  let filename = config.get<string>('database.filename');
  db = new MemoryDatabase(filename);
} else if (databaseType == 'mysql') {
  let options = config.get<any>('database');
  db = new MySQLDatabase(options);
}
db.connect().then(() => {
  console.log('Database connected');
  setDatabase(db);
}).then(() => {
  const app = express();

  app.use(cookieParser());
  app.use(bodyParser());
  app.use(session({
    secret: 'something idk',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: app.get('env') === 'production' }
  }));

  setupRoutes(app);

  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
}).catch((e) => {
  console.error('Error starting up: ' + e);
});
