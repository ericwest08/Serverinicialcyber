import { request, Request, Response} from 'express'
import  User from '../models/user';
import  Tienda from '../models/tienda';
import Banco from '../models/banco'


export const getAllRegisteredCoins = async (req:Request, res:Response) => {
    try{
    const coins = await Banco.find({});
    if(coins.length == 0) {
        return res.status(200).json({
        ok: false,
        mensaje: "No hay monedas registradas todavía."
      });
    }

    else { 
        return res.status(200).json({
        ok: true,
        coins: coins
        });
    }

    }catch(err){
        res.status(400).json({
            ok: false,
            error: err
        })
    }
}

export const verifyRegisteredCoins = async (req:Request, res:Response) => {
    try{
    const coins = await Banco.find({});
    if(true) { //averiguar si la firma es correcta, El banco previamente ha firmado con la key privada y aqui tiene que  verificar con su publica.
        return res.status(400).json({
        ok: false,
        mensaje: "La firma no es correcta."
      });
    }

    else if(false) { 
        return res.status(200).json({
        ok: true,
        verification: coins
        });
    }

    }catch(err){
        res.status(400).json({
            ok: false,
            error: err
        })
    }
}