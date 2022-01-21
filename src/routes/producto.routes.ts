import { Router } from 'express';
import productoCtrl from '../controllers/producto.controller';

const productoRouter: Router = Router();

//we put all routes in this file & we will se in the future
productoRouter.get('/', productoCtrl.getAllLotsSorted);
productoRouter.get('/All', productoCtrl.getAllLots);
productoRouter.post('/', productoCtrl.createLot);
productoRouter.delete('/:id', productoCtrl.deleteLot);
productoRouter.put('/:id', productoCtrl.updateLot);
productoRouter.get('/:id', productoCtrl.getLot);
productoRouter.get('/get/:name', productoCtrl.getLotsWithSameName);
productoRouter.get('/getLotsByChart/:id', productoCtrl.getLotsByChart);
productoRouter.get('/gets/getNumAll', productoCtrl.getNumAll);
productoRouter.get('/getSortLotsByAscPrice/:id', productoCtrl.getSortLotsByAscPrice);
productoRouter.get('/getSortLotsByAscQty/:id', productoCtrl.getSortLotsByAscQty);
productoRouter.get('/getByUser/:id', productoCtrl.getLotsByUserId);
productoRouter.get('/getByBusiness/:id', productoCtrl.getLotsByBusinessId);
productoRouter.get('/getByBusinessStoredWithUserID/:id', productoCtrl.getLotsByBusinessIdStored);
productoRouter.get('/getByBusinessStoredTrueWithUserID/:id', productoCtrl.getLotsByBusinessIdStoredTrue);
productoRouter.get('/getByUserStoredTrueWithUserID/:id', productoCtrl.getLotsByUserIdStoredTrue);

export default productoRouter;