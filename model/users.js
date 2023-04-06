const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

const userSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    // address: { type: String, required: true },
    // age: { type: Number, required: true },
    // phoneNumber: { type: Number, required: true },
});

userSchema.methods.encryptPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model('users', userSchema);
module.exports = {User}