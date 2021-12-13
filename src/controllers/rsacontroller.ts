import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import * as rsa from 'my-rsa'
import bc from 'bigint-conversion'
import { bigintToHex, hexToBigint, textToBigint } from 'bigint-conversion';
import bcu from 'bigint-crypto-utils'
import * as socket from 'socket.io-client';
import {Request, Response } from 'express';


let keypair: rsa.rsaKeyPair;
let pubkey: rsa.RsaPublicKey;
let privkey: rsa.RsaPrivateKey;
let pubKeyClient: rsa.RsaPublicKey;
let mensaje: string;
var keys;

export async function rsaInit(){ //Función que se ejecuta en index.ts
    // GENERA PAR DE LLAVES RSA (public & private)
    console.log("Generando claves . . .")
    keys = rsa.generateKeys(3072);
    console.log("CLAVE PÚBLICA");
    pubkey = (await keys).publicKey;
    console.log(pubkey);
    console.log ("CLAVE PRIVADA");
    privkey = (await keys).privateKey;
    console.log(privkey);
    console.log("Claves generadas con éxito!");
}

async function getPublicKeyRSA(req: Request, res: Response) {  
    try {
        let data = {
          e: await bc.bigintToHex(pubkey.e),
          n: await bc.bigintToHex(privkey.n),
        }
        res.status(200).send(data);
    }
    catch(err) {
        console.log("ERROR AL RECIBIR: " + err);
        res.status(500).json({message: "Internal server error"})   
    }
}

// Función que recoge la clave pública del cliente para cifrar
async function postPubKeyRSA(req: Request, res: Response) {
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
async function postRSA (req:Request, res:Response){
  try{
      let msg = req.body.dataCypher;
      let mnsjBigInt = await privkey.decrypt(bc.hexToBigint(msg));
      mensaje = bc.bigintToText(mnsjBigInt);
      return res.status(200).json({"text": "Hola "+ mensaje});
  } catch (error) {
      console.log("Error: ", error);
      return res.status(500).json({message: 'Internal Server Error'});
  }
}

// Función que envía mensaje cifrado al cliente
async function getRSA (req:Request, res:Response){
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
async function sign(req: Request, res: Response){
  try{
    let msg = req.body.mensaje;
    console.log("MSG: ", msg);
    let encrypted = await privkey.sign(hexToBigint(msg));
    return res.status(200).json({dataSigned: bigintToHex(encrypted)});
  } catch (err) {
    return res.status(500).json(err);
  }
}