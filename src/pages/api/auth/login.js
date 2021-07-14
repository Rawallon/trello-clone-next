import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { connect } from '../../../utils/database';
import { serialize } from 'cookie';

const JWTKEY = process.env.JWT_SECRET_KEY;

export default async function handler(req, res) {
  const requestType = req.method;
  switch (requestType) {
    case 'POST': {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).send({ error: 'email or password is missing' });
        return;
      }

      const { db } = await connect();
      const user = await db.collection('users').findOne({ email: email });

      if (user) {
        compare(password, user.password, function (err, isMatched) {
          if (isMatched === true) {
            const claim = { id: user._id, email: user.email };
            const token = sign({ user: claim }, JWTKEY, { expiresIn: '1h' });
            res.setHeader(
              'Set-Cookie',
              serialize('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                maxAge: 60 * 60 * 24 * 1000,
                sameSite: 'strict',
                path: '/',
              }),
            );

            res.send({
              message: 'success',
              token,
              id: user._id,
              status: 200,
            });
          } else {
            res.status(403).send({ error: 'Invalid username or password' });
          }
        });
      } else {
        res.status(403).send({ error: 'Invalid username or password' });
      }
      return;
    }

    default:
      res.status(400).send('Bad request');
      return;
  }
}
