import { model, Schema, Document } from 'mongoose';
import User, { IUser } from './user';
import Tienda, {ITienda} from './tienda';

export interface IBanco extends Document {
    registeredCoins?: Array<string>;
    user?: Array<IUser>;
    tienda?: ITienda;
}

const bancoSchema = new Schema({
    registeredCoins: [{ type: String, required: false }],
    user: [{ type: Schema.Types.ObjectId, ref: User, required: false }],
    tienda: { type: Schema.Types.ObjectId, ref: Tienda, required: false }
}, {
    versionKey: false
});

export default model<IBanco>('Banco', bancoSchema);