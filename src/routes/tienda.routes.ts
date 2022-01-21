import { Router } from 'express';
import tienda from 'models/tienda';
import tiendaController from '../controllers/tienda.controller';


const tiendaRouter: Router = Router();

//we put all routes in this file & we will se in the future
tiendaRouter.get('/:id/delivery/lot', tiendaCtrl.getAllDelivery);
tiendaRouter.get('/', tiendaCtrl.getAllDeliveries);
tiendaRouter.post('/', tiendaCtrl.createDelivery);
tiendaRouter.delete('/:id', tiendaCtrl.deleteDelivery);
tiendaRouter.put('/:id', tiendaCtrl.updateDelivery);
tiendaRouter.get('/:id', tiendaCtrl.getDelivery);

tiendaRouter.get('/:id/deliveries', tiendaCtrl.getDeliveries);
tiendaRouter.get('/:id/readydeliveries', tiendaCtrl.getReadyDeliveries);
tiendaRouter.put('/readydelivery/:id', tiendaCtrl.setReadyDelivery);

tiendaRouter.get('/deliverer/notAssigned', tiendaCtrl.getNotAssigned);

tiendaRouter.get('/:id/isAssigned', tiendaCtrl.getAssigned);
tiendaRouter.put('/assigned/:id', tiendaCtrl.setAssigned);
tiendaRouter.get('/getDeliveriesByChart/:id', tiendaCtrl.getDeliveriesByChart);
tiendaRouter.put('/picked/:id', tiendaCtrl.setIsPicked);
tiendaRouter.put('/delivered/:id', tiendaCtrl.setIsDelivered);
tiendaRouter.put('/time/:id', tiendaCtrl.setTime);
tiendaRouter.put('/casa/:id', tiendaCtrl.setCasa);

export default tiendaRouter;