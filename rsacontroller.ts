import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import * as rsa from 'my-rsa'
import bc from 'bigint-conversion'
import bcu from 'bigint-crypto-utils'
import * as socket from 'socket.io-client';
import {Request, Response } from 'express';


let keys:any
let pubkey:any;
let privkey: any;

export async function rsaInit(){ //Función que se ejecuta en index.ts
    // GENERA PAR DE LLAVES RSA (public & private)
    console.log("Generando claves . . .")
    rsa.generateKeys(3072);
    pubkey = (await rsa.generateKeys(3072)).publicKey;
    privkey = (await rsa.generateKeys(3072)).privateKey;
    console.log("CLAVE PÚBLICA");
    console.log(pubkey);
    console.log ("CLAVE PRIVADA");
    console.log(privkey);
    console.log("Claves generadas con éxito!");
}



async function getPublicKeyRSA(req: Request, res: Response) {  
    try {
        let data = {
          publickey: await bc.bigintToHex(pubkey),
        }
        res.status(200).send(data);
    }
    catch(err) {
        console.log("ERROR AL RECIBIR: " + err);
        res.status(500).json({message: "Internal server error"})   
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