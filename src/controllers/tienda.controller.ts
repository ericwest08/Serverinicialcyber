import Tienda, { ITienda } from '../models/tienda';
import { Request, Response } from 'express';
import Producto, { IProducto } from '../models/producto';

class tiendaCtrl {

    getProductosTienda = async (req: Request, res: Response) => {
        try {
            const tienda = await Tienda.find();
            console.log(tienda);
            res.json(tienda);
        } catch (err) {
            res.status(500).json({});
        }
    }

    getSaldoTienda = async (req: Request, res: Response) => {
        try {
            const tienda = await Tienda.find({}, { saldo: 1 });
            res.json(tienda);
        } catch (err) {
            console.log(err);
            res.status(500).json({});
        }
    }

}

export default new tiendaCtrl();