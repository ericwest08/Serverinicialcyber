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
exports.sign = exports.getRSA = exports.postRSA = exports.postPubKeyRSA = exports.getPublicKeyRSA = exports.rsaInit = void 0;
const rsa = __importStar(require("my-rsa"));
const bigint_conversion_1 = __importDefault(require("bigint-conversion"));
const bigint_conversion_2 = require("bigint-conversion");
let pubkey;
let privkey;
let pubKeyClient;
let mensaje;
let keys;
let keyPairPaillier;
async function rsaInit() {
    // GENERA PAR DE LLAVES RSA (public & private)
    console.log("Generando claves . . .");
    keys = rsa.generateKeys(3072);
    console.log("CLAVE PÚBLICA");
    pubkey = (await keys).publicKey;
    console.log(pubkey);
    console.log("CLAVE PRIVADA");
    privkey = (await keys).privateKey;
    console.log(privkey);
    console.log("Claves generadas con éxito!");
}
exports.rsaInit = rsaInit;
async function getPublicKeyRSA(req, res) {
    try {
        let data = {
            e: await bigint_conversion_1.default.bigintToHex(pubkey.e),
            n: await bigint_conversion_1.default.bigintToHex(pubkey.n),
        };
        res.status(200).send(data);
    }
    catch (err) {
        console.log("ERROR AL RECIBIR: " + err);
        res.status(500).json({ message: "Internal server error" });
    }
}
exports.getPublicKeyRSA = getPublicKeyRSA;
// Función que recoge la clave pública del cliente para cifrar
async function postPubKeyRSA(req, res) {
    try {
        let e = req.body.e;
        let n = req.body.n;
        pubKeyClient = new rsa.RsaPublicKey(bigint_conversion_1.default.hexToBigint(e), bigint_conversion_1.default.hexToBigint(n));
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
        let msg = req.body.dataCypher;
        let mnsjBigInt = await privkey.decrypt(bigint_conversion_1.default.hexToBigint(msg));
        mensaje = bigint_conversion_1.default.bigintToText(mnsjBigInt);
        return res.status(200).json({ "text": "Hola " + mensaje });
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
        let encrypted = await pubKeyClient.encrypt((0, bigint_conversion_2.textToBigint)(mensaje));
        return res.status(200).json({ encrypted: (0, bigint_conversion_2.bigintToHex)(encrypted) });
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
        let encrypted = await privkey.sign((0, bigint_conversion_2.hexToBigint)(msg));
        return res.status(200).json({ dataSigned: (0, bigint_conversion_2.bigintToHex)(encrypted) });
    }
    catch (err) {
        return res.status(500).json(err);
    }
}
exports.sign = sign;
//Función que envia la clave pública de Paillier al cliente para homorfismo
// export async function getPaillierPubKey(req: Request, res: Response){
//   try {
//     keyPairPaillier = await pailier.generateRandomKeys(512);
//     res.status(200).send({
//       n: bc.bigintToHex(keyPairPaillier["publicKey"]["n"]),
//       g: bc.bigintToHex(keyPairPaillier["publicKey"]["g"])
//     })
//   } catch (err) {
//     res.status(500).send({ message: err })
//   }
// }
