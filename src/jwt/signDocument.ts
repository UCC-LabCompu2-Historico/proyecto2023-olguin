import jwt from 'jsonwebtoken';

/*
  Funcion que se encarga de firmar un documento con JWT
  @param {string} _id - Id del usuario
  @param {string} email - Email del usuario
  @param {string} providerId - Id del proveedor de autenticacion
  @param {string} displayName - Nombre del usuario
  @param {string} photoURL - URL de la foto del usuario
  @returns {string} - Token firmado
  
*/
export const signDocument = (_id: string, email: string, providerId?:string, displayName?:string, photoURL?:string) => {
  if (!process.env.JWT_SECRET) throw new Error('JSON_SECRET not defined');

  return jwt.sign({ _id, email,providerId,displayName, photoURL }, process.env.JWT_SECRET, { expiresIn: '1h' });
};
