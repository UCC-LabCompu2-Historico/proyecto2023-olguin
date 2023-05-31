import jwt from 'jsonwebtoken';
import { UserId } from '@/interfaces'

/*
  Funcion que se encarga de verificar un token con JWT y devolver el id del usuario
  @param {string} token - Token a verificar
  @returns {Promise<string>} - Promesa que se resuelve cuando se verifica el token o cuando ocurre un error
*/
export const verifyToken = (token: string):Promise<UserId> => {
  if (!process.env.JWT_SECRET) throw new Error('JSON_SECRET not defined');
  if (token.length < 6) throw new Error('Invalid token');

  return new Promise((resolve, reject) => {
    try {
      jwt.verify(token, process.env.JWT_SECRET || '', (err, decoded) => {
        if (err) reject(err);
        resolve(decoded as UserId);
      });
    } catch (err) {
      reject(err);
    }
  });
};
