import mongoose from 'mongoose';
import { Config } from './';


/*
  Funcion que se encarga de conectar a la base de datos de MongoDB haciendo uso de mongoose
  @returns {Promise<void>} - Promesa que se resuelve cuando se conecta a la base de datos o cuando ocurre un error
*/
export const connect = async () => {
  try {
    await mongoose.connect(Config.MongoURL,Config.Options);
    if (mongoose.connection.readyState === 1) {
      console.log('Connected to database');
    }
  } catch (error) {
    console.log(error);
    await mongoose.connection.close();
  }
};

connect();



