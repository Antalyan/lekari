const dotenv = require('dotenv');

dotenv.config();

const SERVER_TOKEN_EXPIRATION = process.env.SERVER_TOKEN_EXPIRETIME || '10m';
const SERVER_TOKEN_ISSUER = process.env.SERVER_TOKEN_ISSUER || 'coolIssuer';
const SERVER_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'superencryptedsecret';

const SERVER = {
  token: {
    expiration: SERVER_TOKEN_EXPIRATION,
    issuer: SERVER_TOKEN_ISSUER,
    secret: SERVER_TOKEN_SECRET
  }
};

const config = {
  server: SERVER
};

export default config;
