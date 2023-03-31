const express = require('express');
const session = require('express-session');

const app = express();
app.use(session({ secret: 'secreto' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const users = [];

app.post('/signup', (req, res) => {
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
