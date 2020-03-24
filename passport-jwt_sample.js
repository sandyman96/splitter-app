const passport = require('passport');
const JwtStrategy = require("passport-jwt").Strategy;
const bodyParser = require('body-parser');
const ExtractJwt = require("passport-jwt").ExtractJwt;

const expressApp = require('express')();

//  expressApp.set("env", config.env);
expressApp.set("port", 3000);
expressApp.set("hostname", "localhost");
// add middleware to parse the json
expressApp.use(passport.initialize()); /////////////////////////////////////////////
expressApp.use(bodyParser.json());
expressApp.use(
bodyParser.urlencoded({
    extended: false
})
);
// passport.use('login', new LocalStrategy(
//     {
//         usernameField: 'username',
//         passwordField: 'password',
//         session: false
//     },
//     (username, password, done) => {
//         return done(null, "success");
//     }
// )
// );

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "secret";
// opts.issuer = "accounts.examplesoft.com";
// opts.audience = "yoursite.net";

passport.use( new JwtStrategy(opts, function(jwt_payload, done) {
    console.log("reached");
    // User.findOne({ id: jwt_payload.sub }, function(err, user) {
    //   if (err) {
    //     return done(err, false);
    //   }
    //   if (user) {
    //     return done(null, user);
    //   } else {
    //     return done(null, false);
    //     // or you could create a new account
    return (null, "user: user");
    })
);

expressApp.get(
  "/this",
  passport.authenticate("jwt", { session: false }),

  (req, res, next) => {
    res.send("this atleast");
  }
);


expressApp.listen(expressApp.get("port"), function(err) {
if (err) {
throw err;
}
//   console.log("Express server listening on - http://" + hostname + ":" + port);
console.log('listening');
});

