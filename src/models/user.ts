import { model, Schema, Document } from 'mongoose';
import Producto, { IProducto } from './producto';
import bcrypt from 'bcryptjs';

export interface IUser extends Document{
  id?: number; 
  nombre: string;
  password: string;
  correo: string;
  saldo_euros: number;
  coins?: Array<string>;
  productos?: Array<IProducto>;
  encryptPassword(password: string): string | PromiseLike<string>;
  validatePassword(password: string): Promise<boolean>;
  }

const userSchema = new Schema({
  id: { type: Number, required: false, unique: true },
  nombre: { type: String, required: true },
  password: { type: String, required: true },
  correo: { type: String, required: true, lowercase: true, unique: true },
  saldo_euros: { type: Number, required: true, default: 20},
  coins: [{ type: String, required: false }],
  productos: [{ type: Schema.Types.ObjectId, ref: Producto, required: false }]
}, {
  versionKey: false
});

userSchema.methods.encryptPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

userSchema.methods.validatePassword = async function (password: string): Promise<boolean> {
  return await bcrypt.compare(password, (this as any).password);
};

export default model<IUser>('User', userSchema);