const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

const userSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    firstname: { type: String, required: true },
    adress: { type: String, required: true },
    age: { type: String, required: true },
    phone: { type: String, required: true },
});

userSchema.methods.encryptPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync (10));
};

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('users', userSchema);
