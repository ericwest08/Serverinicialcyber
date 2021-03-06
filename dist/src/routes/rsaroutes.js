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
Object.defineProperty(exports, "__esModule", { value: true });
const tokenVerify_1 = require("./../middlewares/tokenVerify");
const express_1 = require("express");
const rsaController = __importStar(require("../controllers/rsacontroller"));
const router = (0, express_1.Router)();
// INTERCAMBIO DE CLAVES
router.get('/server/pubkey', rsaController.getPublicKeyRSA);
router.post('/client/pubkey', rsaController.postPubKeyRSA);
// RSA SERVICE
router.get('/msg', rsaController.getRSA);
router.post('/post', tokenVerify_1.TokenValidation, rsaController.postRSA);
router.post('/sign', rsaController.sign);
//PAILLIER
router.get('/paillier', rsaController.getPaillierPubKey);
router.post('/paillier/homorfismSum', tokenVerify_1.TokenValidation, rsaController.HomorfismpostSum);
router.post('/paillier/homorfismMult', tokenVerify_1.TokenValidation, rsaController.HomorfismpostMult);
router.post('/paillier/decrypt', rsaController.paillierDecript);
//SHARED SECRET
router.post('/sharedsecret', rsaController.getSecretKeys);
router.post('/sharedsecret/recover', tokenVerify_1.TokenValidation, rsaController.recoverSecret);
exports.default = router;
