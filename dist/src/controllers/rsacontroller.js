"use strict";
/* // import paillier
const paillier = require('paillier.js');

// create random keys
const { publicKey, privateKey } = paillier.generateRandomKeys(2048);

// optionally, you can create your public/private keys from known parameters
const publicKey = new paillier.PublicKey(n, g);
const privateKey = new paillier.PrivateKey(lambda, mu, p, q, publicKey);

// encrypt m
let c = publicKey.encrypt(m);

// decrypt c
let d = privateKey.decrypt(c);

// homomorphic addition of two chipertexts (encrypted numbers)
let c1 = publicKey.encrypt(m1);
let c2 = publicKey.encrypt(m2);
let encryptedSum = publicKey.addition(c1, c2);
let sum = privateKey.decrypt(encryptedSum); // m1 + m2

// multiplication by k
let c1 = publicKey.encrypt(m1);
let encryptedMul = publicKey.multiply(c1, k);
let mul = privateKey.decrypt(encryptedMul); // k · m1 */
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
exports.getPubKey = exports.getPrivKey = exports.recoverSecret = exports.getSecretKeys = exports.postPubKeyPaillier = exports.HomorfismpostMult = exports.HomorfismpostSum = exports.paillierDecript = exports.getPaillierPubKey = exports.sign = exports.getRSA = exports.postRSA = exports.postPubKeyRSA = exports.getPublicKeyRSA = exports.rsaInit = void 0;
const rsa = __importStar(require("my-rsa"));
const bc = __importStar(require("bigint-conversion"));
const bigint_conversion_1 = require("bigint-conversion");
const paillier = __importStar(require("paillier-bigint"));
const shamirs = __importStar(require("shamirs-secret-sharing-ts"));
let pubkey;
let privkey;
let pubKeyClient;
let mensaje;
let keys;
let keyPairPaillier;
let pubKeyPaillier;
let privKeyPaillier;
let pubKeyClientPaillier;
async function rsaInit() {
    // GENERA PAR DE LLAVES RSA (public & private)
    console.log("Generando claves . . .");
    keys = await rsa.generateKeys(3072);
    //GENERA PAR DE LLAVES PAILLIER
    keyPairPaillier = await paillier.generateRandomKeys(3072);
    //console.log("CLAVE PÚBLICA RSA:");
    pubkey = keys.publicKey;
    //console.log(pubkey);
    //console.log("CLAVE PRIVADA RSA:");
    privkey = keys.privateKey;
    //console.log(privkey);
    //console.log("CLAVE PÚBLICA PAILLIER:");
    pubKeyPaillier = keyPairPaillier.publicKey;
    privKeyPaillier = keyPairPaillier.privateKey;
    //console.log(pubKeyPaillier);
    console.log("CLAVE PRIVADA PAILLIER:");
    console.log(privKeyPaillier);
    console.log("Claves generadas con éxito!");
}
exports.rsaInit = rsaInit;
//***************************RSA*********************************** */
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
//*************************************PAILLIER**********************************************
async function getPaillierPubKey(req, res) {
    try {
        res.status(200).json({
            ok: true,
            n: bc.bigintToHex(pubKeyPaillier.n),
            g: bc.bigintToHex(pubKeyPaillier.g)
        });
    }
    catch (err) {
        res.status(400).json({
            ok: false,
            error: err
        });
    }
}
exports.getPaillierPubKey = getPaillierPubKey;
// decrypt c (CREAR FUNCIÓN PARA VER QUE SE PUEDE DESENCRIPTAR UN MENSAJE QUE VIENE DEL CLIENTE con la privateKey del SERVER)
/* POST DECRIPTED (pasar por el body el número encriptado con la pública del Server) */
// let d = privateKey.decrypt(c);
async function paillierDecript(req, res) {
    try {
        const msg = bc.hexToBigint(req.body.encripted); //Revisar como me llega del frontend .encripted
        const decrypt = await privKeyPaillier.decrypt(msg);
        console.log('Desencriptamos el valor de c1: ', decrypt);
        res.status(200).json({
            ok: true,
            msg: bc.bigintToHex(decrypt)
        });
    }
    catch (err) {
        res.status(400).json({
            ok: false,
            error: err
        });
    }
}
exports.paillierDecript = paillierDecript;
//  ****************CLIENTE*************
// homomorphic addition of two chipertexts (encrypted numbers)
/* Esta parte la hacemos en cliente: */
/* let c1 = publicKey.encrypt(m1);
let c2 = publicKey.encrypt(m2);
let encryptedSum = publicKey.addition(c1, c2); */
// Hacemos post de encryptedSum hacia el servidor
//  ****************************************
// Recibe la suma de los números del cliente encriptados y los desencripta
async function HomorfismpostSum(req, res) {
    function BinarioADecimal(num) {
        let sum = 0;
        for (let i = 0; i < num.length; i++) {
            sum += +num[i] * 2 ** (num.length - 1 - i);
        }
        return sum;
    }
    try {
        const msg1 = bc.hexToBigint(req.body.mensaje1);
        console.log("Numero 1 ", bc.bigintToText(privKeyPaillier.decrypt(msg1)));
        const msg2 = bc.hexToBigint(req.body.mensaje2);
        console.log("Numero 2 ", bc.bigintToText(privKeyPaillier.decrypt(msg2)));
        const sumEncrypted = pubKeyPaillier.addition(msg1, msg2);
        const decryptedSum = await privKeyPaillier.decrypt(sumEncrypted);
        const decryptedSumtext = bc.bigintToText(decryptedSum);
        console.log("Suma desencriptada: ", decryptedSum);
        var utf8ToBin = function (s) {
            s = unescape(encodeURIComponent(s));
            var chr, i = 0, l = s.length, out = '';
            for (; i < l; i++) {
                chr = s.charCodeAt(i).toString(2);
                while (chr.length % 8 != 0) {
                    chr = '0' + chr;
                }
                out += chr;
            }
            return out;
        };
        const binary = utf8ToBin(decryptedSumtext);
        console.log("Convertir a binario utf: ", binary);
        const nums = ("0000" + binary).slice(-4);
        //var numero = decryptedSum.toString().split('');
        console.log("Digitos: ", nums);
        var result = await BinarioADecimal(nums);
        console.log("Suma homomorfica: ", result);
        res.status(200).json({
            ok: true,
            msg: result
        });
    }
    catch (err) {
        res.status(400).json({
            ok: false,
            error: err
        });
    }
}
exports.HomorfismpostSum = HomorfismpostSum;
// multiplication by k
/* let c1 = publicKey.encrypt(m1);
let encryptedMul = publicKey.multiply(c1, k);
let mul = privateKey.decrypt(encryptedMul); // k · m1 */
// Función que Recibe del cliente, la multiplicación entre la constante k,
// y el número escogido encriptado. En el servidor obtenemos esta multiplicación encriptada, 
// y desencriptamos para obtener el resultado.
async function HomorfismpostMult(req, res) {
    try {
        console.log('************************************************');
        const msg = bc.hexToBigint(req.body.totalEncrypted);
        console.log("Números encriptados: " + msg);
        const decryptMult = await privKeyPaillier.decrypt(msg);
        console.log('El resultado de la multiplicación k · m1 que se ha realizado encriptada es: ', decryptMult);
        console.log('************************************************');
        res.status(200).json({
            ok: true,
            msg: bc.bigintToHex(decryptMult)
        });
    }
    catch (err) {
        res.status(400).json({
            ok: false,
            error: err
        });
    }
}
exports.HomorfismpostMult = HomorfismpostMult;
/* NO LA QUEREMOS PARA NADA */
// Función que recoge la clave pública del cliente 
async function postPubKeyPaillier(req, res) {
    try {
        let n = req.body.n;
        let g = req.body.g;
        pubKeyClientPaillier = new paillier.PublicKey(bc.hexToBigint(n), bc.hexToBigint(g));
        console.log("pubkey client paillier: ", pubKeyClientPaillier);
        return res.status(200).json({ message: "Clave recibida con éxito en el servidor" });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
}
exports.postPubKeyPaillier = postPubKeyPaillier;
//*******************************SHARED SECRET***********************************************
async function getSecretKeys(req, res) {
    const secret = req.body.secret;
    const sharesH = [];
    const shares = shamirs.split(secret, { shares: req.body.numKeysSecrets, threshold: req.body.numkeysThreshold });
    shares.forEach((share) => {
        sharesH.push(bc.bufToHex(share));
    });
    console.log("Estas son las llaves de secreto compartido", shares);
    console.log("Lista de claves generadas: ", sharesH);
    try {
        res.status(200).send(sharesH);
    }
    catch (err) {
        res.status(500).json({ message: "server error" });
    }
}
exports.getSecretKeys = getSecretKeys;
async function recoverSecret(req, res) {
    const sharedKeys = req.body.keysRecovery;
    console.log(" Claves para recuperación del secreto:", sharedKeys);
    const recovered = shamirs.combine(sharedKeys);
    console.log("Combinación secreto compartido:", bc.bufToText(recovered));
    try {
        res.status(200).send({ "Recuperado": bc.bufToText(recovered) });
    }
    catch (err) {
        res.status(500).json({ message: "server error" });
    }
}
exports.recoverSecret = recoverSecret;
function getPrivKey() {
    return privkey;
}
exports.getPrivKey = getPrivKey;
function getPubKey() {
    return pubkey;
}
exports.getPubKey = getPubKey;
