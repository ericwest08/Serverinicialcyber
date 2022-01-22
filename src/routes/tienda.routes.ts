import { Router } from 'express';
import tiendaCtrl from '../controllers/tienda.controller';
import { TokenValidation } from './../middlewares/tokenVerify';


const tiendaRouter: Router = Router();

//we put all routes in this file & we will se in the future

tiendaRouter.get('/productos', tiendaCtrl.getProductosTienda);
tiendaRouter.get('/saldo', tiendaCtrl.getSaldoTienda);
tiendaRouter.post('/list', tiendaCtrl.addListProductos);

export default tiendaRouter;