import { Router } from 'express';
import tiendaCtrl from '../controllers/tienda.controller';


const tiendaRouter: Router = Router();

//we put all routes in this file & we will se in the future

tiendaRouter.get('/productos', tiendaCtrl.getProductosTienda);
tiendaRouter.get('/saldo', tiendaCtrl.getSaldoTienda);

export default tiendaRouter;