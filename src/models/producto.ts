import { model, Schema, Document } from 'mongoose';

export interface IProducto extends Document {
    nombre: string;
    valor: number;
}

const productoSchema = new Schema({
    nombre: { type: String, required: true },
    valor: { type: Number, required: true }
}, {
    versionKey: false,
    autoIndex: false
});

export default model<IProducto>('Producto', productoSchema);