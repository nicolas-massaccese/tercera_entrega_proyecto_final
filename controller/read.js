const { Product } = require("../model/products");
const { User } = require("../model/users");

const productRead = async () => {
    const sortedProducts = await Product.find({})
    // console.log(sortedProducts);
    return sortedProducts;
};

const userRead = async () => {
    const sortedUsers = await User.find({})
    // console.log(sortedProducts);
    return sortedUsers;
};
module.exports = { productRead, userRead }