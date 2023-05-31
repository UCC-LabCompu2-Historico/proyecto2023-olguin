import type { NextApiRequest, NextApiResponse } from 'next';
import { UserService } from '@/services';
import { signDocument } from '@/jwt';
import { IUser } from '@/interfaces';
import '@/database/connect';

type Data =
  | { ok: boolean; message: string }
  | {
      ok: boolean;
      message: string;
      user: { name?: string; email: string; avatar?:string, _id:string };
      token: string;
    };

/* 
  Funcion que se encarga de manejar las peticiones a la ruta /api/auth/login
  @param {NextApiRequest} req - Request de la peticion
  @param {NextApiResponse} res - Respuesta de la peticion
  @return {NextApiResponse} - Respuesta de la peticion
*/
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case 'POST':
      return login(req, res);
    default:
      return res.status(405).json({ ok: false, message: 'Method not allowed' });
  }
}
/* 
  Funcion que se encarga de manejar las peticiones POST a la ruta /api/auth/login y devolver la respuesta de la IA
  @param {NextApiRequest} req - Request de la peticion
  @param {NextApiResponse} res - Respuesta de la peticion
  @return {NextApiResponse} - Respuesta de la peticion
*/
const login = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ ok: false, message: 'Missing fields' });

  try {
    const userService = new UserService();
    const user = await userService.login(email, password);

    if (!user)
      return res
        .status(401)
        .json({ ok: false, message: 'Invalid credentials' });

    const { _id, name } = user as IUser;
    const token = signDocument(_id!, email);

    return res.status(200).json({
      ok: true,
      message: 'Login successful',
      user: { name, email, avatar:user.avatar, _id:_id! },
      token
    });
  } catch (err) {
    return res
      .status(500)
      .json({ ok: false, message: `Internal server error: ${err}` });
  }
};
