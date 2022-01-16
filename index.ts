//Archivo que arranca toda la aplicacion
import app from './app'; 
import * as rsacontroller from './src/controllers/rsacontroller'
import { startConnection } from './database'

async function main() {
    startConnection();
    app.listen(app.get('port'));
    await rsacontroller.rsaInit();
    console.log('Server on port', app.get('port'));
}

main();