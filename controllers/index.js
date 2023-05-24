const getProducts = require('./getProducts');
const getProductsCart = require('./getProductsCart');
const addProductsCart = require('./addProductsCart');
const putProduct = require('./putProduct');
const deleteProduct = require('./deleteProduct');
const sendCartOrder = require('./sendCartOrder');

module.exports = {
    getProducts,
    getProductsCart,
    addProductsCart,
    putProduct,
    deleteProduct,
    sendCartOrder,
};