import { signDocument } from '@/jwt';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data =
  | { ok: boolean; message?: string }
  | {
      ok: boolean;
      user: { name: string; email: string; avatar: string; id: string };
      token: string;
    };

/* 
  Funcion que se encarga de manejar las peticiones a la ruta /api/auth/google
  @param {NextApiRequest} req - Request de la peticion
  @param {NextApiResponse} res - Respuesta de la peticion
  @return {NextApiResponse} - Respuesta de la peticion
*/
export default function (req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'POST':
      return loginWithGoogle(req, res);
    default:
      return res.status(405).json({ ok: false, message: 'Method not allowed' });
  }
}

/* 
  Funcion que se encarga de manejar las peticiones POST a la ruta /api/auth/google y devolver la respuesta de la IA
  @param {NextApiRequest} req - Request de la peticion
  @param {NextApiResponse} res - Respuesta de la peticion
  @return {NextApiResponse} - Respuesta de la peticion
*/
const loginWithGoogle = async (req: NextApiRequest,res: NextApiResponse<Data>) => {
  const { displayName, email, uid, providerId, photoURL } = req.body;
  if (!displayName || !email || !uid || !providerId || !photoURL) {
    return res
      .status(400)
      .json({ ok: false, message: 'Missing required fields' });
  }

  const token = signDocument(uid, email, providerId, displayName, photoURL);
  return res.status(200).json({
    ok: true,
    user: {
      name: displayName,
      email,
      avatar: photoURL,
      id: uid
    },
    token
  });
};
