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

  return crypt.pbkdf2(password, salt, 100000, 64, 'sha512', (err, derivedKey) => {
    if (err) throw err;
    return `${algorithm}$${iterations}$${salt}$${derivedKey.toString('hex')}`;
  });
};

export default { hash };
