const { Product } = require("../models/product");
const { Cart } = require("../models/cart");
const { loggerDefault, loggerWarn, loggerError } = require('../helpers/loggerConf');


const addProductsCart = async (req, res) => {
    const { name, img, price} = req.body;

    // Nos fijamos si el producto existe
    const productsExist = await Product.findOne({ name });

    // Nos fijamos si todos los campos vienen con info
    const itsNotEmpty    = name !== '' && img !== '' && price !== '';

    // Nos fijamos si el producto existe en el carrito
    const productsInACart = await Cart.findOne({ name });

    // Si no tenemos el producto
    if (!productsExist) {
        loggerDefault.warn('This product is not found in the database');
        loggerWarn.warn('This product is not found in the database');
        res.status(400).json({
            msg:'This product is not found in the database'
        })

    // Si nos envian algo y no esta en el carrito lo agregamos
    } else if (itsNotEmpty && !productsInACart) {
        const newProductsInACart = new Cart({ name, img, price, amount: 1 });

    // Actualizamos la propiedad InCart
    await Product.findByIdAndUpdate(
        productsInACart?._id,
        { inCart: true, name, img, price },
        { new: true }
    )
        .then((product) => {
            newProductsInACart.save();
            loggerDefault.info('The product was added to the cart');
            res.json({
                msg:'The product was added to the cart',
                product,
            }); 
        })
        
        .catch((error) => {
            loggerDefault.error('Ups! The product was not added to the cart');
            loggerError.error('Ups! The product was not added to the cart');
            console.error('Ups! The product was not added to the cart', error)
            })
    } else if (productsInACart) {
        loggerDefault.info('The product is already in the cart');
        res.status(400).json({
            msg:'The product is already in the cart'
        });
    }
};
module.exports = addProductsCart;