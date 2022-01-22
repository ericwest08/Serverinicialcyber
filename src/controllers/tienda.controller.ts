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

    

    //POST CREATEONE
    insertarProductos = async (req: Request, res: Response) => {
        
        try {
            
          
            const newProducto: IProducto = new Producto({
                nombre: req.body.nombre,
                valor: req.body.valor,
                cantidad: req.body.cantidad
            });
            console.log('Info del newProducto::::::' + newProducto);
            //this takes some time!
            await newProducto.save();
            res.status(200).json(newProducto);
        } catch (err) {
            res.status(500).json({});
        }
    }

    //DELETEONE
    eliminarProducto = async (req: Request, res: Response) => {

        console.log(req.params);

        try {
            const vacio = await Producto.findByIdAndDelete(req.params.id)
            if (vacio === null) {
                res.status(400).json({
                    code: 404,
                    status: 'Producto no existe'
                });
            } else {
                res.status(200).json({
                    status: 'Producto eliminado correctamente'
                });
            }
        } catch (err) {
            res.status(500).json({});
        }
    }
}

export default new tiendaCtrl();