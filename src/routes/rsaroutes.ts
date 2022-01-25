import { TokenValidation } from './../middlewares/tokenVerify';
import { Router } from 'express';
import * as rsaController from '../controllers/rsacontroller';


const router: Router = Router();

// INTERCAMBIO DE CLAVES
router.get('/server/pubkey', rsaController.getPublicKeyRSA);
router.post('/client/pubkey', rsaController.postPubKeyRSA);

// RSA SERVICE
router.get('/msg', rsaController.getRSA);
router.post('/post', TokenValidation,rsaController.postRSA);
router.post('/sign', rsaController.sign);

//PAILLIER
router.get('/paillier', rsaController.getPaillierPubKey);
router.post('/paillier/homorfismSum', TokenValidation,rsaController.HomorfismpostSum);
router.post('/paillier/homorfismMult', TokenValidation,rsaController.HomorfismpostMult);
router.post('/paillier/decrypt', rsaController.paillierDecript);

//SHARED SECRET
router.post('/sharedsecret', rsaController.getSecretKeys);
router.post('/sharedsecret/recover', TokenValidation,rsaController.recoverSecret);

export default router;