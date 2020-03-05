const bcrypt_const = require('bcrypt');
module.exports = bcrypt_const;

/****
To check a password:

// Load hash from your password DB.
bcrypt.compareSync(myPlaintextPassword, hash); // true
bcrypt.compareSync(someOtherPlaintextPassword, hash); // false


To hash a password:

Technique 1 (generate a salt and hash on separate function calls):

const salt = bcrypt.genSaltSync(saltRounds);
const hash = bcrypt.hashSync(myPlaintextPassword, salt);
// Store hash in your password DB.

Technique 2 (auto-gen a salt and hash):

const hash = bcrypt.hashSync(myPlaintextPassword, saltRounds);
// Store hash in your password DB.
***/