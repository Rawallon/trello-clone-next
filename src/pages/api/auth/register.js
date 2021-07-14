import { hash } from 'bcrypt';
import { connect } from '../../../utils/database';

const SALTROUNDS = 10;

export default async function handler(req, res) {
  const { db } = await connect();
  const requestType = req.method;
  switch (requestType) {
    case 'POST': {
      const { email, password, fullName } = req.body;

      const user = await db
        .collection('users')
        .find({ email: email })
        .toArray();
      if (user.length > 0) {
        const data = {
          message: 'Email already in use',
          status: 400,
        };
        res.send(data);
        return;
      }

      let userCollection = {};
      hash(password, SALTROUNDS, async (err, hash) => {
        userCollection = await db
          .collection('users')
          .insertOne({ email, password: hash, fullName });
      });
      if (userCollection) {
        const data = {
          message: 'success',
        };
        res.status(200).send(data);
        return;
      }
      res.status(200).send({ message: 'failed' });

      return;
    }

    default:
      res.status(400).send('Bad request');
      return;
  }
}
