const passport = require('passport');
const {Strategy: LocalStrategy} = require('passport-local');
// const { hashSync, compareSync } = require('bcrypt');

const {User} = require('../model/users');

// const salt = bcrypt.genSaltSync(saltRounds);
// const hash = bcrypt.hashSync(myPlaintextPassword, salt);

// const users = [];

// passport.serializeUser(function(user, done) { 
//     done(null, user.username);
// });

// passport.deserializeUser(function(username, done) {
//     const user = users.find(user => user.username === username);
//     done(null, user);
// });


passport.serializeUser(function(username, done) {
    done(null, username.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});



// passport.use('login', new LocalStrategy((username, password, done) => {

//     const user = users.find(user => user.username === username && compareSync(password, user.password));

//     if(user) {
//         done(null, user);
//         return;
//     }
//     done(null, false);
// }));



passport.use('signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {

    // const user = User.findOne({username: username});

    // if(user){
    //     return done(null, false, req.flash('signupMessage','El usuario ya existe'));
    // }
        const newUser = new User();
        console.log({newUser});
    
        newUser.username = username ;
        newUser.password = newUser.encryptPassword(password);
        await newUser.save();
        console.log({newUser});
    
        done(null, newUser);

}));

passport.use('login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {

    const user = User.findOne({username: username});

    // if(!user){
    //     return done(null, false, req.flash('signupMessage','El usuario no existe'));
    // }
    // if(!user.comparePassword(password)){
    //     return done(null, false, req.flash('signupMessage','Contraseña Incorrecta'));
    // }
    console.log(user)

    done(null, user);

}));




// passport.use('signup', new LocalStrategy((username, password, done) => {

//     const existentUser = users.find(user => user.username === username);

//     if(existentUser) {
//         done(new Error('El usuario ya existe'));
//         return;
//     }

//     const user = { username, password: hashSync(password, 10) };
//     console.log({user});
//     users.push(user);

//     return done(null, user);
// }));

// passport.use('signup', new LocalStrategy((username, password, done) => {

//     const existentUser = users.find(user => user.username === username);

//     if(existentUser) {
//         done(new Error('El usuario ya existe'));
//         return;
//     }

//     const user = { username, password: hashSync(password, 10) };
//     console.log({user});
//     users.push(user);

//     return done(null, user);
// }));