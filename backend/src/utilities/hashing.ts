const crypt = require('crypto');

const hash = (password: string) => {
  const options = {
    algorithm: 'pbkdf2_sha512',
    salt: crypt.randomBytes(64)
      .toString('hex'),
    iterations: 100000,
  };
  return encode(password, options)
    .then((result: any) => result, (err: Error) => {
      throw err;
    });
};

const encode = (password: string, {
  algorithm,
  salt,
  iterations
}: any) => {
  return new Promise((resolve, reject) => crypt.pbkdf2(password, salt, 100000, 64, 'sha512', (err: Error | null, derivedKey: Buffer) => (err ? reject(err) : resolve(`${algorithm}$${iterations}$${salt}$${derivedKey.toString('hex')}`))));
};

const decode = (encoded: string) => {
  const [algorithm, iterations, salt, hash] = encoded.split('$');
  return {
    algorithm,
    hash,
    iterations: parseInt(iterations, 10),
    salt,
  };
};

const verify = async (password: string, encoded: string) => {
  const decoded = decode(encoded);
  const encodedPassword = await encode(password, decoded);
  return encoded === encodedPassword;
};

export default {
  hash,
  verify
};
