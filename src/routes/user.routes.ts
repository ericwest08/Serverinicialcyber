import { TokenValidation } from './../middlewares/tokenVerify';
import { Router } from 'express';
import * as userController from '../controllers/user.controller';



const router: Router = Router();

// Rutas de autenticación
router.post('/auth/register', userController.register);
router.post('/auth/login', userController.login);

//mostrar saldo en euros, retirar dinero en euros (200 ok indicando que puede generar),
router.get('/me',TokenValidation,userController.getMe); 
router.get('/saldo',TokenValidation,userController.getSaldoEuros);
router.post('/retrieve',TokenValidation,userController.retrieveMoney);
router.get('/coins',TokenValidation,userController.getCoins);
router.get('/productos',TokenValidation,userController.getProductos);
router.post('/productos',TokenValidation,userController.insertProducto); //insertar producto en usuario e eliminarlo de la tienda.
router.post('/insertCoins',TokenValidation,userController.insertCoins); 



export default router;