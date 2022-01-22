import { model, Schema, Document } from 'mongoose';
import User, { IUser } from './user';
import Tienda, {ITienda} from './tienda';

export interface IBanco extends Document {
    registeredCoins?: Array<string>;
}

const bancoSchema = new Schema({
    registeredCoins: [{ type: String, required: false }]
}, {
    versionKey: false
});

export default model<IBanco>('Banco', bancoSchema);