const { Product } = require("../models/product");

const createProduct = async () => {
    const productsToAdd = [
        {
            nombre: 'Dunkerque',
            descripcion: 'bolso',
            precio: 4990,
            foto: 'http..',
            stock: 7
        },
        {
            nombre: 'Yetstring',
            descripcion: 'bolso',
            precio: 4320,
            foto: 'http..',
            stock: 5
        },
        {
            nombre: 'Alpha',
            descripcion: 'mochila',
            precio: 3350,
            foto: 'http..',
            stock: 5
        },
        {
            nombre: 'Amelia',
            descripcion: 'mochila',
            precio: 2860,
            foto: 'http..',
            stock: 3
        },
        {
            nombre: 'IFR',
            descripcion: 'bolso de vuelo',
            precio: 2300,
            foto: 'http..',
            stock: 8
        },
        {
            nombre: 'Halcón',
            descripcion: 'bolso de vuelo',
            precio: 1700,
            foto: 'http..',
            stock: 5
        },
        {
            nombre: 'F16',
            descripcion: 'bolso de vuelo',
            precio: 1280,
            foto: 'http..',
            stock: 5
        },
        {
            nombre: 'Dunkerque Compact',
            descripcion: 'morral',
            precio: 900,
            foto: 'http..',
            stock: 2
        },
        {
            nombre: 'fels',
            descripcion: 'cartera',
            precio: 580,
            foto: 'http..',
            stock: 3
        },
        {
            nombre: '1000-FT Wallet',
            descripcion: 'billetera',
            precio: 120,
            foto: 'http..',
            stock: 8
        }
    ];

    const promises = productsToAdd.map(product => {
        const newProduct = new Product(product);

        return newProduct.save();
    });

    await Promise.all(promises);
};
const createUser = async () => {
    const usersToAdd = [
        {
            username: req.session.username,
            password: req.session.password,
            address: req.session.address,
            age: req.session.age,
            phoneNumber: req.session.phoneNumber
        },
        
    ];

    const promises = usersToAdd.map(user => {
        const newUser= new User(user);

        return newUser.save();
    });

    await Promise.all(promises);
};
module.exports = { createProduct, createUser };