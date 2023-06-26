import {Mongo} from './database/mongo';
import {setDatabase, Database} from './database/database';
import express from 'express';
import MemoryDatabase from './database/memory';
import { setupRoutes } from './routes/routes';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
const config = require('config');
const port = config.get('port');
var databaseType = config.get('database.type');

var db: Database;
if (databaseType.toLowerCase() == 'memory') {
  db = new MemoryDatabase(true);
} else if (databaseType.toLowerCase() == 'mongo') {
  let uri = config.get('database.url');
  db = new Mongo(uri);
}
db.connect().then(() => {
  console.log('Database connected');
  setDatabase(db);
});

const app = express();

app.use(cookieParser());
app.use(bodyParser());
app.use(session({
  secret: 'something idk',
  resave: false,
  saveUninitialized: true,
  cookie: {secure: app.get('env') === 'production'}
}));

setupRoutes(app);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});