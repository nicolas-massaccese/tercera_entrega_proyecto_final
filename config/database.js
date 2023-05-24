const mongoose = require('mongoose');
const { mongoUri } = require('./enviroment.js');
const { loggerDefault, loggerWarn, loggerError } = require('../helpers/loggerConf');

let isConnected = false;

const connectToDb = async () => {

    try {
        await mongoose.connect(mongoUri);
        loggerDefault.info('nueva conexion');
    } catch (error) {
        
        loggerError.error('conexion inexistente');
        console.error('Error al conectar a la base de datos:', error);
    }
    // if(!isConnected) {
    //     loggerDefault.info('nueva conexion');
    //     const xx = await mongoose.connect(mongoUri);
    //     console.log(xx);
    //     isConnected = true;
    //     return;
    // }
    // loggerWarn.warn('conexion existente');
    // return;
}

module.exports = { connectToDb };

