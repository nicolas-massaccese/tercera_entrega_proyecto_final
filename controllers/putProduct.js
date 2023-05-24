const { loggerDefault, loggerWarn, loggerError } = require('../helpers/loggerConf');
const { Cart } = require("../models/cart");

const putProduct = async (req, res) => {
    const { productId } = req.params;
    const { query } = req.query;
    const { body } = req.body;

    // Buscamos el producto en el carrito
    const searchProduct = await Cart.findById({ productId });

    // Si no hay query 'add' o 'del'
    if (!query) {
        loggerDefault.warn('You must send a query');
        loggerWarn.warn('You must send a query');
        res.status(400).json({ msg: 'You must send a query' });

    // Si esta el producto y quiero agregar
    } else if (searchProduct && query === 'add') {
        body.amount = body.amount + 1;

    await Cart.findByIdAndUpdate(productId, body, {
        new: true,
    }).then((product) => {
        loggerDefault.info( `The product ${product.name} was updated`);
        res.json({
            msg: `The product ${product.name} was updated`,
            product,
        }); 
    });
    // Si esta el producto y quiero eliminar
    } else if (searchProduct && query === 'del') {
        body.amount = body.amount - 1;

        await Cart.findByIdAndUpdate(productId, body, {
            new: true,
        }).then((product) => {
            loggerDefault.info( `The product ${product.name} was removed`);
            res.json({
                msg: `The product ${product.name} was removed`,
                product,
            }); 
        });
    } else {
        loggerDefault.warn('Ups! an error occurred');
        loggerWarn.warn('Ups! an error occurred');
        res.status(400).json({ msg: 'Ups! an error occurred' });
    }
};
module.exports = putProduct;