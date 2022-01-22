import { request, Request, Response} from 'express'
import  User, {IUser}from '../models/user';
import  Tienda from '../models/tienda';
import Banco from '../models/banco'
import jwt from 'jsonwebtoken';


export const register = async (req: Request,res: Response) => { 
    try{    
    console.log(req.body);
      const {nombre, password, correo} = req.body;
  
      const user: IUser = new User ({
          nombre,
          password,
          correo
      });
  
    user.password = await user.encryptPassword(user.password);
    const savedUser = await user.save();
  
   // generamos token
    const token: string = jwt.sign({_id: savedUser._id}
    ,process.env.TOKEN_SECRET || 'tokenTEST',  { expiresIn: 86400 }) 
    return res.status(200).json({
      ok: true,
      token: token,
      user: savedUser
    });
  
  }catch(err){
    res.status(400).json({
        ok: false,
        error: err
    })
  }
    
  };
  
  export const login = async (req: Request, res: Response) => {
    
    const user = await User.findOne({ email: req.body.email }); // lo busco por email ya que es unico.
  
    if (!user) return res.status(400).json({
      ok: false,
      mensaje: "Error, vuelve a intentarlo."
    });
    const correctPassword: boolean = await user.validatePassword(
      req.body.password
    );
  
    if (!correctPassword) return res.status(404).json({
      ok: false,
      mensaje: "Password incorrecta."
    });
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
     
  
  };