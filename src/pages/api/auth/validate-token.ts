import type { NextApiRequest, NextApiResponse } from 'next';
import { UserService } from '@/services';
import { verifyToken, signDocument } from '@/jwt';
import { UserId } from '@/interfaces';
import '@/database/connect';


type Data =
  | { message: string }
  | { ok: boolean; token: string; user: { name?: string; email: string, avatar?:string,_id:string } };


/*
  Funcion que se encarga de manejar las peticiones a la ruta /api/auth/validate-token
  @param {NextApiRequest} req - Request de la peticion
  @param {NextApiResponse} res - Respuesta de la peticion
  @return {NextApiResponse} - Respuesta de la peticion
*/
export default function (req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      return validateToken(req, res);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

/*
  Funcion que se encarga de manejar las peticiones GET a la ruta /api/auth/validate-token y devolver la respuesta de la IA
  @param {NextApiRequest} req - Request de la peticion
  @param {NextApiResponse} res - Respuesta de la peticion
  @return {NextApiResponse} - Respuesta de la peticion
*/
const validateToken = async (req: NextApiRequest,res: NextApiResponse<Data>) => {
  const { token = '' } = req.cookies;
  let userId:UserId;

  try {
    const userService = new UserService();
    userId = await verifyToken(token); 

    if(userId.providerId === 'firebase'){
      const newToken = signDocument(userId._id, userId.email,userId.providerId,userId.displayName,userId.photoURL);
      return res
        .status(200)
        .json({
          ok: true,
          token: newToken,
          user: { name: userId.displayName, email: userId.email, avatar:userId.photoURL, _id:userId._id! }
        }); 
    }
  
    const user = await userService.getUserById(userId._id);
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    const newToken = signDocument(user._id, user.email);
    return res
      .status(200)
      .json({
        ok: true,
        token: newToken,
        user: { name: user.name, email: user.email, avatar:user.avatar, _id:user._id! }
      });
  } catch (err) {
    return res.status(500).json({ message: `Internal server error: ${err}` });
  }
};
