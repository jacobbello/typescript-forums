"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const webserver_1 = require("./webserver/webserver");
const mongo_1 = require("./database/mongo");
const database_1 = require("./database/database");
const memorydatabase_1 = __importDefault(require("./database/memorydatabase"));
const config = require('config');
const port = config.get('port');
var databaseType = config.get('database.type');
var db;
if (databaseType.toLowerCase() == 'memory') {
    db = new memorydatabase_1.default();
}
else if (databaseType.toLowerCase() == 'mongo') {
    db = new mongo_1.Mongo(config.get('database'));
}
database_1.setDatabase(db);
new webserver_1.WebServer(port, (err) => {
    if (err) {
        console.error(err);
    }
    else {
        console.log('Listening on port ' + port);
    }
});
//# sourceMappingURL=app.js.map