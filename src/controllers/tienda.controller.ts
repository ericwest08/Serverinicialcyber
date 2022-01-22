import Tienda, { ITienda } from '../models/tienda';
import { Request, Response } from 'express';
import Producto, { IProducto } from '../models/producto';

class tiendaCtrl {

    getProductosTienda = async (req: Request, res: Response) => {
        try {
            const tienda = await Tienda.find({}, { productos: 1 })
                .populate('productos');
            const productosTienda = tienda[0].productos
            console.log('\n################################################\nLog generado en --> Archivo tienda.controller.ts\n################################################\nProductos tienda: ', productosTienda);
            res.json(productosTienda);
        } catch (err) {
            res.status(500).json({});
        }
    }

    getSaldoTienda = async (req: Request, res: Response) => {
        try {
            const tienda = await Tienda.find({}, { saldo: 1 });
            const saldo = tienda[0].saldo
            console.log('\n################################################\nLog generado en --> Archivo tienda.controller.ts\n################################################\nSaldo tienda: ', saldo);
            res.json(saldo);
        } catch (err) {
            console.log(err);
            res.status(500).json({});
        }
    }

}

export default new tiendaCtrl();