import { model, Schema, Document } from 'mongoose';
import Producto, { IProducto } from './producto';
import bcrypt from 'bcryptjs';

export interface IUser extends Document{
  nombre: string;
  password: string;
  correo: string;
  saldo_euros: number;
  coins?: Array<string>;
  productos?: Array<IProducto>;
  }

const userSchema = new Schema({
  nombre: { type: String, required: true },
  password: { type: String, required: true },
  correo: { type: String, required: true, lowercase: true, unique: true },
  saldo_euros: { type: Number, required: false, default: 20},
  coins: [{ type: String, required: false }],
  productos: [{ type: Schema.Types.ObjectId, ref: Producto, required: false }]
}, {
  versionKey: false
});


export default model<IUser>('User', userSchema);