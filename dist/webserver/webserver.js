"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = require("./routes");
const session = require("express-session");
class WebServer {
    constructor(port, callback) {
        this.app = express_1.default();
        routes_1.setupRoutes(this.app);
        this.app.use(session({
            secret: 'something idk',
            resave: false,
            saveUninitialized: true,
            cookie: { secure: this.app.get('env') === 'production' }
        }));
        this.app.listen(port, callback);
    }
}
exports.WebServer = WebServer;
//# sourceMappingURL=webserver.js.map