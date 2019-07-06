var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');


var userSchema = new mongoose.Schema ({
    email: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    hash: String,
    salt: String
    });

userSchema.method.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pdkdf2Sync(password, this.salt, 1000, 64).toString('hex');

};

userSchema.method.validPassword = function (password) {
    var hash = crypto.pdkdf2Sync(password, this.salt, 1000, 64).toString('hex');
    return this.hash === hash;
};

userSchema.method.generateJwt = function () {
    var expiry = new Date();
    expiry.setDate(expiry.getDate()+7);

    return jwt.sign ({
        _id: this._id,
        email: this.email,
        name: this.name,
        exp: parseInt(expiry.getTime() / 1000),
    }, process.env.JWT_SECRET);
    };

mongoose.model('User', userSchema);
