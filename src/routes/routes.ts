import { Router } from 'express';
import rsaRoutes from './rsaroutes';

const router: Router = Router();

router.use('/rsa', rsaRoutes);

export default router;