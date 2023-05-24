const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const cartSchema = new Schema( {
    name: { type: String, required: true, unique:true },
    img: { type: String, required: true },
    amount: { type: Number, required: true },
    price: { type: Number, required: true },
})

const Cart = model('Cart', cartSchema);

module.exports = {Cart};