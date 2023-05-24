const { Product } = require("../models/product");
const { loggerWarn, loggerDefault } = require('../helpers/loggerConf');

const getProducts = async (req, res) => {
    const products = await Product.find();

    if (products) {
        res.json({products});
    } else {
        loggerDefault.warn('Products not found');
        loggerWarn.warn('Products not found');
        res.json({msg: 'Products not found'});
    }
};

module.exports = getProducts;