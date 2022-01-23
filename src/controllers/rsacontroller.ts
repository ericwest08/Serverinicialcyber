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

import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import * as rsa from 'my-rsa'
import * as bc from 'bigint-conversion'
import { bigintToHex, hexToBigint, textToBigint} from 'bigint-conversion';
import bcu from 'bigint-crypto-utils'
import * as socket from 'socket.io-client';
import {Request, Response } from 'express';
import * as paillier from 'paillier-bigint';
import * as shamirs from 'shamirs-secret-sharing-ts'

let pubkey: rsa.RsaPublicKey;
let privkey: rsa.RsaPrivateKey;
let pubKeyClient: rsa.RsaPublicKey;
let mensaje: string;
let keys:rsa.rsaKeyPair;
let keyPairPaillier: paillier.KeyPair;
let pubKeyPaillier: paillier.PublicKey;
let privKeyPaillier: paillier.PrivateKey;
let pubKeyClientPaillier: paillier.PublicKey;

export async function rsaInit(){ //Función que se ejecuta en index.ts
  // GENERA PAR DE LLAVES RSA (public & private)
  console.log("Generando claves . . .")
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

//***************************RSA*********************************** */
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

//*************************************PAILLIER**********************************************

export async function getPaillierPubKey(req: Request, res: Response){
  try {
    res.status(200).json({
      ok: true,
      n: bc.bigintToHex(pubKeyPaillier.n),
      g: bc.bigintToHex(pubKeyPaillier.g)
      });
  } catch (err) {
    res.status(400).json({
      ok: false,
      error: err 
    });
  }
 }

// decrypt c (CREAR FUNCIÓN PARA VER QUE SE PUEDE DESENCRIPTAR UN MENSAJE QUE VIENE DEL CLIENTE con la privateKey del SERVER)
/* POST DECRIPTED (pasar por el body el número encriptado con la pública del Server) */
// let d = privateKey.decrypt(c);
export async function paillierDecript(req: Request, res: Response) {
  try {
    const msg = bc.hexToBigint(req.body.encripted); //Revisar como me llega del frontend .encripted
    const decrypt = await privKeyPaillier.decrypt(msg);
    console.log('Desencriptamos el valor de c1: ', decrypt);
    res.status(200).json({
      ok: true,
      msg: bc.bigintToHex(decrypt)
    });
  } catch (err) {
    res.status(400).json({
      ok: false,
      error: err
    });
  }
}

//  ****************CLIENTE*************
// homomorphic addition of two chipertexts (encrypted numbers)
/* Esta parte la hacemos en cliente: */
/* let c1 = publicKey.encrypt(m1);
let c2 = publicKey.encrypt(m2);
let encryptedSum = publicKey.addition(c1, c2); */
// Hacemos post de encryptedSum hacia el servidor
//  ****************************************

 // Recibe la suma de los números del cliente encriptados y los desencripta
export async function HomorfismpostSum(req: Request, res: Response) { // m1 + m2
  try {
    console.log('************************************************');
    const msg1 = bc.hexToBigint(req.body.mensaje1);
    const msg2 = bc.hexToBigint(req.body.mensaje2);
    const sumEncrypted = pubKeyPaillier.addition(msg1, msg2);
    //console.log("Números encriptados: " + bc.bigintToText(msg));
    const decryptedSum = await privKeyPaillier.decrypt(sumEncrypted);
    /* const numeros = ("0000" + decrypt).slice(-5);
    console.log("Números desencriptados: " + numeros);
    var digits = decrypt.toString().split('');
    console.log("digitos: " + digits);
    console.log("Número 1: " + digits[0]);
    console.log("Número 2: " + digits[1]); */
    console.log('El resultado de la suma de c1 y c2 que se ha realizado encriptada es: ', decryptedSum);
    console.log('************************************************');
    console.log(bc.bigintToText(decryptedSum));
    res.status(200).json({
      ok: true,
      msg: bc.bigintToHex(decryptedSum)
    });
  } catch (err) {
    res.status(400).json({
      ok: false,
      error: err
    });
  }
}
 

// multiplication by k
/* let c1 = publicKey.encrypt(m1);
let encryptedMul = publicKey.multiply(c1, k);
let mul = privateKey.decrypt(encryptedMul); // k · m1 */ 

// Función que Recibe del cliente, la multiplicación entre la constante k,
// y el número escogido encriptado. En el servidor obtenemos esta multiplicación encriptada, 
// y desencriptamos para obtener el resultado.
export async function HomorfismpostMult(req: Request, res: Response) { // k · m1
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
  } catch (err) {
    res.status(400).json({
      ok: false,
      error: err
    });
  }
}

/* NO LA QUEREMOS PARA NADA */
// Función que recoge la clave pública del cliente 
export async function postPubKeyPaillier(req: Request, res: Response) {
  try {
    let n = req.body.n;
    let g = req.body.g;
    pubKeyClientPaillier = new paillier.PublicKey(bc.hexToBigint(n), bc.hexToBigint(g));
    console.log("pubkey client paillier: ", pubKeyClientPaillier);
    return res.status(200).json({ message: "Clave recibida con éxito en el servidor" })
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
}


 //*******************************SHARED SECRET***********************************************

 export async function getSecretKeys(req: Request, res: Response) {
  const secret = req.body.secret
  const sharesH: string[] = [];
  const shares = shamirs.split(secret, { shares: req.body.numKeysSecrets, threshold: req.body.numkeysThreshold })  
  shares.forEach((share: Buffer) => {
    sharesH.push(bc.bufToHex(share));
  })
  console.log("Estas son las llaves de secreto compartido",shares)
  console.log("Lista de claves generadas: ", sharesH);
  
  try { 
    res.status(200).send(sharesH);
  } catch (err) {
    res.status(500).json({ message: "server error" });
  } 
}

export async function recoverSecret(req: Request, res: Response) {
  const sharedKeys: string[] = req.body.keysRecovery
  console.log(" Claves para recuperación del secreto:", sharedKeys)
 
  const recovered = shamirs.combine(sharedKeys)
  console.log("Combinación secreto compartido:", bc.bufToText(recovered) )
  
  try { 
    res.status(200).send({"Recuperado":bc.bufToText(recovered)});
  } catch (err) {
    res.status(500).json({ message: "server error" });
  } 
}

export function getPrivKey(){
  return privkey;
}



