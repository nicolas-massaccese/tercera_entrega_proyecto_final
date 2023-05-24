const { loggerDefault, loggerWarn } = require('../helpers/loggerConf');
const { randomBytes } = require('crypto')
const { sendNewMailOrder }  = require('../helpers/sendNewMailOrder');
const { sendNewWhatsappOrder }  = require('../helpers/sendNewWhatsappOrder');
const { Cart } = require("../models/cart");
const User = require("../models/user");

// const helpers  = require('../helpers');


const handleResponse = (result, res) => {
    if (result.result === 'success') {
        loggerDefault.info(`Order sent!!! Message Id is ${result.messageId}`);
        res.send(`Order sent!!! Message Id is ${result.messageId}`);
    } else {
        loggerDefault.warn(`Failed to send order, reasons: ${result.message}`);
        loggerWarn.warn(`Failed to send order, reasons: ${result.message}`);
        res.status(500).send(`Failed to send order, reasons: ${result.message}`)
    }
};

const sendCartOrder = async (req, res) => {
    const userData = req.session.user_data;

    const email = userData.email
    console.log(email);
    const user = await User.findOne({email:email});

    
    const productsInCart = await Cart.find();
 
    const number = user.phone;
    console.log(number);
    console.log(user.firstname);


    // if (!productsInCart) {
    //     res.status(500).send('there are no products in the cart');

    //     // helpers.sendNewMailOrder();
    //     // helpers.sendNewWhatsappOrder();
    //     return;
    // }
    sendNewMailOrder(productsInCart, user);
    const result =  await sendNewWhatsappOrder(number, randomBytes(8).toString('hex'),true);
    handleResponse(result, res);
};

module.exports = sendCartOrder;