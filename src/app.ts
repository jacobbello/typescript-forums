import {WebServer} from './webserver/webserver';
import {Mongo} from './database/mongo';
import {setDatabase, DatabaseOptions, Database} from './database/database';
import MemoryDatabase from './database/memorydatabase';
const config = require('config');
const port = config.get('port');
var databaseType = config.get('database.type');

var db: Database;

if (databaseType.toLowerCase() == 'memory') {
  db = new MemoryDatabase();
} else if (databaseType.toLowerCase() == 'mongo') {
  db = new Mongo(config.get('database'));
}

setDatabase(db);

new WebServer(port, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Listening on port ' + port);
  }
});
