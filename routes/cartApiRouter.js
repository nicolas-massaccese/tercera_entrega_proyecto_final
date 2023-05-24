const express = require('express');
const Router = require('express');
const controllers  = require('../controllers');

const cartApiRouter = new Router()

cartApiRouter.get('/products', controllers.getProducts);

cartApiRouter.get('/products-cart', controllers.getProductsCart);

cartApiRouter.get('/products-cart/sendCartOrder', controllers.sendCartOrder);

cartApiRouter.post('/products-cart', controllers.addProductsCart);

cartApiRouter.put('/products-cart/:productId', controllers.putProduct);

cartApiRouter.delete('/products-cart/:productId', controllers.deleteProduct);

module.exports = { cartApiRouter };
