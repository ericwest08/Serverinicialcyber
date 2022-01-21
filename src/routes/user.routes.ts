import { Router } from 'express';
//import * as userController from '../controllers/rsacontroller';


const router: Router = Router();

// Rutas de autenticación
router.post('/auth/register', userController.register);
router.post('/auth/login', userController.login);

router.get('/',userController.register);
router.post('/login',userController.login);


export default router;