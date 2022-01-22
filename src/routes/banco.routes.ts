import { getAllRegisteredCoins, verifyRegisteredCoins } from './../controllers/banco.controller';
import { Router } from 'express';
//import * as userController from '../controllers/rsacontroller';


const router: Router = Router();

// Rutas de autenticación
router.post('/verify/coins', verifyRegisteredCoins);
router.get('/coins',getAllRegisteredCoins);



export default router;