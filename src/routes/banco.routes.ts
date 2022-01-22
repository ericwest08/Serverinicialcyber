import { getAllRegisteredCoins, verifyRegisteredCoins } from './../controllers/banco.controller';
import { Router } from 'express';
//import * as userController from '../controllers/rsacontroller';
import { TokenValidation } from './../middlewares/tokenVerify';


const router: Router = Router();

// Rutas de autenticación
router.post('/verify/coins',TokenValidation,verifyRegisteredCoins);
router.get('/coins',TokenValidation,getAllRegisteredCoins);



export default router;