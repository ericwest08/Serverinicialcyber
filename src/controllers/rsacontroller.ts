import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import * as rsa from 'my-rsa'
import * as bc from 'bigint-conversion'
import { bigintToHex, hexToBigint, textToBigint } from 'bigint-conversion';
import bcu from 'bigint-crypto-utils'
import * as socket from 'socket.io-client';
import {Request, Response } from 'express';
import * as pailier from 'paillier-bigint'


let pubkey: rsa.RsaPublicKey;
let privkey: rsa.RsaPrivateKey;
let pubKeyClient: rsa.RsaPublicKey;
let mensaje: string;
let keys:rsa.rsaKeyPair;
let keyPairPaillier;


export async function rsaInit(){ //Función que se ejecuta en index.ts
    // GENERA PAR DE LLAVES RSA (public & private)
    console.log("Generando claves . . .")
    keys = await rsa.generateKeys(3072);
    console.log("CLAVE PÚBLICA");
    pubkey = keys.publicKey;
    console.log(pubkey);
    console.log ("CLAVE PRIVADA");
    privkey = keys.privateKey;
    console.log(privkey);
    console.log("Claves generadas con éxito!");
    
}

export async function getPublicKeyRSA(req: Request, res: Response) {  
    try {
        let data = {
          e:  bc.bigintToHex(keys.publicKey.e),
          n:  bc.bigintToHex(keys.publicKey.n),
        };
       res.status(200).send(data);
    }
    catch(err) {
        console.log("ERROR AL RECIBIR: " + err);
        res.status(500).json({message: "Internal server error"})   
    }
}

// Función que recoge la clave pública del cliente
export async function postPubKeyRSA(req: Request, res: Response) {
    try {
      let e = req.body.e;
      let n = req.body.n;
      pubKeyClient = new rsa.RsaPublicKey(bc.hexToBigint(e), bc.hexToBigint(n));
      console.log("pubkey client: ", pubKeyClient);
      return res.status(200).json({message: "Clave enviada con éxito"})
    }
    catch(err) {
      console.log(err);
      res.status(500).json({message: "Internal server error"});
    }
  }

// Función que descifra mensaje del cliente
export async function postRSA (req:Request, res:Response){
  try{
      let msg = req.body.message;
      console.log("MENSAJE RECIBIDO CIFRADO: " + msg)
      let mnsjBigInt = privkey.decrypt(bc.hexToBigint(msg));
      mensaje = bc.bigintToText(mnsjBigInt);
      console.log("MENSAJE DESCIFRADO: " + mensaje)
      let encrypted = privkey.sign(hexToBigint("Mensaje recibido, comprobación de firma"));
      console.log("FIRMA: "+ encrypted)
      return res.status(200).json({
        response: "Mensaje recibido, comprobación de firma",
        signedData: bigintToHex(encrypted)
      });
  } catch (error) {
      console.log("Error: ", error);
      return res.status(500).json({message: 'Internal Server Error'});
  }
}

// Función que envía mensaje cifrado al cliente
export async function getRSA (req:Request, res:Response){
  try {
    if(mensaje == null) mensaje = "Introduce tu nombre";
    let encrypted = await pubKeyClient.encrypt(textToBigint(mensaje));
    return res.status(200).json({encrypted: bigintToHex(encrypted)});
  } catch(error) {
      console.log("Error: ", error);
      return res.status(500).json({message: "Internal server error"});
  }
}

// Función que firma el mensaje que le envía el cliente
export async function sign(req: Request, res: Response){
  try{
    let msg = req.body.mensaje;
    console.log("MSG: ", msg);
    let encrypted = await privkey.sign(hexToBigint(msg));
    return res.status(200).json({dataSigned: bigintToHex(encrypted)});
  } catch (err) {
    return res.status(500).json(err);
  }
}

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


