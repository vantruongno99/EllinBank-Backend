import jwt from 'jsonwebtoken';
import { User } from '../models/user.modal';

const tokenGenerator = (user: Partial<User>): string =>
  jwt.sign(user, process.env.JWT_SECRET || 'superSecret', { expiresIn: '60d' });

export default tokenGenerator;
