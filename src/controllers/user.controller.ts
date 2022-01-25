import { request, Request, Response} from 'express'
import  User, {IUser}from '../models/user';
import  Tienda from '../models/tienda';
import Banco from '../models/banco'
import jwt from 'jsonwebtoken';
import * as rsa from './rsacontroller';
import { bigintToHex, bigintToText, hexToBigint, textToBigint} from 'bigint-conversion';


export const register = async (req: Request,res: Response) => { 
    try{    
      const {nombre, password, correo} = req.body;
  
      const user: IUser = new User ({
          nombre,
          password,
          correo
      });
  
    const savedUser = await user.save();
  
    console.log(savedUser);
   // generamos token
    const token: string = jwt.sign({_id: savedUser._id}
    ,process.env.TOKEN_SECRET || 'tokenTEST',  { expiresIn: 86400 }) 
    return res.status(200).json({
      ok: true,
      token: token,
      user: savedUser
    });
  
  }catch(err){
    console.log(req.body)
    res.status(400).json({
        ok: false,
        error: err
    })
  }
    
  };
  
  export const login = async (req: Request, res: Response) => {
    console.log(req.body)
    const correoBigInt = rsa.getPrivKey().decrypt(hexToBigint(req.body.correo));
    const correoDecryptedText = bigintToText(correoBigInt);
    const user = await User.findOne({correo: correoDecryptedText}); // lo busco por correo ya que es unico.
  console.log(user);
    if (!user) return res.status(400).json({
      ok: false,
      mensaje: "Error, vuelve a intentarlo."
    });
    const passwordBigInt = rsa.getPrivKey().decrypt(hexToBigint(req.body.password));
    const passwordDecryptedText = bigintToText(passwordBigInt);
    if(user.password == passwordDecryptedText){
    //genero token
    const token: string = jwt.sign(
      { _id: user._id},
      process.env.TOKEN_SECRET || "tokenTEST",
      { expiresIn: 86400 }
    ); // expira en un dia.
    
    return res.status(200).json({
      ok: true,
      token: token,
      user: user
    });
  }

  else{
    return res.status(400).json({
      ok: false,
      mensaje: "La contraseña no coincide"
    });
  }
  
  };


  export const getSaldoEuros = async (req:Request, res:Response) => {
    try{
    const user = await User.findById(req.userId);
    if(!user) {
        return res.status(400).json({
        ok: false,
        mensaje: "Error, vuelve a intentarlo."
      });
    }

    else { 
      
        return res.status(200).json({
        ok: true,
        saldo: user.saldo_euros
        });
    }

    }catch(err){
        res.status(400).json({
            ok: false,
            error: err
        })
    }
}

export const retrieveMoney = async (req:Request, res:Response) => {
  try{
    const {retirar, coinsCegados} = req.body;
    const user = await User.findById(req.userId);
  if(!user) {
      return res.status(400).json({
      ok: false,
      error: "Intentelo de nuevo"
    });
  }

  /*if((user.saldo_euros - retirar) < 0){
    return res.status(400).json({
      ok: false,
      mensaje: "No tiene fondos suficientes para retirar"
    });
              LO HARE EN CLIENTE LA COMPROBACIÓN.
  }*/
  else { 
    const userModified = await User.findByIdAndUpdate(req.userId,{ $inc: { saldo_euros: - retirar}});
    
    const coinsCegadosFirmados = coinsCegados.map((blindCoin:string) => {
      return bigintToHex(rsa.getPrivKey().sign(hexToBigint(blindCoin)));
    });

    return res.status(200).json({
      ok: true,
      saldo: userModified?.saldo_euros,
      dataBlindSigned: coinsCegadosFirmados,
      });
  }

  }catch(err){
      res.status(400).json({
          ok: false,
          error: err
      })
  }
}

export const getCoins = async (req:Request, res:Response) => {
  try{
    const user = await User.findById(req.userId);
    if(user?.coins?.length == 0) {
        return res.status(200).json({
        ok: false,
        mensaje: "El usuario no tiene monedas."
      });
    }

  else { 
      return res.status(200).json({
      ok: true,
      coins: user?.coins
      });
  }

  }catch(err){
      res.status(400).json({
          ok: false,
          error: err
      })
  }
}

export const getProductos = async (req:Request, res:Response) => {
  try{
  const user = await User.findById(req.userId);
  if(!user) {
      return res.status(404).json({
      ok: false,
      mensaje: "User no encontrado."
    });
  }

  else { 
      return res.status(200).json({
      ok: true,
      productos: user.productos
      });
  }

  }catch(err){
      res.status(400).json({
          ok: false,
          error: err
      })
  }
}

export const insertProducto = async (req:Request, res:Response) => {
  try{
    const {idProducto, coins} = req.body;
    await Tienda.findOneAndUpdate({},{$pull: {productos: idProducto }});
    const updatedUser = await User.findByIdAndUpdate(req.userId, {$push: {productos: idProducto }}, {new: true})
    for(let i=0; i< coins.length; i++){
      await User.findByIdAndUpdate(req.userId, {$pull: {coins: coins[i] }})
    }
  if(!updatedUser) {
      return res.status(404).json({
      ok: false,
      mensaje: "Usuario no encontrado."
    });
  }

  else { 
      return res.status(200).json({
      ok: true,
      msg: "producto comprado."
      });
  }

  }catch(err){
      res.status(400).json({
          ok: false,
          error: err
      })
  }
}

export const getMe = async (req:Request, res:Response) => {
  try{
  const user = await User.findById(req.userId);
  if(!user) {
      return res.status(400).json({
      ok: false,
      mensaje: "Error, user no eencontrado."
    });
  }

  else { 
      return res.status(200).json({
      ok: true,
      user: user
      });
  }

  }catch(err){
      res.status(400).json({
          ok: false,
          error: err
      })
  }
}

export const insertCoins = async (req:Request, res:Response) => {
  try{
    const {coins} = req.body;

    for(let i=0; i<coins.length;i++){
    await User.findByIdAndUpdate(req.userId, {$push: {coins: coins[i] }})
    }
    return res.status(200).json({
      ok: true,
      msg: "insertados correctamente."
      });
  

  }catch(err){
      res.status(400).json({
          ok: false,
          error: err
      })
  }
}