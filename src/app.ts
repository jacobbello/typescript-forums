import {Mongo} from './database/mongo';
import {setDatabase, DatabaseOptions, Database} from './database/database';
import express from 'express';
import MemoryDatabase from './database/memorydatabase';
import { setupRoutes } from './routes/routes';
import session from 'express-session';
const config = require('config');
const port = config.get('port');
var databaseType = config.get('database.type');

var db: Database;

if (databaseType.toLowerCase() == 'memory') {
  db = new MemoryDatabase();
} else if (databaseType.toLowerCase() == 'mongo') {
  db = new Mongo();
  db.connect(config.get('database')).then(() => {
    console.log('Database connected');
    setDatabase(db);
  });
}


const app = express();
setupRoutes(app);

app.use(session({
  secret: 'something idk',
  resave: false,
  saveUninitialized: true,
  cookie: {secure: app.get('env') === 'production'}
}));

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});