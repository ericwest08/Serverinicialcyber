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
exports.rsaInit = void 0;
const rsa = __importStar(require("my-rsa"));
const bigint_conversion_1 = __importDefault(require("bigint-conversion"));
let keys;
let pubkey;
let privkey;
async function rsaInit() {
    // GENERA PAR DE LLAVES RSA (public & private)
    console.log("Generando claves . . .");
    rsa.generateKeys(3072);
    pubkey = (await rsa.generateKeys(3072)).publicKey;
    privkey = (await rsa.generateKeys(3072)).privateKey;
    console.log("CLAVE PÚBLICA");
    console.log(pubkey);
    console.log("CLAVE PRIVADA");
    console.log(privkey);
    console.log("Claves generadas con éxito!");
}
exports.rsaInit = rsaInit;
async function getPublicKeyRSA(req, res) {
    try {
        let data = {
            publickey: await bigint_conversion_1.default.bigintToHex(pubkey),
        };
        res.status(200).send(data);
    }
    catch (err) {
        console.log("ERROR AL RECIBIR: " + err);
        res.status(500).json({ message: "Internal server error" });
    }
}
// // Función que recoge la clave pública del cliente para cifrar
// async function postPubKeyRSA(req: Request, res: Response) {
//     try {
//       let e = req.body.e;
//       let n = req.body.n;
//       pubKeyClient = new PublicKey (bc.hexToBigint(e), bc.hexToBigint(n));
//       console.log("pubkey client: ", pubKeyClient);
//       return res.status(200).json({message: "Clave enviada con éxito"})
//     }
//     catch(err) {
//       console.log(err);
//       res.status(500).json({message: "Internal server error"});
//     }
//   }
// // Función que descifra mensaje del cliente
// async function postRSA (req:Request, res:Response){
//   try{
//       let msg = req.body.dataCypher;
//       let mnsjBigInt = await rsa.privateKey.decrypt(bc.hexToBigint(msg));
//       mensaje = bc.bigintToText(mnsjBigInt);
//       return res.status(200).json({"text": "Hola "+mensaje});
//   } catch (error) {
//       console.log("Error: ", error);
//       return res.status(500).json({message: 'Internal Server Error'});
//   }
// }
// // Función que envía mensaje cifrado al cliente
// async function getRSA (req:Request, res:Response){
//   try {
//     if(mensaje == null) mensaje = "Introduce tu nombre";
//     let encrypted = await pubKeyClient.encrypt(textToBigint(mensaje));
//     return res.status(200).json({encrypted: bigintToHex(encrypted)});
//   } catch(error) {
//       console.log("Error: ", error);
//       return res.status(500).json({message: "Internal server error"});
//   }
// }
// // Función que firma el mensaje que le envía el cliente
// async function sign(req: Request, res: Response){
//   try{
//     let msg = req.body.mensaje;
//     console.log("MSG: ", msg);
//     let encrypted = await rsa.privateKey.sign(hexToBigint(msg));
//     return res.status(200).json({dataSigned: bigintToHex(encrypted)});
//   } catch (err) {
//     return res.status(500).json(err);
//   }
// }
