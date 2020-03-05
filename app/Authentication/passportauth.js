// const passport = require('passport');
const userService = require('../services/users/userService')
const controller = require('../controllers/controller');
// const LocalStrategy = require('passport-local');
// passport.use('/api/v1/users/signup', new localStrategy({
//     usernameField: 'email',
//     passwordField: 'password'
// }, async (email, password, done) => {
//     try {
//         //Save the information provided by the user to the the database
//         const user = await UserModel.create({ email, password });
//         //Send the user information to the next middleware
//         return done(null, user);
//     } catch (error) {
//         done(error);
//     }
// }));
// passport.use(new LocalStrategy(
//     function (req, res, next) {
//         // User.findOne({ username: username }, function (err, user) {
//         //     if (err) { return done(err); }
//         //     if (!user) { return done(null, false); }
//         //     if (!user.validPassword(password)) { return done(null, false); }
//         //     return done(null, user);
//         // });
//         console.log(req);
//         res.send('here');
//     }
// ));
// passport.use('', controller);
// passport.authenticate(LocalStratergy, { session: false }),
// module.exports = passport;