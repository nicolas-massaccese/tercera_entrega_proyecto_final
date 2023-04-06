const mongoose = require('mongoose');

const { mongoUser, mongoPass, mongoDb, mongoUri } = require('../enviroment.js');


let isConnected;

const connectToDb = async () => {
    if(!isConnected) {
        console.log('nueva conexion');
        await mongoose.connect(mongoUri)
        isConnected = true;
        return;
    }

    console.log('conexion existente');
    return;
}

module.exports = { connectToDb };