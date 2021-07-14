import { serialize } from 'cookie';

export default function handler(req, res) {
  res.setHeader(
    'Set-Cookie',
    serialize('token', req.body.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      expires: new Date(0),
      sameSite: 'strict',
      path: '/',
    }),
  );

  res.send({ message: 'success' });
}
