import config from '../config/config';
import { NextFunction, Request, Response } from 'express';
import getPerson from '../models/personModel';

const jwt = require('jsonwebtoken');

const validateTokenError = (res: Response, code: number, message: string) => {
  return res.status(code)
    .json({
      message: message,
    });
};

const validateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return validateTokenError(res, 401, 'Unauthorized');

  jwt.verify(token, config.server.token.secret, (err: any, user: any) => {
    if (err) return validateTokenError(res, 403, 'Forbidden');
    const person = getPerson({
      email: user.email,
      id: user.id
    });
    if (!person) return validateTokenError(res, 401, 'Forbidden');
    console.log(person);
    res.locals.jwt = person;
    next();
  });
};

export default validateToken;
