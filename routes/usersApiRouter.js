const express = require('express');
const Router = require('express');
const passport = require('passport');
const { productRead, userRead } = require('../controllers/read');
const {isAuthenticated} = require('../helpers/isAuthenticated')
const { loggerDefault, loggerWarn, loggerError } = require('../helpers/loggerConf');
const { upload } = require('../helpers/multer')



const usersApiRouter = new Router()


usersApiRouter.get('/', (req, res, next) => {
    const userData = req.session.user_data;

    res.render('index',{userData})
});


usersApiRouter.get('/signup', (req, res, next) => {
    const userData = req.session.user_data;

    res.render('signup',{userData})

});


usersApiRouter.post('/signup', upload.single('avatar'), passport.authenticate('local-signup', {
    failureRedirect: '/signup',
    passReqToCallback: true
}),
function(req, res, next){
        // req.flash('userData', req.body)
    res.redirect('/login');

});

usersApiRouter.get('/login', (req, res, next) => {
    const userData = req.session.user_data;

    res.render('login',{userData});

});


usersApiRouter.post('/login', passport.authenticate('local-login', {
        failureRedirect: '/login',
        passReqToCallback: true,
    }),
function(req, res, next){
    req.session.user_data = req.body;
    res.redirect('/profile');

});


usersApiRouter.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    })
});


usersApiRouter.get('/profile', isAuthenticated, async (req, res ) => {
    
    // flash metodo
    // delete req.session.user_data;
    // const userData = req.flash('userData')[0];


    const userData = req.session.user_data;
    const products = await productRead();
    

    res.render('profile', {products:products, userData})

});


module.exports = { usersApiRouter };
