const passport = require('passport');
const passportJwtStrategy = require('../config/strategies').passportJwtStrategy;

passport.use('jwt', passportJwtStrategy);

const authJwt = (req, res, next) => {
  try {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err || !user) {
        console.log(`callback from passport.use jwtstrategy error value: ${err}`);
        console.log(`${user}`);
        return res.status(401).json({
          code: 'BAD_REQUEST_ERROR',
          description: `${info}`
        });
      }
      console.log(user);
      console.log(`returning next`);
      return next();
    })(req, res, next);
  } catch (err) {
    console.log(err);
    return res.send('server error');
  }
};

// const authJwt = passport.authenticate('jwt', { session: false });
module.exports = {
  authJwt: authJwt
};
