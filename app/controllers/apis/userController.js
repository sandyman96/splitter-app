/********
* user.js file (controllers/apis)
********/
const userService = require('../../services/users/userService');
const expressRouter = require('express')();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


expressRouter.use(passport.initialize());


passport.use(new LocalStrategy((username, password, done) => 
        {
            // console.log("ivde");
            // if (username === 'test@gmail.com' && password === '1234') {
            //     return done(null, { username: 'test@gmail.com' });
            // } else {
            //     return done(null, false);
            // }
            return done(null, "user");
            return true;
    }
));

function thanilocalfunction (){
    console.log("inside local function");
    return (req,res, next) => {
        return next();
    }
}

expressRouter.get('/dashboard', (req,res,next) => { res.send("the return");})
expressRouter.get('/', userService.getUsers);
expressRouter.post('/register', userService.createUsers );
// expressRouter.post('/login', passport.authenticate('local', { successRedirect: '/api/v1/users',
//     failureRedirect: '/api/v1/users/dashboard' }));

expressRouter.post('/login', thanilocalfunction(), userService.userLogin);
// }) );
// expressRouter.post('/login', userService.login);

// ,userService.login);

// expressRouter.get('/:id', userService.getUserById);

// expressRouter.post('/', userService.createUser);

// expressRouter.put('/:id', userService.updateUser);

// expressRouter.delete('/:id', userService.deleteUser);

module.exports = expressRouter;

/********
* user.js file (controllers/apis)
********/
