import type { NextApiRequest, NextApiResponse } from 'next';
import { signDocument } from '@/jwt';
import { UserService } from '@/services';
import '@/database/connect';

type Data =
  | { ok: boolean; message: string }
  | {
      ok: boolean;
      message: string;
      user: { name: string; email: string, avatar?:string, _id:string };
      token: string;
    };

export default function handler(req: NextApiRequest,res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'POST':
      return register(req, res);
    default:
      return res.status(405).json({ ok: false, message: 'Method not allowed' });
  }
}

const register = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { name, email, password } = req.body;

  try {
    const userService = new UserService();
    const user = await userService.register(name, email, password);

    if (!user)
      return res.status(400).json({ ok: false, message: 'User not created' });

    const { _id } = user;
    const token = signDocument(_id!, email);

    return res
      .status(200)
      .json({
        ok: true,
        message: 'User created',
        user: { email, name, avatar:user.avatar, _id:_id! },
        token
      });
  } catch (err) {
    return res
      .status(500)
      .json({ ok: false, message: `Internal server error: ${err}` });
  }
};
