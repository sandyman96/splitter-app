const JwtStrategy = require('passport-jwt').Strategy;
const User = require('../../../models/userModel');

require('custom-env').env('staging');
const secret = process.env.SECRET || 'the default secret';
console.log(secret);

var opts = {
  jwtFromRequest: (req) => req.cookies.jwt,
  secretOrKey: secret,
  passReqToCallback: true
};

const passportJwtStrategy = new JwtStrategy(opts, async (request, jwt_payload, done) => {
  try {
    const userFromDB = await User.findAll({
      where: {
        id: jwt_payload.id,
        UserName: jwt_payload.name,
        UserRole: jwt_payload.role
      },
      raw: true
    }).then( resolved => { return resolved;}).catch( rejected => { throw(rejected);});

    if (userFromDB.length === 0) {
      console.log('nouser');
      return done(null, false, 'no user in database');
    } else {
      console.log(`returning done with no error from passport middleware`);
      return done(null, userFromDB[0], 'user is available');
    }
  } catch (err) {
    return done(null, false, `querry error: ${err}`)
  }
});

module.exports = {
  passportJwtStrategy: passportJwtStrategy
};
