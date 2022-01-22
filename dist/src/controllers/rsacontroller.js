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
exports.recoverSecret = exports.getSecretKeys = exports.getPaillierPubKey = exports.sign = exports.getRSA = exports.postRSA = exports.postPubKeyRSA = exports.getPublicKeyRSA = exports.rsaInit = void 0;
const rsa = __importStar(require("my-rsa"));
const bc = __importStar(require("bigint-conversion"));
const bigint_conversion_1 = require("bigint-conversion");
const paillier = __importStar(require("paillier-bigint"));
const shamirs = require('shamirs-secret-sharing');
let pubkey;
let privkey;
let pubKeyClient;
let mensaje;
let keys;
let keyPairPaillier;
let pubKeyPaillier;
async function rsaInit() {
    // GENERA PAR DE LLAVES RSA (public & private)
    console.log("Generando claves . . .");
    keys = await rsa.generateKeys(3072);
    //GENERA PAR DE LLAVES PAILLIER
    keyPairPaillier = await paillier.generateRandomKeys();
    console.log("CLAVE PÚBLICA");
    pubkey = keys.publicKey;
    console.log(pubkey);
    console.log("CLAVE PRIVADA");
    privkey = keys.privateKey;
    console.log(privkey);
    console.log("CLAVE PÚBLICA PAILLIER");
    pubKeyPaillier = keyPairPaillier.publicKey;
    console.log(pubKeyPaillier);
    console.log("Claves generadas con éxito!");
}
exports.rsaInit = rsaInit;
async function getPublicKeyRSA(req, res) {
    try {
        let data = {
            e: bc.bigintToHex(keys.publicKey.e),
            n: bc.bigintToHex(keys.publicKey.n),
        };
        res.status(200).send(data);
    }
    catch (err) {
        console.log("ERROR AL RECIBIR: " + err);
        res.status(500).json({ message: "Internal server error" });
    }
}
exports.getPublicKeyRSA = getPublicKeyRSA;
// Función que recoge la clave pública del cliente
async function postPubKeyRSA(req, res) {
    try {
        let e = req.body.e;
        let n = req.body.n;
        pubKeyClient = new rsa.RsaPublicKey(bc.hexToBigint(e), bc.hexToBigint(n));
        console.log("pubkey client: ", pubKeyClient);
        return res.status(200).json({ message: "Clave enviada con éxito" });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
}
exports.postPubKeyRSA = postPubKeyRSA;
// Función que descifra mensaje del cliente
async function postRSA(req, res) {
    try {
        let msg = req.body.message;
        console.log("MENSAJE RECIBIDO CIFRADO: " + msg);
        let mnsjBigInt = privkey.decrypt(bc.hexToBigint(msg));
        mensaje = bc.bigintToText(mnsjBigInt);
        console.log("MENSAJE DESCIFRADO: " + mensaje);
        let encrypted = privkey.sign((0, bigint_conversion_1.hexToBigint)("Mensaje recibido, comprobación de firma"));
        console.log("FIRMA: " + encrypted);
        return res.status(200).json({
            response: "Mensaje recibido, comprobación de firma",
            signedData: (0, bigint_conversion_1.bigintToHex)(encrypted)
        });
    }
    catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
exports.postRSA = postRSA;
// Función que envía mensaje cifrado al cliente
async function getRSA(req, res) {
    try {
        if (mensaje == null)
            mensaje = "Introduce tu nombre";
        let encrypted = await pubKeyClient.encrypt((0, bigint_conversion_1.textToBigint)(mensaje));
        return res.status(200).json({ encrypted: (0, bigint_conversion_1.bigintToHex)(encrypted) });
    }
    catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
exports.getRSA = getRSA;
// Función que firma el mensaje que le envía el cliente
async function sign(req, res) {
    try {
        let msg = req.body.mensaje;
        console.log("MSG: ", msg);
        let encrypted = await privkey.sign((0, bigint_conversion_1.hexToBigint)(msg));
        return res.status(200).json({ dataSigned: (0, bigint_conversion_1.bigintToHex)(encrypted) });
    }
    catch (err) {
        return res.status(500).json(err);
    }
}
exports.sign = sign;
//Función que envia la clave pública de Paillier al cliente para homorfismo
async function getPaillierPubKey(req, res) {
    try {
        keyPairPaillier = await paillier.generateRandomKeys(3072);
        res.status(200).send({
            n: bc.bigintToHex(keyPairPaillier["publicKey"]["n"]),
            g: bc.bigintToHex(keyPairPaillier["publicKey"]["g"])
        });
    }
    catch (err) {
        res.status(500).send({ message: err });
    }
}
exports.getPaillierPubKey = getPaillierPubKey;
//SHARED SECRET
async function getSecretKeys(req, res) {
    const secret = req.body.secret;
    const sharesH = [];
    const shares = shamirs.split(secret, { shares: req.body.numKeysSecrets, threshold: req.body.numkeysThreshold });
    shares.forEach((share) => {
        sharesH.push(bc.bufToHex(share));
    });
    console.log("Llaves secreto compartido", shares);
    try {
        res.status(200).send(sharesH);
    }
    catch (err) {
        res.status(500).json({ message: "server error" });
    }
}
exports.getSecretKeys = getSecretKeys;
async function recoverSecret(req, res) {
    const sharedSecretsKeys = req.body.keysRecovery;
    console.log(" Claves pars recuperación:", sharedSecretsKeys);
    const recovered = shamirs.combine(sharedSecretsKeys);
    console.log("Combinación secreto compartido", bc.bufToText(recovered));
    try {
        res.status(200).send({ "Recuperado": bc.bufToText(recovered) });
    }
    catch (err) {
        res.status(500).json({ message: "server error" });
    }
}
exports.recoverSecret = recoverSecret;
// export async function getPaillierKeys(req: Request, res: Response) {
//   const paillierBigint = require('paillier-bigint')
//   const { publicKey, privateKey } = await paillierBigint.generateRandomKeys(3072)
//   publicKeyPailler = publicKey;
//   privateKeyPailler = privateKey;  
//   console.log("**********PAILLIER***********")
//   console.log("1 Publica Paillier: ", bigintConversion.bigintToHex(publicKey.n));
//   //console.log("Privada Paillier: ", privateKeyPaillier);
//     res.status(200).send({n: bigintConversion.bigintToHex(publicKey.n),
//     g: bigintConversion.bigintToHex(publicKey.g)});
// }
