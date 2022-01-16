import { model, Schema, Document } from 'mongoose';

export interface IUser extends Document{
    nombre: string;
    password: string;
    
  }

  //En proceso... (hablarlo en la reunion)
  /*

  modelos necesarios:

  - User (obligatorio)
  -Tienda (?, supongo que si. Los items los podemos hardcodear o definirlos en la bbdd y que deevuelva la lista)
  -Banco (para tener un registro de las coins gastadas)
  */