const path = require ('path');
require('dotenv').config()
const process = require('process')
const yargs = require('yargs/yargs')(process.argv.slice(2));

const mongoUri = process.env.MONGO_URI

const config = yargs.alias(
    {
        p: 'puerto',
        m: 'modo'
    }, 
)
.default({
    puerto: 3000,
    modo: 'FORK'
}).argv; 

module.exports = { mongoUri, config };
module.exports.accountSid = process.env.ACCOUNT_SID;
module.exports.authToken = process.env.AUTH_TOKEN;
module.exports.number = process.env.NUMBER;
module.exports.whatsappNumber = process.env.WHATSAPP_NUMBER;
