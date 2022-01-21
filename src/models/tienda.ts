import { model, Schema, Document } from 'mongoose';
import Producto, { IProducto } from './producto';

export interface ITienda extends Document {
    id?: number;
    productos?: Array<IProducto>;
    saldo?: number;
}

const userSchema = new Schema({
    id: { type: Number, required: false, unique: true },
    productos: [{ type: Schema.Types.ObjectId, ref: Producto, required: false }],
    saldo: { type: Number, required: false }
}, {
    versionKey: false
});

export default model<ITienda>('Tienda', userSchema);