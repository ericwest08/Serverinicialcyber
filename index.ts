//Modificar este código para hacer funcionar el módulo
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import * as rsa from 'my-rsa'


//INITIALIZATIONS
const app = express();  //To create an Express application

//CONFIGS
app.set('port', process.env.PORT || 3000);
app.use(express.json());
app.use(express.urlencoded({'extended': false}));
app.use(morgan('dev'));
app.use(cors({origin: 'http://localhost:4200'}));
app.use(bodyParser.json());

//SERVER STARTUP
app.listen(app.get('port'), () => {
    console.log(`Listening at port ${app.get('port')}\n`);
    rsa.generateKeys;//poner generar claves
    console.log("Clave pública: " + rsa.RsaPublicKey);
});

export default app;