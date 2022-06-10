import { Response } from 'express';
import hashing from './hashing';

const checkPasswords = async (res: Response, data: any) => {

  if (!(data.oldPassword && data.password1 && data.password2)) throw new Error('Not all passwords are filled.');

  const person = res.locals.jwt;
  if (!person) throw new Error('Can\'t find person.');

  const validPassword = await hashing.verify(data.oldPassword, person.password);
  if (!validPassword) throw new Error('Old password is not valid.');

  if (data.password1 !== data.password2) throw new Error('Passwords don\'t match.');

  return await hashing.hash(data.password1);
};

export default { checkPasswords };
