const express = require('express');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser')
const { connectToDb } = require('./config/connectToDb.js');
const path = require ('path');
const flash = require('connect-flash');

const app = express();


require('./config/auth');

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(session({ secret: 'secreto', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session())

const multer = require('multer');
const mimeTypes = require('mime-types');
const { createProduct, createUser } = require('./controller/create');
const { default: mongoose } = require('mongoose');
const { productRead, userRead } = require('./controller/read');


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/uploads/');
    },
    filename: function(req, file, cb) {
        // cb("", Date.now() + "." + mimeTypes.extension(file.mimetype));
        cb("", "avatar" + "." + mimeTypes.extension(file.mimetype));
    },
});

const maxSize = 1 * 1024 * 1024 // 1MB

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if(file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Solo se permiten subir archivos en formato .png, .jpg y .jpeg'));
        }
    },
    limits: { fileSize: maxSize }
});

app.get('/signup', (req, res) => {
    res.sendFile(path.resolve(__dirname, './public/signup.html'));

});


app.post('/signup', upload.single('avatar'), passport.authenticate('signup', {
    successRedirect:'/login',
    failureRedirect:'/signup',
    passReqToCallback: true

}));


app.get('/login', (req, res) => {
    res.sendFile(path.resolve(__dirname, './public/login.html'));

});

app.post('/login', passport.authenticate('login', {
    successRedirect:'/home.html',    
    failureRedirect:'/login',
    passReqToCallback: true

}));

// app.post('/login', passport.authenticate('login', {
//     successRedirect:'/home',    
//     failureRedirect:'/login',
//     passReqToCallback: true

// }), (req, res) => {

//     req.session.username = req.user.username;
//     res.redirect('/home.html');
// });

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.sendFile(path.resolve(__dirname, './public/logout.html'));
    })
});


app.get('/home', async (req, res) => {
    const products = await productRead();
    const user = await userRead();

    res.json(products, user);
});



connectToDb()
    // .then( async () => await create())
    // .then( async () => await read())
    .then(() => app.listen(3000, () => console.log('Ready!')))


