import { model, Schema, Document } from 'mongoose';

export interface IProducto extends Document {
    id?: number;
    nombre: string;
    valor: number;
    cantidad: number;
}

const productoSchema = new Schema({
    id: { type: Number, required: false, unique: true },
    nombre: { type: String, required: true },
    valor: { type: Number, required: true },
    cantidad: { type: Number, required: true },
}, {
    versionKey: false
});

export default model<IProducto>('Producto', productoSchema);