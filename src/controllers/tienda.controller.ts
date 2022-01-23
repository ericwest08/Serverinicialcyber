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
            return res.status(200).json({
                ok: true,
                productos: productosTienda
            });
        } catch (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        }
    }

    getSaldoTienda = async (req: Request, res: Response) => {
        try {
            const tienda = await Tienda.find({}, { saldo: 1 });
            const saldo = tienda[0].saldo
            console.log('\n################################################\nLog generado en --> Archivo tienda.controller.ts\n################################################\nSaldo tienda: ', saldo);
            return res.status(200).json({
                ok: true,
                saldo: saldo
            });
        } catch (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        }
    }

    addListProductos = async (req: Request, res: Response) =>{

        try{
        await req.body.forEach(async(producto: { nombre: any; valor: any;}) => {
            const product: IProducto = new Producto ({
                nombre: producto.nombre,
                valor: producto.valor
            });
            await product.save();
            //await Tienda.findOneAndUpdate({},{$push: {productos: product._id}})
        });
        return res.status(200).json("Lista productos añadida.")
        }catch(err){
            res.status(404).json(err)
        }
    
    }
}

export default new tiendaCtrl();