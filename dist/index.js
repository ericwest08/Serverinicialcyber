"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//Modificar este código para hacer funcionar el módulo
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const rsacontroller = __importStar(require("./src/controllers/rsacontroller"));
//INITIALIZATIONS
const app = (0, express_1.default)(); //To create an Express application
//CONFIGS
app.set('port', process.env.PORT || 3000);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ 'extended': false }));
app.use((0, morgan_1.default)('dev'));
app.use((0, cors_1.default)({ origin: 'http://localhost:4200' }));
app.use(body_parser_1.default.json());
//SERVER STARTUP
app.listen(app.get('port'), () => {
    console.log(`Listening at port ${app.get('port')}\n`);
    rsacontroller.rsaInit();
});
exports.default = app;
