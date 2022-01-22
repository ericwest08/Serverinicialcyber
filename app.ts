//Modificar este código para hacer funcionar el módulo
import express, { Router } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import * as rsa from 'my-rsa'
import rsaRoutes from './src/routes/rsaroutes';
import tiendaRoutes from './src/routes/tienda.routes';
import userRoutes from './src/routes/user.routes';
import bancoRoutes from './src/routes/banco.routes';

//INITIALIZATIONS
const app = express();  //To create an Express application

//CONFIGS
app.set('port', process.env.PORT || 3000);
app.use(express.json());
app.use(express.urlencoded({'extended': false}));
app.use(morgan('dev'));
app.use(cors({origin: 'http://localhost:4200'}));
app.use(bodyParser.json());

app.use('/rsa', rsaRoutes);

app.use('/tienda', tiendaRoutes);
app.use('/user', userRoutes);
app.use('/banco', bancoRoutes);

export default app;