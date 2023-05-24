const { Cart } = require("../models/cart");
const { loggerWarn, loggerDefault } = require('../helpers/loggerConf');

const getProductsCart = async (req, res) => {
    const productsCart = await Cart.find();

    if (productsCart) {
        res.json({ productsCart });
    } else {
        loggerDefault.warn('There are no products in the cart' );
        loggerWarn.warn('There are no products in the cart' );
        res.json({ msg: 'There are no products in the cart' });
    }
};

module.exports = getProductsCart;