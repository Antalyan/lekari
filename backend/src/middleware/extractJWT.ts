import config from '../config/config';
import { NextFunction, Request, Response } from 'express';

const jwt = require('jsonwebtoken');

const extractJWT = (req: Request, res: Response, next: NextFunction) => {
  let token = req.headers.authorization?.split(' ')[1];

  if (token) {
    jwt.verify(token, config.server.token.secret, (error: any, decoded: any) => {
      if (error) {
        return res.status(404)
          .json({
            message: error,
            error
          });
      } else {
        res.locals.jwt = decoded;
        next();
      }
    });
  } else {
    return res.status(401)
      .json({
        message: 'Unauthorized'
      });
  }
};

export default extractJWT;
