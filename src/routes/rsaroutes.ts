import { Router } from 'express';
import * as rsaController from '../controllers/rsacontroller';


const router: Router = Router();

// INTERCAMBIO DE CLAVES
router.get('/server/pubkey', rsaController.getPublicKeyRSA);
router.post('/client/pubkey', rsaController.postPubKeyRSA);

// RSA SERVICE
router.get('/msg', rsaController.getRSA);
router.post('/post', rsaController.postRSA);
router.post('/sign', rsaController.sign);

export default router;