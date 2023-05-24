const { Product } = require("../models/product");
const { Cart } = require("../models/cart");
const { loggerDefault, loggerError } = require('../helpers/loggerConf');


const deleteProduct = async (req, res) => {
    const { productId } = req.params;

    // Buscamos el producto en el carrito
    const productInACart = await Cart.findById({ productId });
    
    // Buscamos el producto en nuestra DB por el nombre dl que esta en el carrito
    const { name, img, price, _id } = await Product.findOne({ name: productInACart.name });
    
    // Buscamos y eliminamos l producto por _id
    await Cart.findByIdAndDelete({ productId });

    await Product.findByIdAndUpdate(
        _id,
        { inCart: false, name, img, price },
        { new: true }
    )
        .then((product) => {
            loggerDefault.info(`The product ${product.name} was removed`);
            res.json({
                msg:`The product ${product.name} was removed`,
            }); 
        })
        .catch((error) => {
            loggerDefault.error('Ups! The product was removed' );
            loggerError.error('Ups! The product was removed' );
            console.error('Ups! The product was removed', error);
        })
};
module.exports = deleteProduct;