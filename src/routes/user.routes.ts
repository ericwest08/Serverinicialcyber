import { Router } from 'express';
import * as userController from '../controllers/user.controller';


const router: Router = Router();

// Rutas de autenticación
router.post('/auth/register', userController.register);
router.post('/auth/login', userController.login);

/* //mostrar saldo en euros, retirar dinero en euros (200 ok indicando que puede generar), 
router.get('/saldo',userController.getSaldoEuros);
router.post('/retrieve',userController.retrieveMoney);
router.get('/coins',userController.getCoins);
router.get('/productos',userController.getProductos);
router.post('/productos',userController.insertProducto); //insertar producto e eliminar  */



export default router;