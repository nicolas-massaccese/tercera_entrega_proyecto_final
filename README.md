# TERCERA ENTREGA PROYECTO FINAL
=============

## Iniciación

Iniciamos la app con el siguiente comando:

 `node index.js` 


## Funcionamiento

Al iniciar nuestra app e ingresar a [home](http://localhost:3000/) recibimos un mensaje de bienvenida y la indicación de que debemos registrar un usuario y loguearnos para poder ingresar a la ruta [profile](http://localhost:3000/profile) y acceder al contenido (en este caso la lista de todos los productos) que estamos trayendo de nuestra base de datos (Mongo Atlas). Esta ruta [profile](http://localhost:3000/profile) esta bloqueada mediante el seguiente middleware de autenticación implementado en el archivo **isAuthenticated.js**  desde la carpeta **Helpers**.

**isAuthenticated.js**
```
function isAuthenticated(req, res, next) {

    if(req.isAuthenticated()){
        return next()
    }else{
        req.flash('errorMsg', 'Not authorized');

        res.redirect('/');
    }
};

module.exports = {isAuthenticated};
```
**usersApiRouter.js**

```
const express = require('express');
const Router = require('express');
const passport = require('passport');

const {isAuthenticated} = require('../helpers/isAuthenticated')

usersApiRouter.get('/profile', isAuthenticated, async (req, res ) => {

    const userData = req.session.user_data;

    const products = await productRead();
    
    res.render('profile', {products:products, userData})
});
```
La unica forma de acceder a dicha ruta es que el usuario este registrado y logueado.


### Implementación de Passport, Bcrypt y Nodemailer

Dentro de la carpeta config en el archivo **auth.js** implementé Passport para poder autenticar un usuario a través de un **username** y una **password** en las rutas de [signup](http://localhost:3000/signup) y [login](http://localhost:3000/login).
Dentro de la carpeta **helpers** en el archivo **sendNewRegisterMail.js** implementé Nodemailer para notoficar via mail que se ha registrado un nuevo usuario. Ejecutamos dicha funcion en el archivo **auth.js** luego de guardar el nuevo usuario en nuestra base de datos.
```
const passport = require("passport");
const {Strategy: LocalStrategy} = require('passport-local');

const User = require('../models/user');
const {sendNewRegisterMail} =require('../helpers/sendNewRegisterMail')
const { loggerDefault, loggerWarn } = require('../helpers/loggerConf');


passport.serializeUser((user, done) => {
    done(null, user)
});

passport.deserializeUser((id, done) => {
    const user = User.findById(id)
    done(null, user)
});

passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    
    const user = await User.findOne({email:email});

    if(user !== undefined && user !== null ){
        loggerDefault.warn('The email already exists!');
        loggerWarn.warn('The email already exists!');
        return done(null, false, req.flash('signupMessage', 'The email already exists!'));
    } else {
        
        const newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        newUser.firstname = req.body.firstname;
        newUser.adress = req.body.adress;
        newUser.age = req.body.age;
        newUser.phone = req.body.phone;

        await newUser.save();
        sendNewRegisterMail(newUser);
        done(null, newUser);
    }

}));

passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    
    const user = await User.findOne({email:email});
    if(user === null){
        loggerDefault.warn('No user found!');
        loggerWarn.warn('No user found!');
        return done(null, false, req.flash('loginMessage', 'No user found!'));
    }
    if (!user.comparePassword(password)) {
        loggerDefault.warn('Incorrect password!');
        loggerWarn.warn('Incorrect password!');
        return done(null, false, req.flash('loginMessage', 'Incorrect password!'));
    }else{
    const regUser = new User();
    regUser.email = email;
    regUser.password = regUser.encryptPassword(password);
    regUser.firstname = req.body.firstname;
    regUser.adress = req.body.adress;
    regUser.age = req.body.age;
    regUser.phone = req.body.phone;
    loggerDefault.info(regUser)
    return done(null, regUser);
}
}));
```

Desde aquí encripté en el signup el **password** antes de guardar el nuevo usuario en mi base de datos a travez del metodo de Bcrypt que estoy importando desde mi Schema de usuario de Mongo, implementado en el archivo **user.js** desde la carpeta models.

```
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

const userSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    firstname: { type: String, required: true },
    adress: { type: String, required: true },
    age: { type: String, required: true },
    phone: { type: String, required: true },
});

userSchema.methods.encryptPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync (10));
};

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('users', userSchema);
```

También ejecuté las validaciones necesarias para chequear en el [signup](http://localhost:3000/signup) si ya existe un usuario ya registrado con el username recientemente ingresado o para verigicar en el [login](http://localhost:3000/login) si el usurio y la contraseña ingresadas fueron correctas.

En caso de que algunas de esats validaciones de error evio al front un mensaje  a travez de la libreria **Flash**  mediante un middleware que es instanciado desde el servidor.

```
const flash = require('connect-flash');

app.use(flash());


app.use((req, res, next) => {
    res.locals.signupMessage = req.flash('signupMessage');
    res.locals.loginMessage = req.flash('loginMessage');
    res.locals.errorMsg = req.flash('errorMsg');
    next();
});
```

### Implementación de Mensaje de Whatsap con Twilio 

La logica del carrito no esta terminada pero al dirigirte a la ruta [sendCartOrder](http://localhost:3000/products-cart/sendCartOrder') se enviará automaticamente un mail notificando el detalle de la compra y un mensaje de Whatsapp indicando que el pedido ha sido recibido y el mismo se en cuentra en proceso. Dichas funciones estan implementadas en la carpeta **helpers** dentro de los archivos **sendNewMailOrder.js** y **sendNewWhatsappOrder.js** respectivamente.

```
const nodemailer = require('nodemailer')
require('dotenv').config()


const sendNewMailOrder = async (productsInCart, user) => {

    const transporter = nodemailer.createTransport({
        host: process.env.HOST,
        port: 587,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        }
    });
    
    let info = await transporter.sendMail({
        from: `"Raul Lindgren" <${process.env.EMAIL}>`, // sender address
        to: process.env.EMAIL, // list of receivers
        subject: `Nuevo Pedido de ${user.firstname} ${user.email} ✔`, // Subject line
        text: `Productos comprados: ${productsInCart.name}
                Cantidad: ${productsInCart.amount}
        `, // plain text body
        html: `<p><b>Productos comprados:</b> ${productsInCart.name}</p>
                <p><b>Cantidad:</b> ${productsInCart.amount}</p>
        `, // html body
    });
    
    console.log(`done ${info}`);
    
}
module.exports= { sendNewMailOrder };
```

```
const twilio = require('twilio');
const { accountSid, authToken, number, whatsappNumber } = require('../config/enviroment')
require('dotenv').config()


const sendNewWhatsappOrder = async (to, body, sendToWhatsapp) => {
    try{ 
        const from = sendToWhatsapp ? whatsappNumber : number; 
        const sendTo = sendToWhatsapp ? `whatsapp:+54${to}` : `+54${to}`;
        const client = twilio(accountSid, authToken);
        const message = await client.messages.create({
            body: `Su pedido ${body} ha sido recibido y se encuentra en proceso`,
            from,
            to: sendTo,
        });

        return {
            result: 'success',
            messageId: message.sid,
        };
    } catch (err) {
        return {
            result: 'error',
            messageId: err.message,
        }
    }    
};
module.exports= {sendNewWhatsappOrder}
```

### Front

La vista de mis enpoint las estoy renderizando desde el servidor a travez del motor de plantillas EJS. Los archivos EJS estan guardadnos en la carpeta **views**

Dentro de la carpeta **public** tengo un **index.js** que realiza un fetch con metodo GET a la ruta [profile](http://localhost:3000/profile) desde la cual estoy trayendo los productos de mi base de datos.

```
async function getData(url) {
    try {
    const response = await fetch(url);
    
    const responseData = await response.json();
    let htmlString = '';
    responseData.forEach(products => {
        // desestructurando cada producto
        const {_id, foto, nombre, descripcion, tamanio, precio} = products

        htmlString +=`<article class="cardBox">
                                    <figure class="fotoProducto">
                                        <img src="${foto}" alt="">
                                    </figure>
                                    <div class="marcoSkew">
                                        <h4 class="modelo">${nombre}</h4>
                                    </div>
                                    
                                    <figure class="estrellaFigure">
                                        <img class="afueraCarrito" id="${_id}" src="assets/img/estrella_tienda.svg" alt="">
                                    </figure>
                                    
                                    <div class="detalle">
                                        <img class="afueraCarrito" id="${_id}" src="assets/img/sumar_a_carrito.svg" alt="">
                                    </div>

                                    <div class="caracteristicas">
                                        <p class="tipo">${descripcion}</p>
                                        <div class="barra"></div>
                                        <p class="medida">${tamanio}</p>
                                    </div>
                                    <p class="precio">${precio}</p>
                                    <button class="addProduct">Agregar a carrito</button>
                                </article>`
    });
    document.getElementById('productList').innerHTML = htmlString
    console.log(htmlString);
    } catch (error) {
    console.error(error);
    }
};

getData('/profile')
```

Dentro de la carpeta **public** tambien hay un archivo **style.css** para darle estilo al front.

### Log4js
Dentro de la carpeta **helpers** en el archivo **loggerConf.js** implementé la libreria Log4js para reemplazar todos los console.log y los console.error discriminando entre info, warnings y errors. la información arroojada por estos se imprimira por consola y como complemento solo se guardaran los warnings y los errors dentro del directorio raíz en dos archivos distinitos. **error.log** y **warn.log** 

### Modo Fork y Modo Cluster
Para ejecutar el servidor  **index.js** en modo  **FORK** realizarlo a travez del siguiente comando:
node --prof index.js
Para ejecutar el servidor  **index.js** en modo  **CLUSTER** realizarlo a travez del siguiente comando:
node  index.js -p 8080 -m CLUSTER

La configuración de dichos parámetros esta implementada en la carpeta **public** dentrod el archivo **enviroment.js** a traves de la libreria **YARGS**

### Artilliery Resultados
En el directorio raíz hay dos archivos **result_cluster.txt** y**result_fork.tx** que contienen los resultados de los test realizados con artilliery apuntando a la ruta  [profile](http://localhost:3000/profile) que es la que tiene la vista de todos los productos.

Comandos ejecutados:
artillery quick --count 50 -n 50 "http://localhost:3000/profile" > result_fork.txt
artillery quick --count 50 -n 50 "http://localhost:8080/profile" > result_cluster.txt

### .env.template
En este archivo estan los templates de las variables implementadas en el .env que no fue subido ya que el mismo contiene información sensible