import Banco, { IBanco }from '../models/banco';
import { hexToBigint, bigintToHex } from 'bigint-conversion';
import { request, Request, Response} from 'express'
import  User from '../models/user';
import  Tienda from '../models/tienda';
import {getPubKey} from '../controllers/rsacontroller'


export const getAllRegisteredCoins = async (req:Request, res:Response) => {
    try{
    const banco = await Banco.findOne();
    if(!banco) {
        return res.status(400).json({
        ok: false,
        mensaje: "Error, no se encuentra el banco."
      });
    }

    else { 
        return res.status(200).json({
        ok: true,
        coins: banco.registeredCoins
        });
    }

    }catch(err){
        res.status(400).json({
            ok: false,
            error: err
        })
    }
}
//averiguar si la firma es correcta, El banco previamente ha firmado con la key privada y aqui tiene que  verificar con su publica.
export const verifyRegisteredCoins = async (req:Request, res:Response) => {
    try{
    const {coinsFirmadas} = req.body;
    const banco = await Banco.findOne();
    if(!banco) { 
        return res.status(400).json({
        ok: false,
        mensaje: "Error busqueda banco."
      });
    }
    else{
        const coinsFirmaVerified = coinsFirmadas.map((SignedCoin:string) => {
            return bigintToHex(getPubKey().verify(hexToBigint(SignedCoin)));  
          });
        console.log(coinsFirmaVerified);
        const registeredCoins = banco.registeredCoins?.map((Coins:string) => {
            for(let i=0; i<coinsFirmaVerified.length;i++){
                if(Coins==coinsFirmaVerified[i]) return 1;
            }
        });
        if(registeredCoins ==null){
            return res.status(400).json({
                ok: false,
                mensaje: "Error."
              });
        }
        let j= 0;
        let registered = false
        while(j< registeredCoins.length && registered==false) {if(registeredCoins[j]==1) {registered= true;}}
        if(registered == false){
        for(let i=0; i<coinsFirmaVerified.length;i++) {
            await Banco.findByIdAndUpdate("61ef81cd4a73cc05a9d2c326",{$push: {registeredCoins: coinsFirmaVerified[i]}})
        }  
        
        return res.status(200).json({
        ok: true,
        msg: "Firma verificada, coins no gastadas... Se procede a registrar estas coins." 
        });
    }
    else{ return res.status(400).json({
        ok: false,
        mensaje: "Error. Monedas ya registradas."
      });
    }
}

    }catch(err){
        res.status(400).json({
            ok: false,
            error: err
        })
    }
}
