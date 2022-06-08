const crypt = require('crypto');

const hash = (password: string) => {
  const options = {
    algorithm: 'pbkdf2_sha512',
    salt: crypt.randomBytes(64)
      .toString('hex'),
    iterations: 100000,
  };
  return encode(password, options);
};

const encode = (password, {
  algorithm,
  salt,
  iterations
}) => {
  let hash: string;
  crypt.pbkdf2(password, salt, 100000, 64, 'sha512', (err, derivedKey) => {
    if (err) throw err;
    hash = `${algorithm}$${iterations}$${salt}$${derivedKey.toString('hex')}`;
  });
  return hash;
};

const decode = (encoded) => {
  const [algorithm, iterations, salt, hash] = encoded.split('$');
  return {
    algorithm,
    hash,
    iterations: parseInt(iterations, 10),
    salt,
  };
};

const verify = (password, encoded) => {
  const decoded = decode(encoded);
  const encodedPassword = encode(password, decoded);
  return encoded === encodedPassword;
};

export default {
  hash,
  verify
};
