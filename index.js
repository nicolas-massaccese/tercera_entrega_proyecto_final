const express = require('express');
const cors = require('cors');
const path = require('path');
const engine = require('ejs-mate');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const { config, a, b, c, d } = require('./config/enviroment.js');


const cluster = require('cluster');
const { connect } = require('http2');
const numCpus = require('os').cpus().length;

if (config.m == 'CLUSTER' && cluster.isPrimary) {
    console.log({numCpus});
    // console.log('cluster');
    console.log(`Master ${process.pid} running`);

// Creamos tantos procesos hijo por CPU que tengamos
    for (i = 0; i < numCpus ; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork();
    })
} else {

    // initializations
    const app = express();
    const { connectToDb } = require('./config/database.js');
    require('./config/auth.js');
    // const { createProduct } = require('./controller/create.js');
    const { loggerError, loggerWarn, loggerDefault } = require('./helpers/loggerConf.js');


    // settings
    app.set('views', path.join(__dirname, 'views'));
    app.engine('ejs', engine);
    app.set('view engine', 'ejs');
    app.set('port', process.env.PORT || 3000);


    // middlewares
    app.use(morgan('dev'));
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({extended: false}));
    app.use(express.static('public'));

    app.use(session({
        secret: 'mysecretsession',
        resave: false,
        saveUninitialized: false
    }));
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());

    app.use((req, res, next) => {
        res.locals.signupMessage = req.flash('signupMessage');
        res.locals.loginMessage = req.flash('loginMessage');
        res.locals.errorMsg = req.flash('errorMsg');
        // res.locals.userOk = req.flash('userOk');
        res.locals.user = req.user;
        next();
    });


    // routes
    const { usersApiRouter } = require('./routes/usersApiRouter.js');
    const { cartApiRouter } = require('./routes/cartApiRouter.js');
    app.use(usersApiRouter);
    app.use(cartApiRouter);

    app.get('*', (req, res) => {
        const {url, method} = req
        loggerWarn.warn(`Ruta ${method} ${url} inexistentes`);
        res.send(`Ruta ${method} ${url} inexistentes`);
    });
        
    // starting server
    connectToDb()
        .then(() => app.listen(config.p, () => loggerDefault.info(`Ready in port ${config.p} !`)))
        .catch((error) => loggerError.error(`Error en servidor ${error}`));
};