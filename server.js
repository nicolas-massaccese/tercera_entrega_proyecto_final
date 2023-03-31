const express = require('express');
const session = require('express-session');

const app = express();

const multer = require('multer');
const mimeTypes = require('mime-types');

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: function(req, file, cb){
        // cb("", Date.now() + "." + mimeTypes.extension(file.mimetype));
        cb("", "avatar" + "." + mimeTypes.extension(file.mimetype));

    }

});
const upload = multer({
    storage: storage
}); 


app.use(session({ secret: 'secreto' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const users = [];

app.post('/signup', upload.single('avatar'), (req, res) => {
    const { userName, password} = req.body;

    // validacion
    const existentUser = users.find(user => user.userName === userName);

    if (existentUser) {
        res.status(403).send('Datos invalidos');
        return; 
    }
    users.push({ userName, password});
    req.session.userName = userName;

    res.redirect('/home');
});




app.post('/login', (req, res) => {
    const { userName, password} = req.body;

    // verificar si las credenciales del usuario son validas HAY  QUE IR A LA BASE DE DATOS
    
    const user = users.find(user => user.userName === userName && user.password === password);

    if (!user) {
        res.status(403).send('Datos invalidos');
        return;
    }

    req.session.userName = userName;
    res.redirect('/home');
});


app.get('/home', (req, res) => {

    if (req.session.userName) {
        res.send(`Hola ${req.session.userName} bienvenido`);
        return;
    }

    req.session.userName = userName;
    res.redirect('/login');
});

app.listen(3000, () => console.log('Ready!'));
