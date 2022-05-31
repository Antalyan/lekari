import config from '../config/config';
import IUser from '../interfaces/person';

const jwt = require('jsonwebtoken');

const signJWT = (user: IUser, callback: (error: any, token: string | null) => void): void => {
  const timeSinceEpoch = new Date().getTime();
  const expirationTime = timeSinceEpoch + Number(config.server.token.expireTime) * 100000;
  const expirationTimeInSeconds = Math.floor(expirationTime / 1000);

  try {
    jwt.sign({
      username: user.email
    }, config.server.token.secret, {
      issuer: config.server.token.issuer,
      algorithm: 'HS256',
      expiresIn: expirationTimeInSeconds
    }, (error: any, token: string) => {
      if (error) {
        callback(error, null);
      } else if (token) {
        callback(null, token);
      }
    });
  } catch (error) {
    callback(error, null);
  }
};

export default signJWT;
