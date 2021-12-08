"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//Modificar este código para hacer funcionar el módulo
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
//import { generateKeys } from '@my-scope/my-package-name';
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
    //poner generar claves
});
exports.default = app;
