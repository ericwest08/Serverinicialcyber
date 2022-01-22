import { model, Schema, Document } from 'mongoose';
import Producto, { IProducto } from './producto';

export interface ITienda extends Document {
    productos?: Array<IProducto>;
    saldo: number;
}

const tiendaSchema = new Schema({
    productos: [{ type: Schema.Types.ObjectId, ref: Producto, required: false }],
    saldo: { type: Number, required: true, default: 0 }
}, {
    versionKey: false
});

export default model<ITienda>('Tienda', tiendaSchema);